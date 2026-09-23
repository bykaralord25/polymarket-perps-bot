# Polymarket Perps Bot

An open-source starter for experimenting with automated strategies on Polymarket Perps.

The bot is **paper-only by default**. It can read public Polymarket Perps market data, generate EMA/RSI signals, size positions with configurable risk rules, simulate trades, and write trade events locally. Real order execution is intentionally disabled.

> Polymarket's Perps APIs are marked experimental by the official SDK and may change.

## Current status

- Real public Polymarket Perps ticker feed over the official SDK/WebSocket
- Mock feed for offline development
- Paper trading only
- EMA crossover + RSI signal engine
- Configurable risk per trade
- Stop-loss / take-profit levels
- Maximum leverage and daily-loss guards
- JSONL trade/event log
- Basic indicator and risk-manager tests
- Friendly TLS/network failure messages

## Quick start

Requires Node.js 24+.

```bash
git clone https://github.com/bykaralord25/polymarket-perps-bot.git
cd polymarket-perps-bot
npm install
cp .env.example .env
npm run dev
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
npm.cmd run dev
```

If PowerShell blocks `npm.ps1`, use `npm.cmd` as shown above.

If Node reports a certificate-chain error and the required root CA is already trusted by your operating system, try:

```powershell
npm.cmd run dev:system-ca
```

Do **not** work around certificate errors with `NODE_TLS_REJECT_UNAUTHORIZED=0`, `curl -k`, or equivalent TLS-verification bypasses. If the Polymarket API is unavailable from your network or region, the bot cannot fix that locally; use `MARKET_SOURCE=mock` for offline development and follow the rules that apply where you are.

## Configuration

```env
TRADING_MODE=paper
MARKET_SOURCE=polymarket
SYMBOL=BTC
STARTING_BALANCE=10000
RISK_PER_TRADE=0.01
MAX_LEVERAGE=2
STOP_LOSS_PCT=0.01
TAKE_PROFIT_PCT=0.02
DAILY_LOSS_LIMIT_PCT=0.03
TICK_INTERVAL_MS=1000
```

Set `MARKET_SOURCE=mock` when you want to run the strategy without external market access. Keep `TRADING_MODE=paper`; live execution is not implemented yet.

## Development checks

```bash
npm run check
npm test
npm run build
```

## Project layout

```text
src/
  config.ts
  index.ts
  market/
    mock-feed.ts
    polymarket-feed.ts
  risk/risk-manager.ts
  strategy/
    indicators.ts
    signal-engine.ts
  trading/paper-engine.ts
  types.ts
tests/
  indicators.test.ts
  risk-manager.test.ts
```

## Roadmap

Next: harden reconnect/backoff behavior and expand paper-engine tests. After the public-data path is stable, the authenticated adapter can add explicit opt-in live execution, order placement/cancellation, leverage controls, TP/SL and dead-man/auto-cancel safety. Later milestones include backtesting, a dashboard, Telegram notifications, Docker and strategy plugins.

## Security

Never commit a private key, API secret, seed phrase, or real `.env` file. The repository ignores `.env`.

TLS verification should remain enabled. Live trading, when implemented, should require explicit opt-in and separate safety checks.

## Disclaimer

This software is for educational and experimental use. It does not provide financial advice or guarantee profit. Perpetual futures and leverage can cause rapid losses. Users are responsible for their own keys, configuration, trades, and compliance with applicable rules.

This project is independent and is not affiliated with or endorsed by Polymarket.

## License

MIT
