/**
 * Lokal önizləmə serveri (yalnız inkişaf üçün). Netlify davranışını təqlid edir:
 * /səhifə → səhifə.html, /səhifə/ → 301 /səhifə, tapılmayan → 404.html
 * İstifadə: node scripts/serve.mjs [port]
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.argv[2] || process.env.PORT || 8080);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
};

async function tryRead(rel) {
  try {
    return await readFile(path.join(DIST, rel));
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let p = decodeURIComponent(url.pathname);
  if (p.includes('..')) { res.writeHead(400).end(); return; }
  if (p.length > 1 && p.endsWith('/')) { res.writeHead(301, { Location: p.slice(0, -1) }).end(); return; }

  const candidates = p === '/' ? ['index.html'] : [p.slice(1), `${p.slice(1)}.html`];
  for (const c of candidates) {
    const body = await tryRead(c);
    if (body) {
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(c)] || 'application/octet-stream' }).end(body);
      return;
    }
  }
  const nf = await tryRead('404.html');
  res.writeHead(404, { 'Content-Type': TYPES['.html'] }).end(nf || 'Not found');
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
