// Full render: node tools/render.mjs out.mp4 [workers] [fps] [t0] [t1]
// Splits the timeline across headless Chromium workers, each piping JPEG frames into its own ffmpeg,
// then concatenates the segments and muxes the narration.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.resolve(process.argv[2] || 'out.mp4');
const workers = parseInt(process.argv[3] || '4');
const fps = parseInt(process.argv[4] || '30');
const tmp = path.join(path.dirname(out), 'segments'); fs.mkdirSync(tmp, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch();
const probe = await browser.newPage();
await probe.goto(`http://127.0.0.1:${port}/index.html?render`);
const DURATION = await probe.evaluate(async () => { await window.ready; return G.DURATION; });
await probe.close();
const t0 = parseFloat(process.argv[5] ?? '0'), t1 = parseFloat(process.argv[6] ?? String(DURATION));
const total = Math.round((t1 - t0) * fps);
const per = Math.ceil(total / workers);
const started = Date.now();
let done = 0;

async function work(w) {
  const a = w * per, b = Math.min(total, a + per);
  if (a >= b) return null;
  const seg = path.join(tmp, `seg_${w}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-tune', 'animation', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  await page.goto(`http://127.0.0.1:${port}/index.html?render`);
  await page.evaluate(() => window.ready);
  for (let f = a; f < b; f++) {
    const t = t0 + f / fps;
    const b64 = await page.evaluate(t => { window.renderFrame(t); return document.getElementById('c').toDataURL('image/jpeg', 0.95).split(',')[1]; }, t);
    const buf = Buffer.from(b64, 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    done++;
    if (done % 150 === 0) { const el = (Date.now() - started) / 1000; console.log(`${done}/${total} frames  ${(done / el).toFixed(1)} fps  eta ${((total - done) / (done / el) / 60).toFixed(1)} min`); }
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await page.close();
  return seg;
}
const segs = (await Promise.all([...Array(workers).keys()].map(work))).filter(Boolean);
await browser.close(); server.close();
fs.writeFileSync(path.join(tmp, 'list.txt'), segs.map(s => `file '${s}'`).join('\n'));
const audio = path.join(root, 'narration.mp3');
await new Promise((res, rej) => {
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'),
    '-ss', String(t0), '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-af', 'apad', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
  ff.on('close', c => (c ? rej(new Error('ffmpeg mux failed')) : res()));
});
console.log(`wrote ${out} in ${((Date.now() - started) / 60000).toFixed(1)} min`);
