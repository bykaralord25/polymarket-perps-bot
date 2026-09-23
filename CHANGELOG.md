# Changelog

## 0.9.0

- Added safety-gated live execution architecture without enabling real orders in the default main path.
- Added authenticated session startup, automatic instrument/rule resolution and account preflight.
- Added leverage, minimum/maximum notional, quantity precision, stale-price and TP/SL geometry guards.
- Added dead-man auto-cancel heartbeat, emergency stop and graceful shutdown.
- Added fail-closed live startup orchestration and execution backend abstraction.
- Added live safety/runtime/bootstrap/instrument/startup automated tests.
- Added required `viem` runtime dependency for the official signer integration.
- Hardened dashboard file serving and state writes.
- Added explicit REAL vs SIMULATED market-data badge.
- Added price/EMA and RSI charts, PnL, position and trade statistics.
- Improved Windows launcher cleanup so its dashboard process is stopped with the bot.
- Updated beginner documentation for the delivered v0.9 behavior.

## 0.8.0

- Added local browser dashboard, charts, paper PnL, position and trade statistics.
- Added one-click dashboard launch on Windows.

## 0.7.0

- Added one-click Windows setup/start helpers and beginner-focused terminal output.
- First run defaults to PAPER + MOCK.

## 0.6.0

- Added authenticated Perps session and safety-locked live adapter infrastructure.

## 0.5.0

- Added GitHub Actions CI, reconnect backoff, Docker support and live safety boundary.

## 0.4.0

- Added paper-engine PnL, stop-loss, take-profit and signal-flip tests.
