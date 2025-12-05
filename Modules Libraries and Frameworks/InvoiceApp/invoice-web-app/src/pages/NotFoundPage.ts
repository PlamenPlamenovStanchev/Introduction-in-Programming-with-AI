/**
 * Not Found Page (404)
 */

export function NotFoundPage(): string {
  return `
    <div class="page">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/" data-navigo>Go to Home</a>
    </div>
  `;
}
