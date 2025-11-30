import os


def _float(name: str, default: float) -> float:
    try:
        return float(os.getenv(name, default))
    except ValueError:
        return default


def _int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, default))
    except ValueError:
        return default


PRIVATE_KEY = os.getenv("PRIVATE_KEY", "")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
RPC_HTTPS = os.getenv("RPC_HTTPS", "https://api.mainnet-beta.solana.com")
JITO_TIP = _int("JITO_TIP", 10000)

BUY_AMOUNT_SOL = _float("BUY_AMOUNT_SOL", 0.5)
MAX_AGE_SECONDS = _int("MAX_AGE_SECONDS", 900)
MIN_LIQUIDITY_USD = _float("MIN_LIQUIDITY_USD", 20000)
MIN_HOLDERS = _int("MIN_HOLDERS", 50)
MAX_DEV_HOLDING_PCT = _float("MAX_DEV_HOLDING_PCT", 20)
MAX_TOP10_HOLDING_PCT = _float("MAX_TOP10_HOLDING_PCT", 60)
MIN_VOLUME_USD = _float("MIN_VOLUME_USD", 10000)
MIN_5M_PUMP_PCT = _float("MIN_5M_PUMP_PCT", 5)
HARD_STOP_LOSS_PCT = _float("HARD_STOP_LOSS_PCT", 0.3)
TRAILING_STOP_LOSS_PCT = _float("TRAILING_STOP_LOSS_PCT", 0.25)
SOL_PRICE_PROBE_RATIO = _float("SOL_PRICE_PROBE_RATIO", 0.01)

TELEGRAM_ALLOWED_USER = os.getenv("TELEGRAM_ALLOWED_USER")
