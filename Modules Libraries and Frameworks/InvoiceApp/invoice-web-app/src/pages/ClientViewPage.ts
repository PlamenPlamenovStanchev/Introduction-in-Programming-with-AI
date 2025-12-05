/**
 * Client View Page
 * Route: /clients/:id/view
 * Displays detailed information about a client (company or individual)
 */

import { getAppData, Recipient } from '../data';

/**
 * Find a recipient by ID (company ID or national ID)
 */
function findRecipientById(id: string): Recipient | undefined {
  const repo = getAppData();
  const recipients = repo.recipients;
  
  return recipients.find((r: Recipient) => {
    if (r.type === 'company') {
      return r.data.id === id || r.data.name === id;
    } else {
      return r.data.nationalIdNumber === id || r.data.name === id;
    }
  });
}

/**
 * Render company details
 */
function renderCompanyDetails(company: { name: string; id?: string; taxId?: string; address?: string; manager?: string }): string {
  return `
    <div class="client-details">
      <div class="client-type-header">
        <span class="badge badge-company">Company</span>
      </div>
      
      <div class="info-section">
        <h3>Basic Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Company Name</span>
            <span class="info-value">${company.name}</span>
          </div>
          ${company.id ? `
          <div class="info-item">
            <span class="info-label">Company ID</span>
            <span class="info-value">${company.id}</span>
          </div>
          ` : ''}
          ${company.taxId ? `
          <div class="info-item">
            <span class="info-label">Tax ID (VAT Number)</span>
            <span class="info-value">${company.taxId}</span>
          </div>
          ` : ''}
        </div>
      </div>

      ${company.address || company.manager ? `
      <div class="info-section">
        <h3>Contact Information</h3>
        <div class="info-grid">
          ${company.address ? `
          <div class="info-item full-width">
            <span class="info-label">Address</span>
            <span class="info-value">${company.address}</span>
          </div>
          ` : ''}
          ${company.manager ? `
          <div class="info-item">
            <span class="info-label">Manager / Representative</span>
            <span class="info-value">${company.manager}</span>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}
    </div>
  `;
}

/**
 * Render individual details
 */
function renderIndividualDetails(individual: { name: string; nationalIdNumber?: string }): string {
  return `
    <div class="client-details">
      <div class="client-type-header">
        <span class="badge badge-individual">Individual</span>
      </div>
      
      <div class="info-section">
        <h3>Personal Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Full Name</span>
            <span class="info-value">${individual.name}</span>
          </div>
          ${individual.nationalIdNumber ? `
          <div class="info-item">
            <span class="info-label">National ID Number</span>
            <span class="info-value">${individual.nationalIdNumber}</span>
          </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Get invoices for a recipient
 */
function getClientInvoices(recipient: Recipient): Array<{ id: string; date: Date; totalAmount: number }> {
  const repo = getAppData();
  const invoices = repo.invoices;
  
  return invoices.filter((inv) => {
    if (recipient.type === 'company' && inv.recipient.type === 'company') {
      return inv.recipient.data.name === recipient.data.name;
    } else if (recipient.type === 'individual' && inv.recipient.type === 'individual') {
      return inv.recipient.data.name === recipient.data.name;
    }
    return false;
  }).map((inv) => ({
    id: inv.id,
    date: inv.date,
    totalAmount: inv.totalAmount
  }));
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format currency with 2 decimal places
 */
function formatCurrency(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Render invoices section
 */
function renderInvoicesSection(invoices: Array<{ id: string; date: Date; totalAmount: number }>): string {
  if (invoices.length === 0) {
    return `
      <div class="info-section">
        <h3>Related Invoices</h3>
        <p class="no-data">No invoices found for this client.</p>
      </div>
    `;
  }

  const totalSum = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  
  const rows = invoices.map(inv => `
    <tr>
      <td>${inv.id}</td>
      <td>${formatDate(inv.date)}</td>
      <td class="text-right">${formatCurrency(inv.totalAmount)}</td>
      <td class="actions-cell">
        <a href="/invoices/${inv.id}/view" class="btn btn-view btn-sm" data-navigo>View</a>
      </td>
    </tr>
  `).join('');

  return `
    <div class="info-section">
      <h3>Related Invoices (${invoices.length})</h3>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Date</th>
              <th class="text-right">Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          <tfoot>
            <tr class="totals-row">
              <td colspan="2"><strong>Total</strong></td>
              <td class="text-right"><strong>${formatCurrency(totalSum)}</strong></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
}

export function ClientViewPage(id: string): string {
  const recipient = findRecipientById(decodeURIComponent(id));

  if (!recipient) {
    return `
      <div class="page">
        <h1>Client Not Found</h1>
        <p>Client with ID <strong>${decodeURIComponent(id)}</strong> was not found.</p>
        <a href="/clients" class="btn btn-view" data-navigo>Back to Clients</a>
      </div>
    `;
  }

  const clientName = recipient.type === 'company' ? recipient.data.name : recipient.data.name;
  const clientDetails = recipient.type === 'company' 
    ? renderCompanyDetails(recipient.data)
    : renderIndividualDetails(recipient.data);
  
  const invoices = getClientInvoices(recipient);
  const invoicesSection = renderInvoicesSection(invoices);

  // Get client ID for edit link
  const clientId = recipient.type === 'company' 
    ? (recipient.data.id || encodeURIComponent(recipient.data.name))
    : (recipient.data.nationalIdNumber || encodeURIComponent(recipient.data.name));

  return `
    <div class="page">
      <div class="page-header">
        <h1>${clientName}</h1>
        <div class="page-actions">
          <a href="/clients/${clientId}/edit" class="btn btn-edit" data-navigo>Edit</a>
          <a href="/clients" class="btn btn-secondary" data-navigo>Back to List</a>
        </div>
      </div>

      ${clientDetails}
      ${invoicesSection}
    </div>
  `;
}

