export interface ShutdownTarget { stop(): Promise<void>; }

export function installGracefulShutdown(target: ShutdownTarget): () => void {
  let shuttingDown = false;

  const shutdown = (signal: NodeJS.Signals) => {
    if (shuttingDown) return;
    shuttingDown = true;
    void target.stop()
      .then(() => {
        console.log(`\nSafe shutdown completed after ${signal}.`);
        process.exitCode = 0;
      })
      .catch((error) => {
        console.error("\nSafe shutdown failed:", error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      });
  };

  const onSigInt = () => shutdown("SIGINT");
  const onSigTerm = () => shutdown("SIGTERM");
  process.once("SIGINT", onSigInt);
  process.once("SIGTERM", onSigTerm);

  return () => {
    process.off("SIGINT", onSigInt);
    process.off("SIGTERM", onSigTerm);
  };
}
