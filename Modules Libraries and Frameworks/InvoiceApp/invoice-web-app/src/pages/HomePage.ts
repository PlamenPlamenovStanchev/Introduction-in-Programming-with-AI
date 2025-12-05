/**
 * Home Page
 * Route: /
 */

export function HomePage(): string {
  return `
    <div class="page">
      <h1>Home</h1>
      <p>Welcome to the Invoice Management System</p>
      <nav class="home-links">
        <a href="/invoices" data-navigo>📄 Invoices</a>
        <a href="/clients" data-navigo>👥 Clients</a>
        <a href="/config" data-navigo>⚙️ Config</a>
      </nav>
    </div>
  `;
}
