import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAll } from './render.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const pages = renderAll();
for (const [path, html] of pages) {
  for (const directory of [root, output]) {
    const target = resolve(directory, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html, 'utf8');
  }
}
for (const asset of ['style.css', 'script.js', 'assets/favicon.svg', '_headers']) {
  const target = resolve(output, asset);
  await mkdir(dirname(target), { recursive: true });
  await cp(resolve(root, asset), target);
}
console.log(JSON.stringify({ event: 'portfolio_build_complete', pages: pages.size, output: 'dist' }));
