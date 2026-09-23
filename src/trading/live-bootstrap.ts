import type { PerpsSession } from "@polymarket/client";
import { installGracefulShutdown } from "./graceful-shutdown.js";
import { startLiveRuntime, type LiveRuntime } from "./live-runtime.js";
import type { LiveExecutionOptions } from "./live-engine.js";
import { resolveLiveInstrument, type ResolvedLiveInstrument } from "./live-instrument.js";

export interface LiveBootstrap {
  runtime: LiveRuntime;
  instrument: ResolvedLiveInstrument;
  removeSignalHandlers: () => void;
}

export async function bootstrapLiveExecution(
  session: PerpsSession,
  options: Omit<LiveExecutionOptions, "instrumentId" | "instrumentRules"> & { symbol: string },
  resolveInstrument: (symbol: string) => Promise<ResolvedLiveInstrument> = resolveLiveInstrument
): Promise<LiveBootstrap> {
  if (!options.enabled) {
    throw new Error("Live bootstrap refused: explicit live enable is required.");
  }

  const instrument = await resolveInstrument(options.symbol);
  const runtime = await startLiveRuntime(session, {
    enabled: true,
    instrumentId: instrument.instrumentId,
    leverage: options.leverage,
    autoCancelMs: options.autoCancelMs,
    maxOrderNotional: options.maxOrderNotional,
    maxPriceAgeMs: options.maxPriceAgeMs,
    instrumentRules: instrument.rules
  });
  const removeSignalHandlers = installGracefulShutdown(runtime);
  return { runtime, instrument, removeSignalHandlers };
}
