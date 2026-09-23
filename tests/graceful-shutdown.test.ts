import assert from "node:assert/strict";
import { installGracefulShutdown } from "../src/trading/graceful-shutdown.js";

let stops=0;
const remove=installGracefulShutdown({stop:async()=>{stops++}});
process.emit("SIGINT");
await new Promise(resolve=>setTimeout(resolve,0));
assert.equal(stops,1);
process.emit("SIGINT");
await new Promise(resolve=>setTimeout(resolve,0));
assert.equal(stops,1);
remove();
console.log("graceful shutdown tests passed");
