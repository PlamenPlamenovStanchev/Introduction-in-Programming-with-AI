/**
 * Config Page
 * Route: /config
 * View and edit app configuration (issuer company + default VAT rate)
 */

import { getAppData, IssuerCompany } from '../data';

// Track edit mode
let isEditMode = false;

/**
 * Format VAT rate as percentage string
 */
function formatVatRate(rate: number): string {
  return (rate * 100).toFixed(0) + '%';
}

/**
 * Render issuer company details in view mode
 */
function renderIssuerView(issuer: IssuerCompany): string {
  return `
    <div class="info-section">
      <h3>Issuer Company</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Company Name</span>
          <span class="info-value">${issuer.name}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Company ID</span>
          <span class="info-value">${issuer.id}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Tax ID (VAT Number)</span>
          <span class="info-value">${issuer.taxId}</span>
        </div>
        <div class="info-item full-width">
          <span class="info-label">Address</span>
          <span class="info-value">${issuer.address}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Manager / Representative</span>
          <span class="info-value">${issuer.manager}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Bank Account (IBAN)</span>
          <span class="info-value">${issuer.iban}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render VAT settings in view mode
 */
function renderVatView(vatRate: number): string {
  return `
    <div class="info-section">
      <h3>VAT Settings</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Default VAT Rate</span>
          <span class="info-value vat-value">${formatVatRate(vatRate)}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render issuer company form in edit mode
 */
function renderIssuerForm(issuer: IssuerCompany): string {
  return `
    <div class="info-section">
      <h3>Issuer Company</h3>
      <div class="form-grid">
        <div class="form-group">
          <label for="issuer-name">Company Name *</label>
          <input type="text" id="issuer-name" name="name" value="${issuer.name}" required>
        </div>
        <div class="form-group">
          <label for="issuer-id">Company ID *</label>
          <input type="text" id="issuer-id" name="id" value="${issuer.id}" required>
        </div>
        <div class="form-group">
          <label for="issuer-taxId">Tax ID (VAT Number) *</label>
          <input type="text" id="issuer-taxId" name="taxId" value="${issuer.taxId}" required>
        </div>
        <div class="form-group full-width">
          <label for="issuer-address">Address *</label>
          <input type="text" id="issuer-address" name="address" value="${issuer.address}" required>
        </div>
        <div class="form-group">
          <label for="issuer-manager">Manager / Representative *</label>
          <input type="text" id="issuer-manager" name="manager" value="${issuer.manager}" required>
        </div>
        <div class="form-group">
          <label for="issuer-iban">Bank Account (IBAN) *</label>
          <input type="text" id="issuer-iban" name="iban" value="${issuer.iban}" required>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render VAT settings form in edit mode
 */
function renderVatForm(vatRate: number): string {
  const vatPercent = (vatRate * 100).toFixed(0);
  return `
    <div class="info-section">
      <h3>VAT Settings</h3>
      <div class="form-grid">
        <div class="form-group">
          <label for="vat-rate">Default VAT Rate (%) *</label>
          <input type="number" id="vat-rate" name="vatRate" value="${vatPercent}" min="0" max="100" step="1" required>
          <span class="form-hint">Enter percentage value (e.g., 20 for 20%)</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render config page in view mode
 */
function renderViewMode(): string {
  const repo = getAppData();
  const issuer = repo.invoiceIssuer;
  const vatRate = repo.defaultVatRate;

  return `
    <div class="page">
      <div class="page-header">
        <h1>Configuration</h1>
        <div class="page-actions">
          <button type="button" class="btn btn-edit" id="btn-edit-config">Edit</button>
        </div>
      </div>

      <div class="config-details">
        ${renderIssuerView(issuer)}
        ${renderVatView(vatRate)}
      </div>
    </div>
  `;
}

/**
 * Render config page in edit mode
 */
function renderEditMode(): string {
  const repo = getAppData();
  const issuer = repo.invoiceIssuer;
  const vatRate = repo.defaultVatRate;

  return `
    <div class="page">
      <div class="page-header">
        <h1>Edit Configuration</h1>
        <div class="page-actions">
          <button type="submit" form="config-form" class="btn btn-save">Save</button>
          <button type="button" class="btn btn-secondary" id="btn-cancel-edit">Cancel</button>
        </div>
      </div>

      <form id="config-form" class="config-form">
        ${renderIssuerForm(issuer)}
        ${renderVatForm(vatRate)}
      </form>
    </div>
  `;
}

export function ConfigPage(): string {
  if (isEditMode) {
    return renderEditMode();
  }
  return renderViewMode();
}

/**
 * Initialize config page event handlers
 */
export function initConfigPageEvents(): void {
  // Edit button handler
  const editBtn = document.getElementById('btn-edit-config');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      isEditMode = true;
      // Re-render the page
      const content = document.getElementById('content');
      if (content) {
        content.innerHTML = ConfigPage();
        initConfigPageEvents();
      }
    });
  }

  // Cancel button handler
  const cancelBtn = document.getElementById('btn-cancel-edit');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      isEditMode = false;
      // Re-render the page
      const content = document.getElementById('content');
      if (content) {
        content.innerHTML = ConfigPage();
        initConfigPageEvents();
      }
    });
  }

  // Form submit handler via button click (more reliable than form submit with external button)
  const submitBtn = document.querySelector('button[type="submit"][form="config-form"]');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Get form values
      const name = (document.getElementById('issuer-name') as HTMLInputElement).value.trim();
      const id = (document.getElementById('issuer-id') as HTMLInputElement).value.trim();
      const taxId = (document.getElementById('issuer-taxId') as HTMLInputElement).value.trim();
      const address = (document.getElementById('issuer-address') as HTMLInputElement).value.trim();
      const manager = (document.getElementById('issuer-manager') as HTMLInputElement).value.trim();
      const iban = (document.getElementById('issuer-iban') as HTMLInputElement).value.trim();
      const vatRatePercent = parseFloat((document.getElementById('vat-rate') as HTMLInputElement).value);

      // Validate
      if (!name || !id || !taxId || !address || !manager || !iban) {
        alert('All fields are required!');
        return;
      }

      if (isNaN(vatRatePercent) || vatRatePercent < 0 || vatRatePercent > 100) {
        alert('VAT rate must be between 0 and 100');
        return;
      }

      // Update repo settings
      const repo = getAppData();
      repo.invoiceIssuer = {
        name,
        id,
        taxId,
        address,
        manager,
        iban
      };
      repo.defaultVatRate = vatRatePercent / 100;

      console.log('Configuration updated:', {
        issuer: repo.invoiceIssuer,
        defaultVatRate: repo.defaultVatRate
      });

      // Exit edit mode and re-render
      isEditMode = false;
      const content = document.getElementById('content');
      if (content) {
        content.innerHTML = ConfigPage();
        initConfigPageEvents();
      }

      alert('Configuration saved successfully!');
    });
  }
}
