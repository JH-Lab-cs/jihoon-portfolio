import { posix } from 'node:path';
import { copy } from '../content/site.mjs';
import { projects } from '../content/projects.mjs';

/** @typedef {'en' | 'ko'} Locale */
/** @typedef {typeof projects[number]} Project */
/** @param {string} value */
export function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}
/** @param {Locale} locale @param {string} page */
export function pagePath(locale, page) {
  const prefix = locale === 'ko' ? 'ko/' : '';
  if (page === 'home') return `${prefix}index.html`;
  if (page === 'not-found') return `${prefix}404.html`;
  return `${prefix}${page === 'projects' || page === 'contact' ? page : `projects/${page}`}/index.html`;
}
/** @param {string} from @param {string} to */
export function relativeLink(from, to) {
  return posix.relative(posix.dirname(from), to) || posix.basename(to);
}
/** @param {Locale} locale @param {string} page */
function helpers(locale, page) {
  const path = pagePath(locale, page);
  return {
    c: copy[locale],
    /** @param {string} target */
    href: (target) => page === 'not-found' ? `/${pagePath(locale, target)}` : relativeLink(path, pagePath(locale, target)),
    /** @param {string} asset */
    asset: (asset) => page === 'not-found' ? `/${asset}` : relativeLink(path, asset),
  };
}
const arrow = '<span aria-hidden="true">↗</span>';

/** @param {Locale} locale @param {string} page @param {string} content @param {string} title @param {string} description */
function layout(locale, page, content, title, description) {
  const { c, href, asset } = helpers(locale, page);
  const languageLink = /** @param {Locale} lang */ (lang) => page === 'not-found' ? `/${pagePath(lang, page)}` : relativeLink(pagePath(locale, page), pagePath(lang, page));
  const workActive = !['home', 'contact', 'not-found'].includes(page);
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#f8fafc">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">
  <title>${escapeHtml(title)}</title>
  <link rel="alternate" hreflang="en" href="${languageLink('en')}">
  <link rel="alternate" hreflang="ko" href="${languageLink('ko')}">
  <link rel="icon" href="${asset('assets/favicon.svg')}" type="image/svg+xml">
  <link rel="stylesheet" href="${asset('style.css')}">
  <script src="${asset('script.js')}" defer></script>
</head>
<body id="top" data-page="${escapeHtml(page)}">
  <a class="skip-link" href="#main">${c.skip}</a>
  <header class="site-header"><div class="container header-inner">
    <a class="brand" href="${href('home')}" aria-label="JIHOON — ${c.home}">JIHOON<span class="brand-dot" aria-hidden="true">.</span></a>
    <nav class="site-nav" id="site-nav" aria-label="${locale === 'en' ? 'Main navigation' : '주요 메뉴'}">
      <a href="${href('projects')}"${workActive ? ' class="is-active"' : ''}${page === 'projects' ? ' aria-current="page"' : ''}>${c.nav[0]}</a>
      <a href="${href('home')}#approach">${c.nav[1]}</a>
      <a href="${href('contact')}"${page === 'contact' ? ' aria-current="page"' : ''}>${c.nav[2]} ${arrow}</a>
    </nav>
    <div class="header-actions"><div class="language-switch" aria-label="${locale === 'en' ? 'Language' : '언어'}">
      <a href="${languageLink('en')}" lang="en" hreflang="en"${locale === 'en' ? ' aria-current="true"' : ''}>EN</a>
      <a href="${languageLink('ko')}" lang="ko" hreflang="ko"${locale === 'ko' ? ' aria-current="true"' : ''}>한국어</a>
    </div><button class="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="${c.menu}" data-open-label="${c.menu}" data-close-label="${c.closeMenu}"><span></span><span></span></button></div>
  </div></header>
  <main id="main" tabindex="-1">${content}</main>
  <footer class="site-footer container"><a class="brand footer-brand" href="${href('home')}">JIHOON<span class="brand-dot" aria-hidden="true">.</span></a><p>© <span data-current-year>2026</span> Jihoon. ${c.footer}</p><a class="back-top" href="#top">${c.backTop} <span aria-hidden="true">↑</span></a></footer>
</body>
</html>
`;
}
/** @param {Project} project @param {Locale} locale @param {string} page @param {number} index */
function projectCard(project, locale, page, index) {
  const { c, href } = helpers(locale, page);
  const p = project[locale];
  return `<article class="project-card tone-${project.tone}"><a class="project-link" href="${href(project.slug)}">
    <div class="project-visual"><div class="visual-meta"><span>${project.category}</span><span>0${index + 1}</span></div><strong class="project-wordmark">${escapeHtml(project.name)}</strong><div class="mini-flow" aria-hidden="true">${project.flow.map((step) => `<span>${escapeHtml(step)}</span>`).join('<b>→</b>')}</div><div class="visual-bottom"><span class="status-label">${p.status}</span><span class="round-arrow" aria-hidden="true">↗</span></div></div>
    <div class="project-copy"><div class="tag-line">${project.tags.map(escapeHtml).join(' <span aria-hidden="true">/</span> ')}</div><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.summary)}</p><span class="text-link">${project.kind === 'case' ? c.readCase : c.viewProject} ${arrow}</span></div>
  </a></article>`;
}
/** @param {Locale} locale @param {string} page */
function cta(locale, page) {
  const { c, href } = helpers(locale, page);
  return `<section class="contact-banner container"><div><p class="eyebrow">${c.ctaLabel}</p><h2>${c.ctaTitle}</h2><p>${c.ctaText}</p></div><a class="button button-light" href="${href('contact')}">${c.contact} ${arrow}</a></section>`;
}
/** @param {Locale} locale */
export function renderHome(locale) {
  const { c, href } = helpers(locale, 'home');
  return layout(locale, 'home', `
    <section class="hero container"><div class="hero-copy"><p class="eyebrow"><span class="live-dot" aria-hidden="true"></span>${c.eyebrow}</p><h1>${c.headline[0]}<br><span>${c.headline[1]}</span></h1><p class="hero-intro">${c.intro}</p><div class="hero-actions"><a class="button button-primary" href="#selected-work">${c.viewWork} <span aria-hidden="true">↓</span></a><a class="button button-quiet" href="${href('contact')}">${c.contact} ${arrow}</a></div><ul class="focus-tags">${c.focus.map((text) => `<li>${text}</li>`).join('')}</ul></div>
      <aside class="system-board" aria-label="${c.diagramTitle}"><div class="board-header"><span class="board-symbol" aria-hidden="true">[ J ]</span><span>SYSTEM NOTES / 01</span><span class="board-light" aria-hidden="true"></span></div><p class="board-title">${c.diagramTitle}</p><ol class="system-flow">${c.diagramSteps.map((step, index) => `<li><span class="step-number">0${index + 1}</span><span>${step}</span><span class="step-mark" aria-hidden="true">${index === 3 ? '✓' : '↳'}</span></li>`).join('')}</ol><div class="board-notes">${c.diagramLabels.map((text) => `<span>${text}</span>`).join('')}</div></aside>
    </section>
    <section class="work-section container" id="selected-work"><div class="section-heading"><div><p class="eyebrow">${c.selectedLabel}</p><h2>${c.selectedTitle}</h2><p>${c.selectedIntro}</p></div><a class="text-link" href="${href('projects')}">${c.allWork} ${arrow}</a></div><div class="project-grid">${projects.filter((project) => project.kind === 'case').map((project, index) => projectCard(project, locale, 'home', index)).join('')}</div></section>
    <section class="approach-section" id="approach"><div class="container approach-grid"><div><p class="eyebrow">${c.approachLabel}</p><h2>${c.approachTitle.split('\n').join('<br>')}</h2><p class="approach-intro">${c.approachIntro}</p></div><ol class="approach-list">${c.approachItems.map(([title, text], index) => `<li><span class="approach-number">0${index + 1}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join('')}</ol></div></section>
    <section class="explorations container"><div class="section-heading"><div><p class="eyebrow">${c.moreLabel}</p><h2>${c.moreTitle}</h2><p>${c.moreIntro}</p></div></div><div class="project-rows">${projects.filter((project) => project.kind !== 'case').map((project) => `<a class="project-row" href="${href(project.slug)}"><span class="row-name">${escapeHtml(project.name)}</span><span class="row-summary">${escapeHtml(project[locale].summary)}</span><span class="row-status">${project[locale].status}</span><span aria-hidden="true">↗</span></a>`).join('')}</div></section>
    ${cta(locale, 'home')}`, c.siteTitle, c.description);
}
/** @param {Locale} locale */
export function renderProjects(locale) {
  const c = copy[locale];
  return layout(locale, 'projects', `<section class="page-heading container"><p class="eyebrow">SELECTED WORK / 06 PROJECTS</p><h1>${c.workTitle}</h1><p>${c.workIntro}</p></section><section class="container all-projects" aria-label="${c.nav[0]}"><div class="project-grid">${projects.map((project, index) => projectCard(project, locale, 'projects', index)).join('')}</div></section>${cta(locale, 'projects')}`, `${c.nav[0]} — JIHOON`, c.workIntro);
}
/** @param {Locale} locale @param {Project} project */
export function renderProject(locale, project) {
  const { c, href } = helpers(locale, project.slug);
  const p = project[locale];
  const sections = /** @type {const} */ (['overview', 'problem', 'decision', 'implementation', 'tradeoff', 'verification', 'boundary']);
  const visibleSections = project.kind !== 'archive' ? sections : /** @type {const} */ (['overview', 'decision', 'verification', 'boundary']);
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return layout(locale, project.slug, `
    <section class="case-heading container"><a class="text-link breadcrumb" href="${href('projects')}"><span aria-hidden="true">←</span> ${c.returnWork}</a><p class="eyebrow">${project.kind === 'case' ? c.caseLabel : c.projectLabel} / ${escapeHtml(project.name)}</p><h1>${escapeHtml(p.title)}</h1><p class="case-summary">${escapeHtml(p.summary)}</p><div class="case-meta"><span class="status-label">${p.status}</span><span>${project.category}</span></div></section>
    <div class="case-layout container"><aside class="case-sidebar"><div class="case-sidebar-inner"><div class="case-identity tone-${project.tone}"><strong>${escapeHtml(project.name)}</strong><span>${project.category}</span></div><dl><dt>${c.status}</dt><dd>${p.status}</dd><dt>${c.stack}</dt><dd>${project.tags.join(' · ')}</dd><dt>${c.process}</dt><dd>${c.processValue}</dd></dl><nav class="case-toc" aria-label="${locale === 'en' ? 'On this page' : '이 페이지의 내용'}">${visibleSections.map((section) => `<a href="#${section}">${c[section]} <span aria-hidden="true">↘</span></a>`).join('')}</nav></div></aside>
      <article class="case-article">${visibleSections.map((section, index) => `<section id="${section}" class="case-section"><p class="eyebrow">0${index + 1} / ${c[section]}</p><h2>${section === 'overview' ? project.name : c[section]}</h2><p>${escapeHtml(p[section])}</p>${section === 'verification' ? `<div class="result-note"><span aria-hidden="true">↗</span><div><strong>${escapeHtml(p.result)}</strong><p>${escapeHtml(p.resultDetail)}</p></div></div>` : ''}</section>`).join('')}<div class="evidence-note"><p class="eyebrow">${c.evidenceLabel}</p><p>${c.evidenceNote}</p></div></article>
    </div><nav class="next-project container" aria-label="${c.nextProject}"><a class="text-link" href="${href('projects')}">← ${c.returnWork}</a><a href="${href(next.slug)}"><span>${c.nextProject}</span><strong>${escapeHtml(next.name)} ${arrow}</strong></a></nav>`, `${escapeHtml(project.name)} — ${p.title} | JIHOON`, p.summary);
}
/** @param {Locale} locale */
export function renderContact(locale) {
  const c = copy[locale];
  return layout(locale, 'contact', `<section class="contact-page container"><p class="eyebrow">CONTACT / JIHOON</p><h1>${c.contactTitle}</h1><p class="contact-intro">${c.contactIntro}</p><a class="email-card" href="mailto:atomwlgns8@gmail.com"><span>${c.emailLabel}</span><strong>atomwlgns8@gmail.com</strong><span class="email-arrow" aria-hidden="true">↗</span></a><div class="contact-details"><p>${c.contactNote}</p><ul class="focus-tags">${c.contactTopics.map((topic) => `<li>${topic}</li>`).join('')}</ul></div></section>`, `${c.nav[2]} — JIHOON`, c.contactIntro);
}
/** @param {Locale} locale */
export function renderNotFound(locale) {
  const { c, href } = helpers(locale, 'not-found');
  return layout(locale, 'not-found', `<section class="contact-page container"><p class="eyebrow">404 / JIHOON</p><h1>${c.notFoundTitle}</h1><p class="contact-intro">${c.notFoundText}</p><a class="button button-primary" href="${href('projects')}">${c.returnWork} ${arrow}</a></section>`, '404 — JIHOON', c.notFoundText);
}
export function renderAll() {
  /** @type {Map<string, string>} */
  const pages = new Map();
  for (const locale of /** @type {const} */ (['en', 'ko'])) {
    pages.set(pagePath(locale, 'home'), renderHome(locale));
    pages.set(pagePath(locale, 'projects'), renderProjects(locale));
    pages.set(pagePath(locale, 'contact'), renderContact(locale));
    pages.set(pagePath(locale, 'not-found'), renderNotFound(locale));
    for (const project of projects) pages.set(pagePath(locale, project.slug), renderProject(locale, project));
  }
  return pages;
}
