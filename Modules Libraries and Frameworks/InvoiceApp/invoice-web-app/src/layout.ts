/**
 * App Layout - Header + Content + Footer
 */

import { router } from './router';

export function renderHeader(): void {
  const header = document.getElementById('header');
  if (!header) return;

  header.innerHTML = `
    <nav>
      <a href="/" class="logo" data-navigo>📄 Invoice App</a>
      <a href="/" data-navigo>Home</a>
      <a href="/invoices" data-navigo>Invoices</a>
      <a href="/clients" data-navigo>Clients</a>
      <a href="/config" data-navigo>Config</a>
    </nav>
  `;
}

export function renderFooter(): void {
  const footer = document.getElementById('footer');
  if (!footer) return;

  const year = new Date().getFullYear();
  footer.innerHTML = `
    <p>&copy; ${year} Invoice App. All rights reserved.</p>
  `;
}

export function setActiveNavLink(path: string): void {
  const navLinks = document.querySelectorAll('header nav a:not(.logo)');
  navLinks.forEach((link) => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === path || (href !== '/' && path.startsWith(href || ''))) {
      link.classList.add('active');
    }
  });
}

export function renderPage(content: string): void {
  const main = document.getElementById('content');
  if (!main) return;
  main.innerHTML = content;
  // Update Navigo links after rendering new content
  router.updatePageLinks();
}

export function initLayout(): void {
  renderHeader();
  renderFooter();
}
