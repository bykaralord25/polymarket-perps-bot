# Polymarket Perps Bot v0.9

Open-source TypeScript bot for experimenting with Polymarket Perps strategies. The delivered main application is **paper trading by default**. It includes a local dashboard plus safety-gated authenticated live infrastructure, but the main entry point does not automatically enable real-money trading.

## What happens when I start it?

The bot receives a market price, calculates EMA and RSI, produces LONG / SHORT / HOLD, applies risk rules, and simulates the position in the paper engine. The dashboard shows price, EMA, RSI, signal, paper balance, PnL, position, trade statistics and recent activity.

**REAL POLYMARKET DATA** means the price feed is from Polymarket. **SIMULATED MARKET DATA** means the local mock feed is being used. Both can still use paper execution.

## Easiest Windows setup

1. Install Node.js 24 or newer.
2. Download this repository as a ZIP and extract it.
3. Double-click `SETUP.bat` once.
4. Double-click `START-BOT.bat`.
5. The dashboard opens at `127.0.0.1:8787`.
6. Press Ctrl+C in the bot window to stop it. The launcher also closes its dashboard process.

On first setup the project creates a safe **PAPER + MOCK** configuration. No wallet key is needed for this mode.

## Settings

| Setting | Meaning |
| --- | --- |
| `TRADING_MODE=paper` | Simulated execution; default and delivered main mode. |
| `MARKET_SOURCE=mock` | Fake local prices for offline testing. |
| `MARKET_SOURCE=polymarket` | Public Polymarket Perps market data. |
| `SYMBOL=BTC` | Market to watch. |
| `STARTING_BALANCE=10000` | Paper starting balance. |
| `RISK_PER_TRADE=0.01` | Risk-model fraction per simulated trade. |
| `MAX_LEVERAGE=2` | Configured leverage ceiling. |
| `STOP_LOSS_PCT=0.01` | Stop-loss distance. |
| `TAKE_PROFIT_PCT=0.02` | Take-profit distance. |
| `DAILY_LOSS_LIMIT_PCT=0.03` | Paper daily-loss guard. |

## What is already implemented?

- Official Polymarket Perps public ticker/WebSocket feed and offline mock feed.
- EMA + RSI example strategy.
- Paper engine with LONG/SHORT, SL, TP, signal flips and JSONL logging.
- Local dashboard with charts, PnL, position and trade statistics.
- WebSocket reconnect/backoff and clear network/TLS errors.
- Automated tests for indicators, risk, paper execution and live safety layers.
- Authenticated live session adapter, automatic instrument/rule resolution, account preflight, leverage checks, max-notional/stale-price/precision/TP-SL guards, dead-man auto-cancel, graceful shutdown and fail-closed startup.
- GitHub Actions CI, Docker support and Windows one-click helpers.

The live infrastructure is deliberately separated from the default main execution path. It has been exercised with mocked sessions in automated tests; this repository does **not** claim a real-money order was successfully integration-tested.

## Developer commands

```bash
npm install
npm run check
npm test
npm run build
```

To run manually:

```bash
npm run dev
npm run dashboard
```

## Network / TLS

Do not disable TLS verification. If the operating system already trusts a required local CA, `npm run dev:system-ca` is available. If Polymarket is unavailable from your network or region, use `MARKET_SOURCE=mock` for offline development and follow applicable rules.

## Security

Never commit or share private keys, seed phrases, API secrets, delegated credentials or a real `.env`. The repository ignores `.env`. Live startup fails closed when required safety checks are not satisfied.

Polymarket's Perps APIs are marked experimental by its official SDK and may change.

## Disclaimer

This project is educational/experimental software, not financial advice and not a promise of profit. Perpetual futures and leverage can cause rapid losses. Users are responsible for keys, configuration, trades and compliance with applicable rules. This project is independent and is not affiliated with or endorsed by Polymarket.

## License

MIT
