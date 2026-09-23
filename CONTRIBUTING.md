# Contributing

Thanks for helping improve Polymarket Perps Bot.

## Before opening a pull request

1. Use Node.js 24 or newer.
2. Run `npm install`.
3. Run `npm run check`, `npm test`, and `npm run build`.
4. Never commit private keys, seed phrases, API secrets, delegated Perps credentials, or a real `.env` file.
5. Keep paper trading as the default.

## Live execution changes

Changes that can send real orders must remain explicitly opt-in, include tests for failure paths, and preserve a hard separation between paper and live execution. The Polymarket Perps SDK is experimental, so live-related changes should be checked against the current official SDK before merge.
