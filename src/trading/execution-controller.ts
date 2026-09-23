import type { LiveBootstrap } from "./live-bootstrap.js";

export type ExecutionMode = "paper" | "live";

export interface ExecutionBackend {
  mode: ExecutionMode;
  canSendRealOrders: boolean;
  stop(): Promise<void>;
}

export interface ExecutionFactoryOptions {
  liveBootstrap?: LiveBootstrap;
}

export interface PaperExecutionBackend extends ExecutionBackend {
  mode: "paper";
  canSendRealOrders: false;
}

export interface LiveExecutionBackend extends ExecutionBackend {
  mode: "live";
  canSendRealOrders: true;
  bootstrap: LiveBootstrap;
}

export function createPaperExecutionBackend(): PaperExecutionBackend {
  return {
    mode: "paper",
    canSendRealOrders: false,
    async stop() {}
  };
}

export function createLiveExecutionBackend(bootstrap: LiveBootstrap): LiveExecutionBackend {
  return {
    mode: "live",
    canSendRealOrders: true,
    bootstrap,
    async stop() {
      bootstrap.removeSignalHandlers();
      await bootstrap.runtime.stop();
    }
  };
}

export function createExecutionController(
  mode: ExecutionMode,
  options: ExecutionFactoryOptions = {}
): ExecutionBackend {
  if (mode === "paper") return createPaperExecutionBackend();

  if (!options.liveBootstrap) {
    throw new Error(
      "Live execution safety lock is active in this release. A verified live bootstrap is required."
    );
  }

  return createLiveExecutionBackend(options.liveBootstrap);
}
