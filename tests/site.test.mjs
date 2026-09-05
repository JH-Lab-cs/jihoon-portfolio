import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { parseHTML } from 'linkedom';
import { renderAll, renderHome, renderProject, escapeHtml, pagePath } from '../scripts/render.mjs';
import { projects } from '../content/projects.mjs';
import { copy, contactEmail } from '../content/site.mjs';
import { capabilities, investigations } from '../content/engineering.mjs';

const pages = renderAll();
const documents = new Map([...pages].map(([path, html]) => [path, parseHTML(html).document]));
const assets = new Set(['style.css', 'script.js', 'assets/favicon.svg']);

test('both languages include every project and the existing public routes', () => {
  assert.equal(pages.size, 20);
  assert.equal(new Set(projects.map((project) => project.slug)).size, 6);
  for (const locale of ['en', 'ko']) {
    for (const page of ['home', 'projects', 'contact', ...projects.map((project) => project.slug)]) {
      const doc = documents.get(pagePath(locale, page));
      assert.ok(doc);
      assert.equal(doc.documentElement.lang, locale);
      assert.equal(doc.querySelectorAll('h1').length, 1);
      assert.ok(doc.querySelector('main#main'));
      assert.ok(doc.querySelector('title').textContent.includes('JIHOON'));
      assert.ok(doc.querySelector('meta[name="description"]').content.length > 30);
    }
    assert.equal(documents.get(pagePath(locale, 'projects')).querySelectorAll('.project-card').length, 6);
    assert.equal(documents.get(pagePath(locale, 'home')).querySelectorAll('.project-card').length, 4);
  }
});

test('every local link, asset, and fragment resolves in the generated site', () => {
  for (const [path, doc] of documents) {
    const ids = [...doc.querySelectorAll('[id]')].map((element) => element.id);
    assert.equal(new Set(ids).size, ids.length, `Duplicate id in ${path}`);
    for (const element of doc.querySelectorAll('[href], [src]')) {
      const value = element.getAttribute('href') ?? element.getAttribute('src');
      if (value.startsWith('mailto:')) continue;
      assert.ok(!/^(?:https?:|javascript:|data:)/i.test(value), `Unexpected remote or executable URL: ${value}`);
      const [file, fragment] = value.split('#');
      const destination = file ? new URL(file, `https://portfolio.test/${path}`).pathname.slice(1) : path;
      assert.ok(documents.has(destination) || assets.has(destination), `${path} -> ${value}`);
      if (fragment) assert.ok(documents.get(destination)?.getElementById(fragment), `${path}: broken #${fragment}`);
    }
  }
});

test('language switches preserve the selected page and point back symmetrically', () => {
  for (const [path, doc] of documents) {
    const page = doc.body.dataset.page;
    const links = doc.querySelectorAll('.language-switch a');
    assert.equal(links.length, 2);
    for (const link of links) {
      const destination = new URL(link.getAttribute('href'), `https://portfolio.test/${path}`).pathname.slice(1);
      assert.equal(destination, pagePath(link.lang, page));
      assert.equal(documents.get(destination).body.dataset.page, page);
      assert.equal(link.hasAttribute('aria-current'), link.lang === doc.documentElement.lang);
    }
  }
});

test('translation schemas match and all case studies include decision, evidence, and scope', () => {
  assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.ko).sort());
  for (const project of projects) {
    assert.deepEqual(Object.keys(project.en).sort(), Object.keys(project.ko).sort());
    for (const locale of ['en', 'ko']) {
      for (const value of Object.values(project[locale])) assert.ok(value.trim().length > 0);
      const doc = documents.get(pagePath(locale, project.slug));
      assert.ok(doc.querySelector('#verification'));
      assert.ok(doc.querySelector('#boundary'));
      if (project.kind === 'case') {
        for (const id of ['problem', 'decision', 'implementation', 'tradeoff']) assert.ok(doc.getElementById(id));
      }
    }
  }
  assert.equal(projects.find((project) => project.slug === 'resol-math').kind, 'archive');
});

test('HTML text escaping prevents content from creating executable elements', () => {
  assert.equal(escapeHtml('<script>"x" & \'y\'</script>'), '&lt;script&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/script&gt;');
  const malicious = structuredClone(projects[0]);
  malicious.name = '<img src=x onerror=alert(1)>';
  malicious.en.title = '<img src=x onerror=alert(1)>';
  malicious.en.overview = '<script>alert(1)</script>';
  const { document } = parseHTML(renderProject('en', malicious));
  assert.equal(document.querySelectorAll('script:not([src])').length, 0);
  assert.equal(document.querySelectorAll('[onerror]').length, 0);
  assert.ok(document.querySelector('h1').textContent.includes('<img'));
});

test('contact links use the requested email in both language versions', () => {
  assert.equal(contactEmail, 'dev.wlgns@gmail.com');
  for (const [path, doc] of documents) {
    for (const link of doc.querySelectorAll('a[href^="mailto:"]')) {
      assert.equal(link.getAttribute('href'), `mailto:${contactEmail}`, path);
      assert.ok(link.textContent.includes(contactEmail));
    }
    if (['home', 'contact'].includes(doc.body.dataset.page)) {
      assert.ok(doc.querySelector(`a[href="mailto:${contactEmail}"]`), path);
    }
    assert.ok(!doc.body.textContent.includes('atomwlgns8@gmail.com'));
  }
});

test('engineering topics link to substantive bilingual implementation notes', () => {
  assert.equal(capabilities.length, 6);
  assert.equal(investigations.length, 9);
  for (const locale of ['en', 'ko']) {
    const home = documents.get(pagePath(locale, 'home'));
    assert.equal(home.querySelectorAll('.capability').length, 6);
    assert.equal(home.querySelector('.system-board'), null);
    assert.equal(home.querySelector('.project-visual'), null);
    assert.ok(home.querySelector('.reuse-practice a'));
    for (const item of investigations) {
      const note = documents.get(pagePath(locale, item.project)).getElementById(item.id);
      assert.ok(note, `${locale}: ${item.id}`);
      assert.equal(note.querySelectorAll('dt').length, 3);
      assert.equal(note.querySelectorAll('dd').length, 3);
      assert.equal(note.querySelector('h3').textContent, item[locale].title);
      for (const value of Object.values(item[locale])) assert.ok(value.trim().length > 15);
    }
    const archive = documents.get(pagePath(locale, 'resol-math'));
    assert.ok(archive.querySelector('#implementation'));
    assert.ok(archive.querySelector('#tradeoff'));
  }
});

test('rendered content works without JavaScript and restricts active resources', () => {
  for (const [, doc] of documents) {
    assert.ok(doc.querySelector('main h1').textContent.trim().length > 0);
    assert.ok(doc.querySelector('main p').textContent.trim().length > 0);
    assert.ok(doc.querySelector('.site-nav a'));
    assert.equal(doc.querySelectorAll('script').length, 1);
    assert.ok(doc.querySelector('script').hasAttribute('defer'));
    assert.equal(doc.querySelectorAll('[onclick], [onload], [style], iframe, form').length, 0);
    const csp = doc.querySelector('meta[http-equiv="Content-Security-Policy"]').content;
    assert.ok(csp.includes("script-src 'self'"));
    assert.ok(csp.includes("object-src 'none'"));
    assert.ok(!csp.includes('unsafe-inline'));
  }
});

async function menuFixture(locale) {
  const { window, document } = parseHTML(renderHome(locale));
  const callbacks = [];
  const context = {
    document, window: { matchMedia: () => ({ addEventListener: (_name, callback) => callbacks.push(callback) }) },
    HTMLButtonElement: window.HTMLButtonElement, HTMLElement: window.HTMLElement,
    Element: window.Element, Node: window.Node, Date,
  };
  let focused = false;
  const toggle = document.querySelector('.menu-toggle');
  toggle.focus = () => { focused = true; };
  vm.runInNewContext(await readFile(new URL('../script.js', import.meta.url), 'utf8'), context);
  return { document, window, toggle, callbacks, focused: () => focused };
}

test('mobile menu opens, closes on Escape, restores focus, and uses localized labels', async () => {
  for (const locale of ['en', 'ko']) {
    const f = await menuFixture(locale);
    assert.ok(f.document.documentElement.classList.contains('js'));
    f.toggle.click();
    assert.equal(f.toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(f.toggle.getAttribute('aria-label'), copy[locale].closeMenu);
    assert.ok(f.document.querySelector('.site-nav').classList.contains('is-open'));
    const event = new f.window.Event('keydown');
    Object.defineProperty(event, 'key', { value: 'Escape' });
    f.document.dispatchEvent(event);
    assert.equal(f.toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(f.toggle.getAttribute('aria-label'), copy[locale].menu);
    assert.ok(f.focused());
  }
});

test('mobile menu closes on navigation, outside clicks, and desktop breakpoint changes', async () => {
  const f = await menuFixture('en');
  for (const close of [
    () => f.document.querySelector('.site-nav a').click(),
    () => f.document.querySelector('h1').dispatchEvent(new f.window.Event('click', { bubbles: true })),
    () => f.callbacks[0]({ matches: false }),
  ]) {
    f.toggle.click();
    assert.equal(f.toggle.getAttribute('aria-expanded'), 'true');
    close();
    assert.equal(f.toggle.getAttribute('aria-expanded'), 'false');
  }
  assert.equal(f.document.querySelector('[data-current-year]').textContent, String(new Date().getFullYear()));
});
