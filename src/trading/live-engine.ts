import type { Side, Tick } from "../types.js";

export interface LiveOrderIntent {
  side: Side;
  tick: Tick;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
}

/**
 * Safety boundary for future authenticated execution.
 *
 * This adapter deliberately refuses to send orders until the authenticated
 * Polymarket Perps session lifecycle and live-order safeguards are completed
 * and tested. Keeping the refusal here prevents strategy code from becoming
 * an accidental live-order path.
 */
export class LiveEngine {
  async open(_intent: LiveOrderIntent): Promise<never> {
    throw new Error(
      "Live execution safety lock is active. No real order was sent."
    );
  }

  async closeAll(): Promise<never> {
    throw new Error(
      "Live execution safety lock is active. No real order was sent."
    );
  }
}
