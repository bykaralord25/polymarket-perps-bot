import { createPublicClient } from "@polymarket/client";
import type { LiveInstrumentRules } from "./live-engine.js";

export interface ResolvedLiveInstrument {
  instrumentId: number;
  symbol: string;
  rules: LiveInstrumentRules;
}

function normalizeSymbol(value: string): string {
  return value.trim().toUpperCase().replace(/[-_/](USD|USDC|USDT|PERP)$/i, "");
}

export async function resolveLiveInstrument(
  requestedSymbol: string
): Promise<ResolvedLiveInstrument> {
  const client = createPublicClient();
  const instruments = await client.fetchPerpsInstruments();
  const wanted = normalizeSymbol(requestedSymbol);
  const instrument = instruments.find((item) =>
    [item.symbol, String(item.baseAsset)].some(
      (candidate) => normalizeSymbol(candidate) === wanted
    )
  );

  if (!instrument) {
    throw new Error(`Live instrument "${requestedSymbol}" was not found.`);
  }

  const instrumentId = Number(instrument.id);
  const minNotional = Number(instrument.minNotional);
  const maxMarketNotional = Number(instrument.maxMarketNotional);
  const maxLeverage = Number(instrument.maxLeverage);
  const quantityDecimals = Number(instrument.quantityDecimals);

  if (
    !Number.isInteger(instrumentId) ||
    instrumentId <= 0 ||
    !Number.isFinite(minNotional) ||
    minNotional < 0 ||
    !Number.isFinite(maxMarketNotional) ||
    maxMarketNotional <= 0 ||
    !Number.isFinite(maxLeverage) ||
    maxLeverage <= 0 ||
    !Number.isInteger(quantityDecimals) ||
    quantityDecimals < 0
  ) {
    throw new Error("Live instrument metadata is invalid; execution blocked.");
  }

  return {
    instrumentId,
    symbol: instrument.symbol,
    rules: {
      minNotional,
      maxMarketNotional,
      maxLeverage,
      quantityDecimals,
      isolatedOnly: Boolean(instrument.isolatedOnly)
    }
  };
}
