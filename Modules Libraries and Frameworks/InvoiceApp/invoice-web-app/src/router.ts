/**
 * App Router using Navigo
 */

import Navigo from 'navigo';
import { renderPage, setActiveNavLink } from './layout';
import {
  HomePage,
  InvoicesPage,
  initInvoicesPageEvents,
  InvoiceViewPage,
  InvoiceEditPage,
  initInvoiceEditPageEvents,
  InvoicePdfPage,
  initInvoicePdfPageEvents,
  ClientsPage,
  initClientsPageEvents,
  ClientViewPage,
  ClientEditPage,
  initClientEditPageEvents,
  ConfigPage,
  initConfigPageEvents,
  NotFoundPage,
} from './pages';

const router = new Navigo('/');

export function initRouter(): void {
  // Home page
  router.on('/', () => {
    renderPage(HomePage());
    setActiveNavLink('/');
  });

  // Invoices routes
  router.on('/invoices', () => {
    renderPage(InvoicesPage());
    initInvoicesPageEvents();
    setActiveNavLink('/invoices');
  });

  router.on('/invoices/:id/view', (match) => {
    const id = match?.data?.id || '';
    renderPage(InvoiceViewPage(id));
    setActiveNavLink('/invoices');
  });

  router.on('/invoices/:id/edit', (match) => {
    const id = match?.data?.id || '';
    renderPage(InvoiceEditPage(id));
    initInvoiceEditPageEvents();
    setActiveNavLink('/invoices');
  });

  router.on('/invoices/:id/pdf', (match) => {
    const id = match?.data?.id || '';
    renderPage(InvoicePdfPage(id));
    initInvoicePdfPageEvents();
    setActiveNavLink('/invoices');
  });

  // Clients routes
  router.on('/clients', () => {
    renderPage(ClientsPage());
    initClientsPageEvents();
    setActiveNavLink('/clients');
  });

  router.on('/clients/:id/view', (match) => {
    const id = match?.data?.id || '';
    renderPage(ClientViewPage(id));
    setActiveNavLink('/clients');
  });

  router.on('/clients/:id/edit', (match) => {
    const id = match?.data?.id || '';
    renderPage(ClientEditPage(id));
    initClientEditPageEvents();
    setActiveNavLink('/clients');
  });

  // Config route
  router.on('/config', () => {
    renderPage(ConfigPage());
    initConfigPageEvents();
    setActiveNavLink('/config');
  });

  // 404 Not Found
  router.notFound(() => {
    renderPage(NotFoundPage());
    setActiveNavLink('');
  });

  // Resolve the current route
  router.resolve();
}

export { router };
