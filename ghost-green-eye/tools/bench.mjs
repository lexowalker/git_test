// Per-frame timing across the film: node tools/bench.mjs
import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const server = http.createServer((req, res) => { const p = path.join(root, decodeURIComponent(req.url.split('?')[0])); fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'content-type': p.endsWith('.js') ? 'text/javascript' : p.endsWith('.html') ? 'text/html' : 'application/octet-stream' }); res.end(d); }); }).listen(0);
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(`http://127.0.0.1:${server.address().port}/index.html?render`); await page.evaluate(() => window.ready);
const ts = process.argv.length > 2 ? process.argv.slice(2).map(Number) : [3, 12, 18, 25, 36.5, 39, 45, 57, 61, 70, 76, 82, 88, 95, 104, 112, 116, 125, 135, 140, 144, 148, 152, 160, 166, 172, 180, 192, 196, 202, 207];
for (const t of ts) {
  const r = await page.evaluate(t => { const a = performance.now(); window.renderFrame(t); const b = performance.now(); document.getElementById('c').toDataURL('image/jpeg', 0.95); return [b - a, performance.now() - b]; }, t);
  console.log(t, r[0].toFixed(0), 'ms render', r[1].toFixed(0), 'ms encode');
}
await browser.close(); server.close();
