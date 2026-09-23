import type { PerpsSession } from "@polymarket/client";
import { bootstrapLiveExecution, type LiveBootstrap } from "./live-bootstrap.js";
import { createExecutionController, type ExecutionBackend } from "./execution-controller.js";
import { createLivePerpsSession, type LiveSessionEnv } from "./live-session.js";
import type { ResolvedLiveInstrument } from "./live-instrument.js";

export interface LiveStartupOptions {
  symbol: string;
  leverage: number;
  autoCancelMs?: number;
  maxOrderNotional?: number;
  maxPriceAgeMs?: number;
}

export interface LiveStartupDependencies {
  createSession?: (env: LiveSessionEnv) => Promise<PerpsSession>;
  bootstrap?: (
    session: PerpsSession,
    options: {
      enabled: boolean;
      symbol: string;
      leverage: number;
      autoCancelMs?: number;
      maxOrderNotional?: number;
      maxPriceAgeMs?: number;
    },
    resolver?: (symbol: string) => Promise<ResolvedLiveInstrument>
  ) => Promise<LiveBootstrap>;
  resolveInstrument?: (symbol: string) => Promise<ResolvedLiveInstrument>;
}

export async function startLiveExecution(
  env: LiveSessionEnv,
  options: LiveStartupOptions,
  dependencies: LiveStartupDependencies = {}
): Promise<ExecutionBackend> {
  if (!env.privateKey?.trim()) {
    throw new Error("Live startup refused: private key is missing.");
  }
  if (!options.symbol?.trim()) {
    throw new Error("Live startup refused: symbol is missing.");
  }
  if (!Number.isFinite(options.leverage) || options.leverage <= 0) {
    throw new Error("Live startup refused: leverage must be positive.");
  }

  const createSession = dependencies.createSession ?? createLivePerpsSession;
  const bootstrap = dependencies.bootstrap ?? bootstrapLiveExecution;
  const session = await createSession(env);

  try {
    const liveBootstrap = await bootstrap(
      session,
      {
        enabled: true,
        symbol: options.symbol,
        leverage: options.leverage,
        autoCancelMs: options.autoCancelMs,
        maxOrderNotional: options.maxOrderNotional,
        maxPriceAgeMs: options.maxPriceAgeMs
      },
      dependencies.resolveInstrument
    );
    return createExecutionController("live", { liveBootstrap });
  } catch (error) {
    try {
      await session.close();
    } catch {}
    throw error;
  }
}
