export function printBanner(version: string, mode: string, source: string, symbol: string, balance: number): void {
  console.log("============================================================");
  console.log(`  POLYMARKET PERPS BOT  v${version}`);
  console.log("============================================================");
  console.log(`  Mode:    ${mode.toUpperCase()} (simulated execution)`);
  console.log(`  Market:  ${source.toUpperCase()}`);
  console.log(`  Symbol:  ${symbol}`);
  console.log(`  Balance: $${balance.toFixed(2)}`);
  console.log("------------------------------------------------------------");
  console.log("  Ctrl+C = stop bot");
  console.log("============================================================\n");
}
