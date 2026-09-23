import type { PerpsSession } from "@polymarket/client";
import { LiveEngine, type LiveExecutionOptions } from "./live-engine.js";

export interface LiveRuntime {
  engine: LiveEngine;
  stop(): Promise<void>;
}

export async function startLiveRuntime(
  session: PerpsSession,
  options: LiveExecutionOptions
): Promise<LiveRuntime> {
  const engine = new LiveEngine(session, options);

  try {
    await engine.preflight();
    await engine.configureRisk();
    await engine.armDeadManSwitch();
    engine.startDeadManHeartbeat();
  } catch (error) {
    try {
      await engine.emergencyStop();
    } catch {
      // Preserve the original startup error. Emergency cleanup is best-effort.
    }
    throw error;
  }

  let stopped = false;
  return {
    engine,
    async stop() {
      if (stopped) return;
      stopped = true;
      await engine.shutdown();
    }
  };
}
