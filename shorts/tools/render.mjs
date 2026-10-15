// node tools/render.mjs <short> <out.mp4> [workers=4] [fps=30]
// Parallel headless-Chromium workers → per-worker ffmpeg segments → concat + narration.
import { chromium } from 'playwright'; import { spawn } from 'node:child_process'; import path from 'node:path'; import fs from 'node:fs';
import { serve, repo } from './serve.mjs';
const [sid, outArg, wArg, fArg] = process.argv.slice(2);
const out = path.resolve(outArg), workers = parseInt(wArg || '4'), fps = parseInt(fArg || '30');
const tmp = path.join(path.dirname(out), `segments_${sid}`); fs.mkdirSync(tmp, { recursive: true });
const server = serve(), url = `http://127.0.0.1:${server.address().port}/shorts/index.html?render&s=${sid}`;
const browser = await chromium.launch();
const probe = await browser.newPage(); await probe.goto(url);
const DURATION = await probe.evaluate(async () => { await window.ready; return G.DURATION; }); await probe.close();
const total = Math.round(DURATION * fps), per = Math.ceil(total / workers), started = Date.now();
let done = 0;
async function work(w) {
  const a = w * per, b = Math.min(total, a + per); if (a >= b) return null;
  const seg = path.join(tmp, `seg_${w}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-tune', 'animation', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  await page.goto(url); await page.evaluate(() => window.ready);
  for (let f = a; f < b; f++) {
    const b64 = await page.evaluate(t => { window.renderFrame(t); return document.getElementById('c').toDataURL('image/jpeg', 0.95).split(',')[1]; }, f / fps);
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (++done % 300 === 0) { const el = (Date.now() - started) / 1000; console.log(`${done}/${total}  ${(done / el).toFixed(1)} fps  eta ${((total - done) / (done / el) / 60).toFixed(1)} min`); }
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await page.close(); return seg;
}
const segs = (await Promise.all([...Array(workers).keys()].map(work))).filter(Boolean);
await browser.close(); server.close();
fs.writeFileSync(path.join(tmp, 'list.txt'), segs.map(s => `file '${s}'`).join('\n'));
const audio = path.join(repo, 'shorts', 'out', `${sid}_narration.m4a`);
await new Promise((res, rej) => {
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'), '-i', audio,
    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-af', 'apad', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
  ff.on('close', c => (c ? rej(new Error('mux failed')) : res()));
});
console.log(`wrote ${out} in ${((Date.now() - started) / 60000).toFixed(1)} min`);
