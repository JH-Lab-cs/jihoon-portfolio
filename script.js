// @ts-check
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const header = document.querySelector('.site-header');

  if (toggle instanceof HTMLButtonElement && nav instanceof HTMLElement && header instanceof HTMLElement) {
    const breakpoint = window.matchMedia('(max-width: 760px)');
    /** @param {boolean} open */
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', (open ? toggle.dataset.closeLabel : toggle.dataset.openLabel) || 'Menu');
      nav.classList.toggle('is-open', open);
    };
    document.documentElement.classList.add('js');
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (event.target instanceof Node && !header.contains(event.target)) setOpen(false);
    });
    breakpoint.addEventListener('change', (event) => {
      if (!event.matches) setOpen(false);
    });
  }
  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
