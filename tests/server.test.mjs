import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

test('HTTP delivery serves both languages and enforces static-file boundaries', { timeout: 15000 }, async (t) => {
  const server = spawn(process.execPath, ['scripts/serve.mjs'], {
    cwd: new URL('../', import.meta.url),
    env: { ...process.env, PORT: '4174' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  t.after(async () => {
    if (server.exitCode === null) {
      server.kill('SIGTERM');
      await once(server, 'exit');
    }
  });
  await new Promise((resolve, reject) => {
    server.stdout.on('data', (chunk) => { if (chunk.toString().includes('Local:')) resolve(); });
    server.once('error', reject);
    server.once('exit', (code) => reject(new Error(`Preview server exited before ready: ${code}`)));
  });
  const get = (path, options) => fetch(`http://127.0.0.1:4174${path}`, options);
  for (const [path, locale] of [['/', 'en'], ['/ko/', 'ko'], ['/projects/placia/', 'en'], ['/ko/projects/whiskory/', 'ko']]) {
    const response = await get(path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('content-type'), /^text\/html/);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.ok((await response.text()).includes(`<html lang="${locale}">`));
  }
  const redirect = await get('/ko/projects?source=test', { redirect: 'manual' });
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get('location'), '/ko/projects/?source=test');
  for (const path of ['/studio/', '/ko/studio/', '/studio.css', '/.git/config', '/.openai/hosting.json', '/%2e%2e%2fpackage.json', '/content/projects.mjs', '/missing/deep/path']) {
    const response = await get(path);
    assert.equal(response.status, 404, path);
    assert.ok(!(await response.text()).includes('appgprj_'));
  }
  const missingKo = await get('/ko/missing/deep/page');
  const missingHtml = await missingKo.text();
  assert.ok(missingHtml.includes('<html lang="ko">'));
  assert.ok(missingHtml.includes('href="/ko/projects/index.html"'));
  const bad = await get('/%E0%A4%A');
  assert.equal(bad.status, 400);
  const post = await get('/', { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');
  const head = await get('/style.css', { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  const script = await get('/script.js');
  assert.match(script.headers.get('content-type'), /^text\/javascript/);
  for (const [path, type] of [['/assets/screens/placia-atlas.webp', 'image/webp'], ['/assets/screens/whiskory-collection.png', 'image/png']]) {
    const image = await get(path);
    assert.equal(image.status, 200);
    assert.equal(image.headers.get('content-type'), type);
    assert.ok((await image.arrayBuffer()).byteLength > 1000);
  }
});
