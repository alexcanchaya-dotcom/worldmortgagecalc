import { ImageResponse } from "next/og";

// Shared 1200x630 share card for og:image and twitter:image.
// Uses the default bundled font only (no external font fetches).
export const ogSize = { width: 1200, height: 630 };
export const ogAlt = "World Mortgage Calculator: free monthly payment and total interest estimates";

export function renderShareImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 45%, #10b981 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "rgba(255,255,255,0.18)",
              border: "2px solid rgba(255,255,255,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            W
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, opacity: 0.95 }}>worldmortgagecalc.com</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            World Mortgage Calculator
          </div>
          <div style={{ fontSize: 36, lineHeight: 1.3, opacity: 0.92, maxWidth: 960 }}>
            Monthly payment, total interest and a full amortization schedule. Free, and it runs in your browser.
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 26, fontWeight: 600 }}>
          {["Ireland", "UK", "US", "Spain", "Portugal"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "8px 20px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.35)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    ogSize,
  );
}
