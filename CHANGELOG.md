# Changelog

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
