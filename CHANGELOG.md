# Changelog

## 0.7.0

- Added one-click Windows `SETUP.bat` and `START-BOT.bat` helpers.
- First-run launcher defaults to safe `PAPER + MOCK` configuration.
- Added a cleaner terminal banner and beginner-focused startup information.
- Live execution remains safety-locked.

## 0.6.0

- Added authenticated Perps session bootstrap using the official TypeScript SDK.
- Added a dependency-injected live execution adapter for account snapshots, leverage configuration, IOC entry orders with TP/SL, cancel-all, and dead-man auto-cancel.
- Added mocked-session live adapter tests without sending real orders.
- Private keys remain local-only and are never required in source code.
- The main bot still fails closed for `TRADING_MODE=live`; real-money execution is not enabled until authenticated integration can be tested against the Perps service from a permitted environment.

## 0.5.0

- Added GitHub Actions CI on Node.js 24.
- Added WebSocket reconnect backoff tests and hardened reconnect behavior.
- Added an explicit live-execution safety boundary.
- Added tests proving the live adapter refuses real orders while the safety lock is active.
- Added Docker support and contributor safety guidance.
- Paper mode remains the only enabled execution mode.

## 0.4.0

- Added paper-engine PnL, stop-loss, take-profit and signal-flip tests.
- Verified TypeScript check, tests and build on Windows.
