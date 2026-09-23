import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const port = Number(process.env.DASHBOARD_PORT ?? 8787);
const root = resolve("dashboard");

async function jsonFile(path: string, fallback: unknown) {
  try { return JSON.parse(await readFile(path, "utf8")); } catch { return fallback; }
}
async function trades() {
  try {
    const raw = await readFile("data/trades.jsonl", "utf8");
    return raw.trim().split("\n").filter(Boolean).slice(-25).reverse().map(line => JSON.parse(line));
  } catch { return []; }
}

const server = createServer(async (req, res) => {
  const path = req.url === "/" ? "/index.html" : req.url ?? "/index.html";
  if (path === "/api/health") {
    res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify({ ok: true, version: "0.8.0", execution: "paper-only" })); return;
  }
  if (path === "/api/state") {
    res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify(await jsonFile("data/dashboard-state.json", null))); return;
  }
  if (path === "/api/trades") {
    res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify(await trades())); return;
  }
  try {
    const file = await readFile(resolve(root, "." + path));
    const type = path.endsWith(".css") ? "text/css" : path.endsWith(".js") ? "text/javascript" : "text/html";
    res.writeHead(200, { "content-type": type }); res.end(file);
  } catch { res.writeHead(404); res.end("Not found"); }
});
server.listen(port, "127.0.0.1", () => console.log(`Dashboard: http://127.0.0.1:${port}`));
