import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT || 4173);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT must be an integer between 1024 and 65535.');
/** @type {Record<string, string>} */
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
const server = createServer(async (request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Cache-Control', 'no-cache');
  if (request.method !== 'GET' && request.method !== 'HEAD') { response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
  let pathname;
  let url;
  try { url = new URL(request.url || '/', 'http://localhost'); pathname = decodeURIComponent(url.pathname); }
  catch { response.writeHead(400).end('Bad request'); return; }
  if (pathname.split('/').some((segment) => segment.startsWith('.')) || pathname.includes('\0')) { response.writeHead(404).end('Not found'); return; }
  let target = resolve(root, `.${pathname}`);
  if (target !== resolve(root) && !target.startsWith(resolve(root) + sep)) { response.writeHead(404).end(); return; }
  try {
    if ((await stat(target)).isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        response.writeHead(308, { Location: `${url.pathname.replace(/^\/+/, '/')}/${url.search}` }).end();
        return;
      }
      target = resolve(target, 'index.html');
    }
    const data = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Content-Length': data.length });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (error) {
    const code = /** @type {NodeJS.ErrnoException} */ (error).code;
    if (code !== 'ENOENT' && code !== 'ENOTDIR') console.error(JSON.stringify({ event: 'portfolio_serve_error', code }));
    const fallback = await readFile(resolve(root, pathname.startsWith('/ko/') ? 'ko/404.html' : '404.html')).catch(() => Buffer.from('Not found'));
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : fallback);
  }
});
server.on('error', (error) => { console.error(JSON.stringify({ event: 'portfolio_server_error', code: /** @type {NodeJS.ErrnoException} */ (error).code })); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
for (const signal of /** @type {const} */ (['SIGINT', 'SIGTERM'])) process.on(signal, () => server.close());
