import assert from "node:assert/strict";
import { resolveLiveInstrumentFromList } from "../src/trading/live-instrument.js";

const instruments=[{
  id:7,
  category:"crypto",
  symbol:"BTC-USD",
  baseAsset:"BTC",
  quoteAsset:"USD",
  fundingInterval:3600,
  quantityDecimals:3,
  priceDecimals:2,
  priceBounds:{min:"1",max:"1000000"},
  liquidationFee:"0.01",
  maxOrderCount:100,
  minNotional:"10",
  maxMarketNotional:"5000",
  maxLimitNotional:"10000",
  maxLeverage:"5",
  isolatedOnly:false,
  riskTiers:[]
}];
const resolved=resolveLiveInstrumentFromList("BTC",instruments as never);
assert.equal(resolved.instrumentId,7);
assert.equal(resolved.symbol,"BTC-USD");
assert.deepEqual(resolved.rules,{minNotional:10,maxMarketNotional:5000,maxLeverage:5,quantityDecimals:3,isolatedOnly:false});
assert.throws(()=>resolveLiveInstrumentFromList("ETH",instruments as never),/not found/);
assert.throws(()=>resolveLiveInstrumentFromList("BTC",[{...instruments[0],maxLeverage:"bad"}] as never),/metadata is invalid/);
console.log("live instrument tests passed");
