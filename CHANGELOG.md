# Changelog

## 1.0.0-rc.1

- Added a separate explicitly armed real-money runner (`npm run live`).
- Live mode requires an exact acknowledgement plus locally supplied credentials.
- Added local per-order notional cap, daily-loss and liquidation guards.
- Refuses to stack a second position in the selected instrument.
- Preserves instrument constraints, stale-price, leverage, TP/SL, dead-man and graceful-shutdown protections.
- Added CI coverage for the live runner's required safety gates.
- Live service execution is RC-only until an end-to-end real-money integration test can be performed in a permitted/reachable environment.

## 0.9.0

- Added authenticated live infrastructure, automatic instrument/rule resolution and account preflight behind safety gates.
- Added local dashboard charts/stats, REAL vs SIMULATED data badge and hardened state serving.
- Added Windows setup/start helpers and dashboard-process cleanup.
- Added comprehensive automated tests and CI.

## 0.8.0

- Added local browser dashboard, charts, paper PnL, position and trade statistics.

## 0.7.0

- Added beginner Windows setup/start helpers. First run defaults to PAPER + MOCK.

## 0.6.0

- Added authenticated Perps session and safety-locked live adapter infrastructure.

## 0.5.0

- Added GitHub Actions CI, reconnect backoff, Docker support and live safety boundary.

## 0.4.0

- Added paper-engine PnL, stop-loss, take-profit and signal-flip tests.
