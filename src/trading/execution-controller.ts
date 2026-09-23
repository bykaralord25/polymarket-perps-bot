export type ExecutionMode = "paper" | "live";

export interface ExecutionController {
  mode: ExecutionMode;
  canSendRealOrders: boolean;
}

export function createExecutionController(mode: ExecutionMode): ExecutionController {
  if (mode === "live") {
    throw new Error(
      "Live execution safety lock is active in this release. Real orders remain disabled."
    );
  }

  return {
    mode: "paper",
    canSendRealOrders: false
  };
}
