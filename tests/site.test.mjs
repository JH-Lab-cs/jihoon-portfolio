import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { parseHTML } from 'linkedom';
import { renderAll, renderHome, renderProject, escapeHtml, pagePath, normalizeBasePath } from '../scripts/render.mjs';
import { projects } from '../content/projects.mjs';
import { copy, contactEmail } from '../content/site.mjs';
import { capabilities, investigations } from '../content/engineering.mjs';
import { productProfiles } from '../content/products.mjs';
import { walkthroughs } from '../content/walkthroughs.mjs';
import { projectMedia, publicAssets } from '../content/media.mjs';
import { implementationEvidence } from '../content/evidence.mjs';

const pages = renderAll();
const documents = new Map([...pages].map(([path, html]) => [path, parseHTML(html).document]));
const assets = new Set(publicAssets);

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

test('deployment base paths accept safe directories and reject executable or ambiguous values', () => {
  assert.equal(normalizeBasePath('/'), '/');
  assert.equal(normalizeBasePath('/jihoon-portfolio'), '/jihoon-portfolio/');
  assert.equal(normalizeBasePath('/team/portfolio.v2/'), '/team/portfolio.v2/');
  for (const path of ['', 'portfolio', '//elsewhere.test/', '/a//b/', '/a/../b/', '/a/./b/', '/a?b/', '/a#b/', '/%2e%2e/', '/a\\b/', '/<script>/']) {
    assert.throws(() => renderAll(path), /SITE_BASE_PATH/);
  }
});

test('all links remain in the deployment directory, including 404s served at unknown nested URLs', () => {
  for (const basePath of ['/', '/jihoon-portfolio/', '/team/portfolio/']) {
    const mountedPages = renderAll(basePath);
    for (const [file, html] of mountedPages) {
      const doc = parseHTML(html).document;
      const requestPath = doc.body.dataset.page === 'not-found' ? `${basePath}unknown/deep/page` : `${basePath}${file}`;
      for (const element of doc.querySelectorAll('[href], [src]')) {
        const value = element.getAttribute('href') ?? element.getAttribute('src');
        if (value.startsWith('mailto:')) continue;
        if (value.startsWith('#')) {
          assert.ok(doc.getElementById(value.slice(1)));
          continue;
        }
        const destination = new URL(value, `https://portfolio.test${requestPath}`);
        assert.equal(destination.origin, 'https://portfolio.test');
        assert.ok(destination.pathname.startsWith(basePath), `${requestPath} escapes through ${value}`);
        const target = destination.pathname.slice(basePath.length);
        assert.ok(mountedPages.has(target) || assets.has(target), `${requestPath} -> ${value}`);
        if (destination.hash) {
          assert.ok(parseHTML(mountedPages.get(target)).document.getElementById(destination.hash.slice(1)));
        }
      }
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

test('project lists introduce each product and details separate the product from its engineering case', () => {
  assert.equal(productProfiles.length, projects.length);
  assert.equal(new Set(productProfiles.map((profile) => profile.slug)).size, projects.length);
  for (const locale of ['en', 'ko']) {
    const listing = documents.get(pagePath(locale, 'projects'));
    for (const [index, project] of projects.entries()) {
      const profile = productProfiles.find((item) => item.slug === project.slug);
      assert.ok(profile);
      assert.deepEqual(Object.keys(profile.en).sort(), Object.keys(profile.ko).sort());
      const card = listing.querySelectorAll('.project-card')[index];
      assert.equal(card.querySelector('h4').textContent, profile[locale].title);
      assert.ok(card.textContent.includes(profile[locale].summary));
      assert.ok(!card.textContent.includes(project[locale].title));
      assert.equal(card.querySelectorAll('.project-features li').length, 3);
      const detail = documents.get(pagePath(locale, project.slug));
      assert.equal(detail.querySelector('h1').textContent, project.name);
      assert.equal(detail.querySelector('.case-product-title').textContent, profile[locale].title);
      assert.equal(detail.querySelector('#engineering h2').textContent, project[locale].title);
      assert.equal(detail.querySelector('#overview p:not(.eyebrow)').textContent, profile[locale].context);
      assert.equal(detail.querySelectorAll('.product-workflow li').length, 3);
      const articleSections = [...detail.querySelectorAll('.case-article > section')].map((section) => section.id);
      assert.ok(articleSections.indexOf('overview') < articleSections.indexOf('engineering'));
      assert.ok(articleSections.indexOf('engineering') < articleSections.indexOf('problem'));
    }
  }
});

test('each main case includes a bilingual execution sequence, invariant, and accessible verification table', () => {
  assert.deepEqual(walkthroughs.map((item) => item.project).sort(), projects.filter((project) => project.kind === 'case').map((project) => project.slug).sort());
  for (const entry of walkthroughs) {
    assert.deepEqual(Object.keys(entry.en).sort(), Object.keys(entry.ko).sort());
    for (const locale of ['en', 'ko']) {
      const doc = documents.get(pagePath(locale, entry.project));
      const flow = doc.querySelector('#implementation #execution-flow');
      assert.ok(flow);
      assert.equal(flow.querySelector('.invariant-note p').textContent, entry[locale].invariant);
      assert.equal(flow.querySelectorAll('.execution-steps li').length, 4);
      assert.equal(flow.querySelectorAll('tbody tr').length, 3);
      assert.equal(flow.querySelectorAll('thead th[scope="col"]').length, 2);
      assert.equal(flow.querySelectorAll('tbody th[scope="row"]').length, 3);
      assert.equal(flow.querySelector('caption').textContent, copy[locale].scenariosLabel);
      assert.equal(flow.querySelector('.walkthrough-scope').textContent, entry[locale].scope);
    }
  }
});

test('product and walkthrough content cannot inject markup into new rendering surfaces', () => {
  const profile = productProfiles[0].en;
  const walk = walkthroughs[0].en;
  const originalTitle = profile.title;
  const originalDetail = profile.workflow[0].detail;
  const originalInvariant = walk.invariant;
  const originalCheck = walk.checks[0][1];
  const payload = '<img src=x onerror=alert(1)>';
  try {
    profile.title = payload;
    profile.workflow[0].detail = payload;
    walk.invariant = payload;
    walk.checks[0][1] = payload;
    for (const html of [renderHome('en'), renderProject('en', projects[0])]) {
      const doc = parseHTML(html).document;
      assert.equal(doc.querySelectorAll('[onerror], script:not([src])').length, 0);
      assert.ok(doc.body.textContent.includes(payload));
    }
  } finally {
    profile.title = originalTitle;
    profile.workflow[0].detail = originalDetail;
    walk.invariant = originalInvariant;
    walk.checks[0][1] = originalCheck;
  }
});

test('only the original design is published and retired edition links are removed', () => {
  assert.ok(!assets.has('studio.css'));
  assert.ok(!pages.has('studio/index.html'));
  assert.ok(!pages.has('ko/studio/index.html'));
  for (const [path, doc] of documents) {
    assert.equal(doc.querySelectorAll('link[rel="stylesheet"]').length, 1, path);
    assert.equal(doc.querySelector('.edition-link'), null, path);
    for (const element of doc.querySelectorAll('[href], [src]')) {
      assert.ok(!/studio/i.test(element.getAttribute('href') ?? element.getAttribute('src')), path);
    }
  }
});

test('product screens have local assets, dimensions, captions, and explicit image links', async () => {
  assert.equal(projectMedia.flatMap((item) => item.images).length, 3);
  for (const group of projectMedia) {
    for (const screen of group.images) {
      assert.ok((await readFile(new URL(`../${screen.src}`, import.meta.url))).length > 1000);
      assert.ok(screen.width > 0 && screen.height > 0);
      assert.ok(publicAssets.includes(screen.src));
    }
    for (const locale of ['en', 'ko']) {
      const doc = documents.get(pagePath(locale, group.project));
      const gallery = doc.querySelector('#product-screens');
      assert.ok(gallery);
      const screenLink = doc.querySelector('.case-meta a[href="#product-screens"]');
      assert.equal(screenLink.textContent.trim(), copy[locale].viewScreens + ' ↓');
      assert.ok(doc.querySelector('.case-toc a[href="#product-screens"]'));
      const sectionIds = [...doc.querySelectorAll('.case-article > section')].map((section) => section.id);
      assert.ok(sectionIds.indexOf('overview') < sectionIds.indexOf('product-screens'));
      assert.ok(sectionIds.indexOf('product-screens') < sectionIds.indexOf('engineering'));
      assert.equal(gallery.querySelectorAll('figure').length, group.images.length);
      for (const [index, figure] of [...gallery.querySelectorAll('figure')].entries()) {
        const screen = group.images[index];
        assert.equal(figure.querySelector('img').getAttribute('alt'), screen[locale].alt);
        assert.equal(figure.querySelector('img').getAttribute('width'), String(screen.width));
        assert.equal(figure.querySelector('img').getAttribute('height'), String(screen.height));
        assert.ok(figure.querySelector('figcaption').textContent.includes(screen[locale].caption));
        assert.equal(figure.querySelector('a').getAttribute('rel'), 'noopener');
      }
    }
  }
});

test('main case studies include specific source and test references without exposing private repository links', () => {
  assert.equal(implementationEvidence.length, 4);
  for (const evidence of implementationEvidence) {
    for (const locale of ['en', 'ko']) {
      const doc = documents.get(pagePath(locale, evidence.project));
      const reference = doc.querySelector('#verification #implementation-evidence');
      assert.ok(reference);
      assert.equal(reference.querySelectorAll('code').length, evidence[locale].references.length);
      assert.equal(reference.querySelectorAll('a').length, 0);
      for (const file of evidence[locale].references) {
        assert.ok(reference.textContent.includes(file.path));
        assert.ok(reference.textContent.includes(file.detail));
      }
    }
  }
});

test('image captions and source references are escaped in both languages', () => {
  const payload = '<img src=x onerror=alert(1)>';
  for (const locale of ['en', 'ko']) {
    const screen = projectMedia[0].images[0][locale];
    const evidence = implementationEvidence[0][locale].references[0];
    const previous = { alt: screen.alt, caption: screen.caption, path: evidence.path, detail: evidence.detail };
    try {
      screen.alt = payload;
      screen.caption = payload;
      evidence.path = payload;
      evidence.detail = payload;
      const doc = parseHTML(renderProject(locale, projects[0])).document;
      assert.equal(doc.querySelectorAll('[onerror], script:not([src])').length, 0);
      assert.ok([...doc.querySelectorAll('img')].some((image) => image.getAttribute('alt') === payload));
      assert.ok(doc.querySelector('#product-screens figcaption').textContent.includes(payload));
      assert.ok(doc.querySelector('#implementation-evidence').textContent.includes(payload));
    } finally {
      screen.alt = previous.alt;
      screen.caption = previous.caption;
      evidence.path = previous.path;
      evidence.detail = previous.detail;
    }
  }
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
