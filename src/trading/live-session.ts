import { createSecureClient, type PerpsSession } from "@polymarket/client";
import { privateKey } from "@polymarket/client/viem";

export interface LiveSessionEnv {
  privateKey: string;
  wallet?: string;
}

export async function createLivePerpsSession(env: LiveSessionEnv): Promise<PerpsSession> {
  const secureClient = await createSecureClient({
    signer: privateKey(env.privateKey),
    ...(env.wallet ? { wallet: env.wallet } : {})
  });
  return await secureClient.openPerpsSession({
    label: "polymarket-perps-bot"
  });
}
