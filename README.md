# Polymarket Perps Bot v1.0 RC1

Open-source TypeScript bot for experimenting with Polymarket Perps. **Paper mode remains the safe default.** v1.0 RC1 also contains an explicitly armed real-money runner for environments where Polymarket Perps is available and the user is permitted to use it.

## Beginner setup — paper mode

1. Install Node.js 24+.
2. Download the repository ZIP and extract it.
3. Double-click `SETUP.bat` once.
4. Double-click `START-BOT.bat`.
5. The local dashboard opens at `127.0.0.1:8787`.
6. Ctrl+C stops the bot; the launcher also closes its dashboard process.

First setup defaults to **PAPER + MOCK**, so it needs no wallet key and sends no real order.

## What the bot does

Price → EMA/RSI → LONG / SHORT / HOLD → risk checks → execution. Paper mode simulates execution. The dashboard shows market-data mode, charts, signal, paper balance, PnL, position and trade statistics.

`REAL POLYMARKET DATA` describes the data source; it does not by itself mean real-money execution.

## Real-money runner — RC / not live-service verified

The separate `npm run live` entry point can submit real orders. It is intentionally not started by `START-BOT.bat` and fails closed unless all live requirements are explicitly configured.

Before it can start, the local `.env` must contain the user's own credentials and the exact acknowledgement:

```env
LIVE_CONFIRM=I_UNDERSTAND_REAL_MONEY
LIVE_MAX_ORDER_NOTIONAL=25
POLYMARKET_PRIVATE_KEY=YOUR_LOCAL_PRIVATE_KEY
# POLYMARKET_DEPOSIT_WALLET=0x...   # only when required for your setup
```

Never put the real key in GitHub, an issue, screenshot, chat message or committed file. `.env` is ignored by Git.

Then the explicit command is:

```bash
npm run live
```

Live safeguards include official instrument/rule resolution, account preflight, leverage validation, minimum/maximum notional and quantity precision checks, stale-price blocking, TP/SL geometry checks, a local per-order notional cap, daily-loss guard, liquidation-state guard, refusal to stack another position in the same instrument, dead-man auto-cancel and cleanup on shutdown.

**RC1 limitation:** automated tests and CI are green, but a real-money Polymarket order has not been end-to-end integration-tested from this development environment. Do not treat RC1 as proof that live execution will work on your account/network. Polymarket's Perps API is experimental and may change.

## Main settings

| Setting | Meaning |
| --- | --- |
| `TRADING_MODE=paper` | Default simulated execution. |
| `MARKET_SOURCE=mock` | Local fake prices. |
| `MARKET_SOURCE=polymarket` | Public Polymarket Perps market data. |
| `SYMBOL=BTC` | Instrument symbol. |
| `RISK_PER_TRADE=0.01` | Risk-model fraction. |
| `MAX_LEVERAGE=2` | Configured leverage. |
| `STOP_LOSS_PCT=0.01` | Stop-loss distance. |
| `TAKE_PROFIT_PCT=0.02` | Take-profit distance. |
| `DAILY_LOSS_LIMIT_PCT=0.03` | Daily-loss guard. |
| `LIVE_MAX_ORDER_NOTIONAL=25` | Local maximum notional per live order. |

## Verification

```bash
npm install
npm run check
npm test
npm run build
```

## Network and security

TLS verification must remain enabled. Do not use certificate-verification bypasses. If Polymarket is unavailable from a network or region, this project does not bypass that restriction; use mock mode for offline development and follow applicable rules.

Never share private keys, seed phrases, API secrets or delegated credentials. Use a wallet/account whose loss exposure you understand before any real-money test.

## Disclaimer

Experimental software, not financial advice and not a profit guarantee. Perpetual futures and leverage can cause rapid losses. Users are responsible for keys, configuration, trades and compliance with applicable rules. This project is independent and is not affiliated with or endorsed by Polymarket.

## License

MIT
