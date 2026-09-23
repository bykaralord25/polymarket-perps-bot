import type { LiveBootstrap } from "./live-bootstrap.js";

export type ExecutionMode = "paper" | "live";

export interface ExecutionBackend {
  mode: ExecutionMode;
  canSendRealOrders: boolean;
  stop(): Promise<void>;
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

export function createExecutionController(mode: ExecutionMode): ExecutionBackend {
  if (mode === "live") {
    throw new Error(
      "Live execution safety lock is active in this release. Real orders remain disabled."
    );
  }
  return createPaperExecutionBackend();
}
