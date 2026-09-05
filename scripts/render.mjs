import { posix } from 'node:path';
import { copy, contactEmail } from '../content/site.mjs';
import { capabilities, investigations } from '../content/engineering.mjs';
import { projects } from '../content/projects.mjs';
import { productProfiles } from '../content/products.mjs';
import { walkthroughs } from '../content/walkthroughs.mjs';

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
/** @param {string} value */
export function normalizeBasePath(value) {
  const path = value.endsWith('/') ? value : `${value}/`;
  if (!value.startsWith('/') || !/^\/(?:[A-Za-z0-9_-][A-Za-z0-9._-]*\/)*$/.test(path)) {
    throw new Error('SITE_BASE_PATH must be an absolute path with safe directory segments.');
  }
  return path;
}
/** @param {Locale} locale @param {string} page @param {string} basePath */
function helpers(locale, page, basePath = '/') {
  const path = pagePath(locale, page);
  return {
    c: copy[locale],
    /** @param {string} target */
    href: (target) => page === 'not-found' ? `${basePath}${pagePath(locale, target)}` : relativeLink(path, pagePath(locale, target)),
    /** @param {string} asset */
    asset: (asset) => page === 'not-found' ? `${basePath}${asset}` : relativeLink(path, asset),
  };
}
const arrow = '<span aria-hidden="true">↗</span>';

/** @param {Project} project @param {Locale} locale */
function productProfile(project, locale) {
  const profile = productProfiles.find((item) => item.slug === project.slug);
  if (!profile) throw new Error(`Missing product profile: ${project.slug}`);
  return profile[locale];
}

/** @param {Locale} locale @param {string} page @param {string} content @param {string} title @param {string} description @param {string} basePath */
function layout(locale, page, content, title, description, basePath = '/') {
  const { c, href, asset } = helpers(locale, page, basePath);
  const languageLink = /** @param {Locale} lang */ (lang) => page === 'not-found' ? `${basePath}${pagePath(lang, page)}` : relativeLink(pagePath(locale, page), pagePath(lang, page));
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
  const product = productProfile(project, locale);
  return `<article class="project-card"><a class="project-link" href="${href(project.slug)}">
    <span class="project-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
    <div class="project-identity"><p class="project-category">${escapeHtml(project.category)}</p><h3>${escapeHtml(project.name)}</h3><span class="status-label">${escapeHtml(p.status)}</span><div class="tag-line">${project.tags.map(escapeHtml).join(' · ')}</div></div>
    <div class="project-copy"><h4>${escapeHtml(product.title)}</h4><p>${escapeHtml(product.summary)}</p><ul class="project-features">${product.workflow.map((item) => `<li>${escapeHtml(item.title)}</li>`).join('')}</ul></div>
    <span class="project-action"><span>${c.viewProject}</span><span aria-hidden="true">↗</span></span>
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
    <section class="hero container"><p class="eyebrow">${c.eyebrow}</p><h1>${c.headline[0]}<br><span>${c.headline[1]}</span></h1><div class="hero-bottom"><div class="hero-description"><p class="hero-intro">${c.intro}</p><p class="hero-technologies">${c.heroNote}</p></div><div class="hero-actions"><a class="button button-primary" href="#selected-work">${c.viewWork} <span aria-hidden="true">↓</span></a><a class="hero-email" href="mailto:${contactEmail}">${contactEmail} <span aria-hidden="true">↗</span></a></div></div></section>
    <section class="work-section container" id="selected-work"><div class="section-heading"><div><p class="eyebrow">${c.selectedLabel}</p><h2>${c.selectedTitle}</h2><p>${c.selectedIntro}</p></div><a class="text-link" href="${href('projects')}">${c.allWork} ${arrow}</a></div><div class="project-grid">${projects.filter((project) => project.kind === 'case').map((project, index) => projectCard(project, locale, 'home', index)).join('')}</div></section>
    <section class="expertise-section" id="approach"><div class="container"><div class="section-heading"><div><p class="eyebrow">${c.approachLabel}</p><h2>${c.approachTitle.split('\n').join('<br>')}</h2></div><p class="section-aside">${c.approachIntro}</p></div><div class="capability-grid">${capabilities.map((item, index) => `<a class="capability" href="${href(item.project)}#${item.anchor}"><span class="capability-index">${String(index + 1).padStart(2, '0')}</span><div><h3>${escapeHtml(item[locale].title)}</h3><p>${escapeHtml(item[locale].detail)}</p><span class="capability-source">${escapeHtml(projects.find((project) => project.slug === item.project)?.name ?? '')} ${arrow}</span></div></a>`).join('')}</div></div></section>
    <section class="explorations container"><div class="section-heading"><div><p class="eyebrow">${c.moreLabel}</p><h2>${c.moreTitle}</h2><p>${c.moreIntro}</p></div></div><div class="project-rows">${projects.filter((project) => project.kind !== 'case').map((project) => `<a class="project-row" href="${href(project.slug)}"><span class="row-name">${escapeHtml(project.name)}</span><span class="row-summary">${escapeHtml(productProfile(project, locale).summary)}</span><span class="row-status">${escapeHtml(project[locale].status)}</span><span aria-hidden="true">↗</span></a>`).join('')}</div></section>
    <section class="practice-section container"><div class="practice-heading"><p class="eyebrow">${c.aboutLabel}</p><h2>${c.aboutTitle}</h2><p>${c.aboutText}</p></div><ol class="practice-list">${c.approachItems.map(([title, text], index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join('')}</ol><div class="reuse-practice"><p class="eyebrow">${c.reuseLabel}</p><h3>${c.reuseTitle}</h3><p>${c.reuseText}</p><a class="text-link" href="${href('resol-math')}#implementation">${c.reuseLink} ${arrow}</a></div></section>
    ${cta(locale, 'home')}`, c.siteTitle, c.description);
}
/** @param {Locale} locale */
export function renderProjects(locale) {
  const c = copy[locale];
  return layout(locale, 'projects', `<section class="page-heading container"><p class="eyebrow">SELECTED WORK / ${String(projects.length).padStart(2, '0')} PROJECTS</p><h1>${c.workTitle}</h1><p>${c.workIntro}</p></section><section class="container all-projects" aria-label="${c.nav[0]}"><div class="project-grid">${projects.map((project, index) => projectCard(project, locale, 'projects', index)).join('')}</div></section>${cta(locale, 'projects')}`, `${c.nav[0]} — JIHOON`, c.workIntro);
}
/** @param {Locale} locale @param {Project} project */
function renderInvestigations(locale, project) {
  const c = copy[locale];
  const notes = investigations.filter((item) => item.project === project.slug);
  if (notes.length === 0) return '';
  return `<section class="related-engineering" id="related-engineering"><p class="eyebrow">${c.investigationsLabel}</p><h2>${c.investigationsTitle}</h2>${notes.map((item) => `<article class="engineering-note" id="${item.id}"><h3>${escapeHtml(item[locale].title)}</h3><dl><dt>${c.challengeLabel}</dt><dd>${escapeHtml(item[locale].scenario)}</dd><dt>${c.solutionLabel}</dt><dd>${escapeHtml(item[locale].solution)}</dd><dt>${c.checkLabel}</dt><dd>${escapeHtml(item[locale].check)}</dd></dl></article>`).join('')}</section>`;
}
/** @param {Locale} locale @param {Project} project */
function renderWalkthrough(locale, project) {
  const details = walkthroughs.find((item) => item.project === project.slug)?.[locale];
  if (!details) return '';
  const c = copy[locale];
  return `<div class="implementation-walkthrough" id="execution-flow"><div class="invariant-note"><h3>${c.invariantLabel}</h3><p>${escapeHtml(details.invariant)}</p></div><h3>${c.flowLabel}</h3><ol class="execution-steps">${details.steps.map((step, index) => `<li><span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><div><h4>${escapeHtml(step.title)}</h4><p>${escapeHtml(step.detail)}</p></div></li>`).join('')}</ol><div class="scenario-table-wrapper"><table class="scenario-table"><caption>${c.scenariosLabel}</caption><thead><tr><th scope="col">${c.scenarioLabel}</th><th scope="col">${c.expectedLabel}</th></tr></thead><tbody>${details.checks.map(([scenario, expected]) => `<tr><th scope="row">${escapeHtml(scenario)}</th><td>${escapeHtml(expected)}</td></tr>`).join('')}</tbody></table></div><p class="walkthrough-scope">${escapeHtml(details.scope)}</p></div>`;
}

/** @param {Locale} locale @param {Project} project */
function renderOverview(locale, project) {
  const c = copy[locale];
  const product = productProfile(project, locale);
  return `<section id="overview" class="case-section product-overview"><p class="eyebrow">${c.productLabel}</p><h2>${c.overview}</h2><p>${escapeHtml(product.context)}</p><h3>${c.workflowLabel}</h3><ol class="product-workflow">${product.workflow.map((step, index) => `<li><span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><div><h4>${escapeHtml(step.title)}</h4><p>${escapeHtml(step.detail)}</p></div></li>`).join('')}</ol></section>`;
}
/** @param {Locale} locale @param {Project} project */
export function renderProject(locale, project) {
  const { c, href } = helpers(locale, project.slug);
  const p = project[locale];
  const product = productProfile(project, locale);
  const sections = /** @type {const} */ (['problem', 'decision', 'implementation', 'tradeoff', 'verification', 'boundary']);
  const toc = [['overview', c.overview], ['engineering', c.technicalLabel], ...sections.map((section) => [section, c[section]])];
  if (investigations.some((item) => item.project === project.slug)) toc.splice(toc.length - 1, 0, ['related-engineering', c.investigationsTitle]);
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return layout(locale, project.slug, `
    <section class="case-heading container"><a class="text-link breadcrumb" href="${href('projects')}"><span aria-hidden="true">←</span> ${c.returnWork}</a><p class="eyebrow">${project.category}</p><h1>${escapeHtml(project.name)}</h1><p class="case-product-title">${escapeHtml(product.title)}</p><p class="case-summary">${escapeHtml(product.summary)}</p><div class="case-meta"><span class="status-label">${p.status}</span><a class="text-link" href="#engineering">${c.readCase} <span aria-hidden="true">↓</span></a></div></section>
    <div class="case-layout container"><aside class="case-sidebar"><div class="case-sidebar-inner"><div class="case-identity tone-${project.tone}"><strong>${escapeHtml(project.name)}</strong><span>${project.category}</span></div><dl><dt>${c.status}</dt><dd>${p.status}</dd><dt>${c.stack}</dt><dd>${project.tags.join(' · ')}</dd><dt>${c.process}</dt><dd>${c.processValue}</dd></dl><nav class="case-toc" aria-label="${locale === 'en' ? 'On this page' : '이 페이지의 내용'}">${toc.map(([id, label]) => `<a href="#${id}">${escapeHtml(label)} <span aria-hidden="true">↘</span></a>`).join('')}</nav></div></aside>
      <article class="case-article">${renderOverview(locale, project)}<section class="engineering-intro" id="engineering"><p class="eyebrow">${project.kind === 'case' ? c.caseLabel : c.projectLabel}</p><h2>${escapeHtml(p.title)}</h2><p>${escapeHtml(p.summary)}</p></section>${sections.map((section, index) => `<section id="${section}" class="case-section"><p class="eyebrow">${String(index + 1).padStart(2, '0')}</p><h2>${c[section]}</h2><p>${escapeHtml(p[section])}</p>${section === 'implementation' ? renderWalkthrough(locale, project) : ''}${section === 'verification' ? `<div class="result-note"><span aria-hidden="true">↗</span><div><strong>${escapeHtml(p.result)}</strong><p>${escapeHtml(p.resultDetail)}</p></div></div>` : ''}</section>${section === 'verification' ? renderInvestigations(locale, project) : ''}`).join('')}<div class="evidence-note"><p class="eyebrow">${c.evidenceLabel}</p><p>${c.evidenceNote}</p></div></article>
    </div><nav class="next-project container" aria-label="${c.nextProject}"><a class="text-link" href="${href('projects')}">← ${c.returnWork}</a><a href="${href(next.slug)}"><span>${c.nextProject}</span><strong>${escapeHtml(next.name)} ${arrow}</strong></a></nav>`, `${project.name} — ${product.title} | JIHOON`, product.summary);
}
/** @param {Locale} locale */
export function renderContact(locale) {
  const c = copy[locale];
  return layout(locale, 'contact', `<section class="contact-page container"><p class="eyebrow">CONTACT / JIHOON</p><h1>${c.contactTitle}</h1><p class="contact-intro">${c.contactIntro}</p><a class="email-card" href="mailto:${contactEmail}"><span>${c.emailLabel}</span><strong>${contactEmail}</strong><span class="email-arrow" aria-hidden="true">↗</span></a><div class="contact-details"><p>${c.contactNote}</p><ul class="focus-tags">${c.contactTopics.map((topic) => `<li>${topic}</li>`).join('')}</ul></div></section>`, `${c.nav[2]} — JIHOON`, c.contactIntro);
}
/** @param {Locale} locale @param {string} basePath */
export function renderNotFound(locale, basePath = '/') {
  const prefix = normalizeBasePath(basePath);
  const { c, href } = helpers(locale, 'not-found', prefix);
  return layout(locale, 'not-found', `<section class="contact-page container"><p class="eyebrow">404 / JIHOON</p><h1>${c.notFoundTitle}</h1><p class="contact-intro">${c.notFoundText}</p><a class="button button-primary" href="${href('projects')}">${c.returnWork} ${arrow}</a></section>`, '404 — JIHOON', c.notFoundText, prefix);
}
/** @param {string} basePath */
export function renderAll(basePath = '/') {
  const prefix = normalizeBasePath(basePath);
  /** @type {Map<string, string>} */
  const pages = new Map();
  for (const locale of /** @type {const} */ (['en', 'ko'])) {
    pages.set(pagePath(locale, 'home'), renderHome(locale));
    pages.set(pagePath(locale, 'projects'), renderProjects(locale));
    pages.set(pagePath(locale, 'contact'), renderContact(locale));
    pages.set(pagePath(locale, 'not-found'), renderNotFound(locale, prefix));
    for (const project of projects) pages.set(pagePath(locale, project.slug), renderProject(locale, project));
  }
  return pages;
}
