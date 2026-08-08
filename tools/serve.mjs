/**
 * site/ papkasini mahalliy ko'rish uchun oddiy statik server.
 * Hech qanday paketga bog'liq emas — faqat Node.
 *
 * Ishlatish:  node tools/serve.mjs      ->  http://localhost:4321
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const ROOT = join(import.meta.dirname, '..', 'site');
const PORT = Number(process.env.PORT) || 4321;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

createServer(async (req, res) => {
  // so'rov yo'lini tozalaymiz: query'ni olib tashlab, papkadan chiqishni bloklaymiz
  let path = decodeURIComponent(req.url.split('?')[0]);
  if (path.endsWith('/')) path += 'index.html';
  const file = join(ROOT, normalize(path).replace(/^(\.\.[/\\])+/, ''));

  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not a file');
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': body.length,
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch {
    // Netlify bilan bir xil xulq: topilmasa 404.html qaytariladi
    try {
      const body = await readFile(join(ROOT, '404.html'));
      res.writeHead(404, { 'Content-Type': MIME['.html'] }).end(body);
    } catch {
      res.writeHead(404).end('404');
    }
  }
}).listen(PORT, () => {
  console.log(`site/ -> http://localhost:${PORT}`);
});
