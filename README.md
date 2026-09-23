# Polymarket Perps Bot

Open source TypeScript bot for experimenting with Polymarket Perps. **Paper mode remains the safe default.** Version 1.0 RC1 also includes an explicitly enabled real money runner for environments where Polymarket Perps is available and the user is permitted to use it.

## Beginner setup for paper mode

1. Install Node.js 24 or newer.
2. Download the repository ZIP and extract it.
3. Double click `SETUP.bat` once.
4. Double click `START-BOT.bat`.
5. The local dashboard opens at `127.0.0.1:8787`.
6. Press Ctrl+C to stop the bot. The launcher also closes its dashboard process.

The first setup defaults to **PAPER + MOCK**. It does not need a wallet key and does not send real orders.

## What the bot does

The bot reads the market price, calculates EMA and RSI, produces a LONG, SHORT or HOLD signal, applies the configured risk checks and then executes the selected mode.

Paper mode simulates trading. The dashboard displays the market data mode, charts, signal, paper balance, PnL, position and trade statistics.

`REAL POLYMARKET DATA` describes the source of the price data. It does not mean that real money execution is active.

## Real money runner

The separate `npm run live` command can submit real orders. It is not started by `START-BOT.bat`. Live execution remains locked until all required settings are explicitly configured.

The local `.env` file must contain the user's own credentials and confirmation.

```env
LIVE_CONFIRM=I_UNDERSTAND_REAL_MONEY
LIVE_MAX_ORDER_NOTIONAL=25
POLYMARKET_PRIVATE_KEY=YOUR_LOCAL_PRIVATE_KEY
# POLYMARKET_DEPOSIT_WALLET=0x...
```

Never put a real private key in GitHub, an issue, screenshot, chat message or committed file. The local `.env` file is ignored by Git.

Start the live runner with:

```bash
npm run live
```

Live safeguards include official instrument rule resolution, account preflight, leverage validation, minimum and maximum notional checks, quantity precision checks, stale price protection, TP and SL validation, a local order notional cap, a daily loss guard, liquidation state protection, protection against opening another position in the same instrument, dead man auto cancel and cleanup during shutdown.

**RC1 limitation:** automated tests and CI pass, but a real money Polymarket order has not yet been verified end to end from this development environment. RC1 should therefore not be treated as proof that live execution will work on every account or network. The Polymarket Perps API is experimental and may change.

## Main settings

| Setting | Meaning |
| --- | --- |
| `TRADING_MODE=paper` | Default simulated execution. |
| `MARKET_SOURCE=mock` | Local simulated prices. |
| `MARKET_SOURCE=polymarket` | Public Polymarket Perps market data. |
| `SYMBOL=BTC` | Instrument symbol. |
| `RISK_PER_TRADE=0.01` | Risk model fraction. |
| `MAX_LEVERAGE=2` | Configured leverage. |
| `STOP_LOSS_PCT=0.01` | Stop loss distance. |
| `TAKE_PROFIT_PCT=0.02` | Take profit distance. |
| `DAILY_LOSS_LIMIT_PCT=0.03` | Daily loss guard. |
| `LIVE_MAX_ORDER_NOTIONAL=25` | Maximum local notional allowed for one live order. |

## Verification

```bash
npm install
npm run check
npm test
npm run build
```

## Network and security

TLS verification must remain enabled. Do not bypass certificate verification. If Polymarket is unavailable from a network or region, this project does not bypass that restriction. Mock mode remains available for offline development.

Never share private keys, seed phrases, API secrets or delegated credentials. Use a wallet and account whose loss exposure you understand before any real money test.

## Disclaimer

This is experimental software. It is not financial advice and it does not guarantee profit. Perpetual futures and leverage can cause rapid losses. Users are responsible for their keys, configuration, trades and compliance with applicable rules.

This project is independent and is not affiliated with or endorsed by Polymarket.

## License

MIT
