import base58
import logging
import threading
import time
from typing import Dict, Optional

import requests
from requests.adapters import HTTPAdapter, Retry
from solders.keypair import Keypair as SoldersKeypair
from solders.pubkey import Pubkey
from solders.transaction import VersionedTransaction
from telegram import BotCommand, Update
from telegram.ext import CallbackContext, CommandHandler, Updater

from config import (
    BUY_AMOUNT_SOL,
    HARD_STOP_LOSS_PCT,
    JITO_TIP,
    MAX_AGE_SECONDS,
    MAX_DEV_HOLDING_PCT,
    MAX_TOP10_HOLDING_PCT,
    MIN_5M_PUMP_PCT,
    MIN_HOLDERS,
    MIN_LIQUIDITY_USD,
    MIN_VOLUME_USD,
    PRIVATE_KEY,
    RPC_HTTPS,
    SOL_PRICE_PROBE_RATIO,
    TELEGRAM_ALLOWED_USER,
    TELEGRAM_BOT_TOKEN,
    TRAILING_STOP_LOSS_PCT,
)

SOL_MINT = "So11111111111111111111111111111111111111112"

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

http = requests.Session()
retries = Retry(total=5, backoff_factor=0.5, status_forcelist=[500, 502, 503, 504])
http.mount("https://", HTTPAdapter(max_retries=retries))
http.mount("http://", HTTPAdapter(max_retries=retries))

keypair = SoldersKeypair.from_base58(PRIVATE_KEY) if PRIVATE_KEY else None
wallet: Optional[Pubkey] = keypair.pubkey() if keypair else None

JUPITER_QUOTE = "https://quote-api.jup.ag/v6/quote"
JUPITER_SWAP = "https://quote-api.jup.ag/v6/swap"
PUMP_FUN_URL = "https://pump.fun/api/launches?limit=50"
JITO_URL = "https://mainnet.block-engine.jito.wtf/api/v1/bundles"

active_positions: Dict[str, Dict[str, float]] = {}
positions_lock = threading.Lock()
running_event = threading.Event()
main_thread: Optional[threading.Thread] = None


def safe_get(url: str, **kwargs) -> Optional[requests.Response]:
    try:
        response = http.get(url, timeout=kwargs.pop("timeout", 15), **kwargs)
        response.raise_for_status()
        return response
    except Exception as exc:
        logging.error("GET %s failed: %s", url, exc)
        return None


def safe_post(url: str, **kwargs) -> Optional[requests.Response]:
    try:
        response = http.post(url, timeout=kwargs.pop("timeout", 15), **kwargs)
        response.raise_for_status()
        return response
    except Exception as exc:
        logging.error("POST %s failed: %s", url, exc)
        return None


def get_quote(input_mint: str, output_mint: str, amount: int, slippage: float = 1.0) -> Optional[Dict]:
    params = {
        "inputMint": input_mint,
        "outputMint": output_mint,
        "amount": amount,
        "slippageBps": int(slippage * 100),
    }
    response = safe_get(JUPITER_QUOTE, params=params)
    if not response:
        return None
    try:
        data = response.json()
        if "error" in data:
            logging.warning("Quote error: %s", data.get("error"))
            return None
        return data
    except Exception as exc:
        logging.error("Quote parsing failed: %s", exc)
        return None


def send_bundle(serialized_tx: str) -> None:
    bundle = {"jsonrpc": "2.0", "id": 1, "method": "sendBundle", "params": [[serialized_tx]]}
    safe_post(JITO_URL, json=bundle)
    time.sleep(0.35)


def execute_swap(quote: Dict) -> Optional[str]:
    if not quote or not wallet or not keypair:
        return None
    payload = {
        "quoteResponse": quote,
        "userPublicKey": str(wallet),
        "wrapAndUnwrapSol": True,
        "computeUnitPriceMicroLamports": JITO_TIP,
    }
    response = safe_post(JUPITER_SWAP, json=payload)
    if not response:
        return None
    try:
        tx_b64 = response.json().get("swapTransaction")
        if not tx_b64:
            logging.error("Swap transaction missing in response")
            return None
        tx = VersionedTransaction.from_bytes(base58.b58decode(tx_b64))
        tx.sign([keypair])
        serialized = base58.b58encode(tx.serialize()).decode()
        send_bundle(serialized)
        return serialized
    except Exception as exc:
        logging.error("Swap execution failed: %s", exc)
        return None


def update_position(mint: str, data: Dict[str, float]) -> None:
    with positions_lock:
        active_positions[mint] = data


def remove_position(mint: str) -> None:
    with positions_lock:
        active_positions.pop(mint, None)


def auto_sell_monitor(mint: str, total_cost_lamports: int, tokens_bought: int) -> None:
    if tokens_bought <= 0:
        return
    sold_percent = 0.0
    amount_for_probe = max(int(tokens_bought * SOL_PRICE_PROBE_RATIO), 1)
    buy_price_per_token = total_cost_lamports / tokens_bought
    peak_price = buy_price_per_token
    update_position(
        mint,
        {
            "buy_price": buy_price_per_token,
            "tokens_bought": tokens_bought,
            "peak_price": peak_price,
            "sold_percent": sold_percent,
        },
    )

    while running_event.is_set() and sold_percent < 100.0:
        try:
            quote = get_quote(mint, SOL_MINT, amount_for_probe)
            if not quote:
                time.sleep(3)
                continue
            out_amount = int(quote.get("outAmount", 0))
            if out_amount <= 0:
                time.sleep(3)
                continue
            current_price_per_token = out_amount / amount_for_probe
            peak_price = max(peak_price, current_price_per_token)
            with positions_lock:
                if mint in active_positions:
                    active_positions[mint]["peak_price"] = peak_price

            tokens_remaining = tokens_bought * (1 - sold_percent / 100)
            sell_targets = [
                (30, 100 - sold_percent),
                (15, 20 if sold_percent < 90 else 100 - sold_percent),
                (7, 30 if sold_percent < 70 else 0),
                (3, 40 if sold_percent < 40 else 0),
            ]
            executed = False
            for multiple, percent_to_sell in sell_targets:
                if percent_to_sell <= 0:
                    continue
                if current_price_per_token >= buy_price_per_token * multiple:
                    amount = max(int(tokens_bought * (percent_to_sell / 100)), 1)
                    execute_swap(get_quote(mint, SOL_MINT, amount))
                    sold_percent += percent_to_sell
                    sold_percent = min(100.0, sold_percent)
                    executed = True
                    logging.info("Profit target reached for %s: sold %.2f%%", mint, percent_to_sell)
                    break

            if sold_percent >= 100:
                remove_position(mint)
                break

            if not executed:
                if current_price_per_token <= buy_price_per_token * (1 - HARD_STOP_LOSS_PCT):
                    amount = max(int(tokens_remaining), 1)
                    execute_swap(get_quote(mint, SOL_MINT, amount))
                    sold_percent = 100.0
                    logging.info("Hard stop triggered for %s", mint)
                elif current_price_per_token <= peak_price * (1 - TRAILING_STOP_LOSS_PCT):
                    amount = max(int(tokens_remaining), 1)
                    execute_swap(get_quote(mint, SOL_MINT, amount))
                    sold_percent = 100.0
                    logging.info("Trailing stop triggered for %s", mint)

            with positions_lock:
                if mint in active_positions:
                    active_positions[mint]["sold_percent"] = sold_percent

        except Exception as exc:
            logging.error("Monitor error for %s: %s", mint, exc)
        time.sleep(4)

    remove_position(mint)


def process_coin(coin: Dict) -> None:
    try:
        mint = coin.get("mint")
        if not mint:
            return
        liquidity = coin.get("liquidity_usd", 0)
        holders = coin.get("holder_count", 0)
        dev_hold = coin.get("dev_holding_percent", 100)
        top10_hold = coin.get("top10_holding_percent", 100)
        volume = coin.get("volume_usd", 0)
        price_change = coin.get("price_change_5m", 0)
        macd = coin.get("MACD_12_26_9", 0)

        if (
            liquidity < MIN_LIQUIDITY_USD
            or holders < MIN_HOLDERS
            or dev_hold > MAX_DEV_HOLDING_PCT
            or top10_hold > MAX_TOP10_HOLDING_PCT
            or volume < MIN_VOLUME_USD
            or price_change < MIN_5M_PUMP_PCT
            or macd <= 0
        ):
            return
        logging.info("ELITE LAUNCH DETECTED %s – Buying %.2f SOL", coin.get("name", mint), BUY_AMOUNT_SOL)
        quote = get_quote(SOL_MINT, mint, int(BUY_AMOUNT_SOL * 1e9))
        if not quote:
            return
        swap_result = execute_swap(quote)
        if not swap_result:
            return
        total_cost = int(quote.get("inAmount", 0))
        tokens_bought = int(quote.get("outAmount", 0))
        threading.Thread(target=auto_sell_monitor, args=(mint, total_cost, tokens_bought), daemon=True).start()
    except Exception as exc:
        logging.error("Process coin failed for %s: %s", coin.get("mint", "unknown"), exc)


def main_loop() -> None:
    seen = set()
    logging.info("CoinBot LIVE – Hunting elite launches")
    while running_event.is_set():
        try:
            response = safe_get(PUMP_FUN_URL)
            if not response:
                time.sleep(3)
                continue
            launches = response.json().get("launches", [])
            for coin in launches:
                mint = coin.get("mint")
                if not mint or mint in seen:
                    continue
                if coin.get("age_seconds", 100) > MAX_AGE_SECONDS:
                    continue
                seen.add(mint)
                threading.Thread(target=process_coin, args=(coin,), daemon=True).start()
        except Exception as exc:
            logging.error("Main loop error: %s", exc)
        time.sleep(2.8)


def start_bot(update: Update, context: CallbackContext) -> None:
    if TELEGRAM_ALLOWED_USER and update.effective_user and str(update.effective_user.id) != TELEGRAM_ALLOWED_USER:
        update.message.reply_text("Unauthorized user")
        return
    global main_thread
    if running_event.is_set():
        update.message.reply_text("Bot already running")
        return
    running_event.set()
    main_thread = threading.Thread(target=main_loop, daemon=True)
    main_thread.start()
    update.message.reply_text("Sniper bot started")


def stop_bot(update: Update, context: CallbackContext) -> None:
    if TELEGRAM_ALLOWED_USER and update.effective_user and str(update.effective_user.id) != TELEGRAM_ALLOWED_USER:
        update.message.reply_text("Unauthorized user")
        return
    running_event.clear()
    update.message.reply_text("Sniper bot stopping")


def status_cmd(update: Update, context: CallbackContext) -> None:
    status = "running" if running_event.is_set() else "stopped"
    update.message.reply_text(f"Status: {status}")


def balance_cmd(update: Update, context: CallbackContext) -> None:
    if not wallet:
        update.message.reply_text("Wallet not configured")
        return
    payload = {"jsonrpc": "2.0", "id": 1, "method": "getBalance", "params": [str(wallet)]}
    response = safe_post(RPC_HTTPS, json=payload)
    if not response:
        update.message.reply_text("Failed to fetch balance")
        return
    try:
        lamports = response.json().get("result", {}).get("value", 0)
        sol = lamports / 1e9
        update.message.reply_text(f"Balance: {sol:.4f} SOL")
    except Exception as exc:
        logging.error("Balance parsing failed: %s", exc)
        update.message.reply_text("Balance unavailable")


def positions_cmd(update: Update, context: CallbackContext) -> None:
    with positions_lock:
        if not active_positions:
            update.message.reply_text("No active positions")
            return
        lines = []
        for mint, data in active_positions.items():
            lines.append(
                f"{mint}\n  buy_price: {data.get('buy_price', 0):.8f}\n  peak: {data.get('peak_price', 0):.8f}\n  sold: {data.get('sold_percent', 0):.2f}%"
            )
        update.message.reply_text("\n\n".join(lines))


def setup_telegram() -> None:
    if not TELEGRAM_BOT_TOKEN:
        logging.error("TELEGRAM_BOT_TOKEN not set; Telegram control disabled")
        return
    updater = Updater(TELEGRAM_BOT_TOKEN, use_context=True)
    dispatcher = updater.dispatcher
    dispatcher.add_handler(CommandHandler("start", start_bot))
    dispatcher.add_handler(CommandHandler("stop", stop_bot))
    dispatcher.add_handler(CommandHandler("status", status_cmd))
    dispatcher.add_handler(CommandHandler("balance", balance_cmd))
    dispatcher.add_handler(CommandHandler("positions", positions_cmd))
    updater.bot.set_my_commands(
        [
            BotCommand("start", "Start the sniper bot"),
            BotCommand("stop", "Stop the sniper bot"),
            BotCommand("status", "Show bot status"),
            BotCommand("balance", "Show SOL balance"),
            BotCommand("positions", "Show active positions"),
        ]
    )
    updater.start_polling()
    updater.idle()


def run() -> None:
    if not keypair or not wallet:
        logging.error("PRIVATE_KEY not configured")
    setup_telegram()


if __name__ == "__main__":
    run()
