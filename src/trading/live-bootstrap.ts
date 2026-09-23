import type { PerpsSession } from "@polymarket/client";
import { installGracefulShutdown } from "./graceful-shutdown.js";
import { startLiveRuntime, type LiveRuntime } from "./live-runtime.js";
import type { LiveExecutionOptions } from "./live-engine.js";

export interface LiveBootstrap {
  runtime: LiveRuntime;
  removeSignalHandlers: () => void;
}

export async function bootstrapLiveExecution(
  session: PerpsSession,
  options: LiveExecutionOptions
): Promise<LiveBootstrap> {
  if (!options.enabled) {
    throw new Error("Live bootstrap refused: explicit live enable is required.");
  }

  const runtime = await startLiveRuntime(session, options);
  const removeSignalHandlers = installGracefulShutdown(runtime);
  return { runtime, removeSignalHandlers };
}
