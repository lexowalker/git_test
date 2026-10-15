// tiny static server rooted at the repo (shorts reuse ../ghost-green-eye assets)
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
export const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.m4a': 'audio/mp4', '.mp3': 'audio/mpeg' };
export function serve() {
  const s = http.createServer((req, res) => {
    const p = path.join(repo, decodeURIComponent(req.url.split('?')[0]));
    fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
  }).listen(0);
  return s;
}
