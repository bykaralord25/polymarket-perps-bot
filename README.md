# Polymarket Perps Bot

An open-source starter for experimenting with automated strategies on Polymarket Perps.

The project starts in **paper mode** on purpose. It includes a small signal engine, position sizing, stop-loss / take-profit logic, a paper execution engine, trade logging, and a clean path for wiring the official Polymarket SDK into live execution later.

> Polymarket's Perps APIs are currently marked experimental by the official SDK. Expect breaking changes while the API evolves.

## What works in v0.1

- Paper trading by default
- EMA crossover + RSI signal engine
- Configurable risk per trade
- Stop-loss and take-profit levels
- Maximum leverage guard
- Daily loss guard
- JSONL trade/event log
- Mock market feed so the project runs immediately
- Live mode is intentionally blocked until the authenticated Polymarket adapter is implemented and tested

## Quick start

Requirements: Node.js 24+.

```bash
git clone https://github.com/bykaralord25/polymarket-perps-bot.git
cd polymarket-perps-bot
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
npm run dev
```

You should see paper signals and simulated trades in the terminal. Events are written to `data/trades.jsonl`.

## Configuration

Edit `.env`:

```env
TRADING_MODE=paper
SYMBOL=BTC
STARTING_BALANCE=10000
RISK_PER_TRADE=0.01
MAX_LEVERAGE=2
STOP_LOSS_PCT=0.01
TAKE_PROFIT_PCT=0.02
DAILY_LOSS_LIMIT_PCT=0.03
```

Keep `TRADING_MODE=paper` until you understand the strategy and risks.

## Project layout

```text
src/
  config.ts
  index.ts
  market/mock-feed.ts
  risk/risk-manager.ts
  strategy/indicators.ts
  strategy/signal-engine.ts
  trading/paper-engine.ts
  types.ts
```

## Roadmap

The next milestone is the official Polymarket Perps adapter: public market data, authenticated session handling, order placement/cancellation, leverage updates, TP/SL, WebSocket reconnects, and a dead-man/auto-cancel safety switch. After that: dashboard, backtesting, Telegram notifications, Docker, and strategy plugins.

## Security

Never commit a private key, API secret, seed phrase, or real `.env` file. This repository ignores `.env` by default.

Live trading is deliberately not enabled in v0.1. When it is added, it will require an explicit opt-in and separate safety checks.

## Disclaimer

This software is for educational and experimental use. It does not provide financial advice and does not guarantee profit. Perpetual futures and leverage can cause rapid losses. You are responsible for your own keys, configuration, trades, and compliance with the rules that apply to you.

This project is independent and is not affiliated with or endorsed by Polymarket.

## License

MIT
