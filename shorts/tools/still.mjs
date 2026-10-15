// node tools/still.mjs <short> <outDir> t1 t2 ...   → PNG frames (and sheet.png, 4 columns)
import { chromium } from 'playwright'; import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
import { serve } from './serve.mjs';
const [sid, outDir, ...times] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const server = serve();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('console', m => console.log('[page]', m.text())); page.on('pageerror', e => console.log('[pageerror]', e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/shorts/index.html?render&s=${sid}`);
await page.evaluate(() => window.ready);
const files = [];
for (const t of times) {
  await page.evaluate(t => window.renderFrame(t), parseFloat(t));
  const f = path.join(outDir, `f_${parseFloat(t).toFixed(2).padStart(7, '0')}.png`);
  await page.locator('#c').screenshot({ path: f }); files.push(f);
}
await browser.close(); server.close();
execFileSync('python3', ['-c', `
import sys
from PIL import Image
fs=sys.argv[2:]; ims=[Image.open(f).resize((360,640)) for f in fs]
cols=min(4,len(ims)); rows=(len(ims)+cols-1)//cols; s=Image.new('RGB',(360*cols,640*rows),'white')
for i,im in enumerate(ims): s.paste(im,((i%cols)*360,(i//cols)*640))
s.save(sys.argv[1])`, path.join(outDir, 'sheet.png'), ...files]);
