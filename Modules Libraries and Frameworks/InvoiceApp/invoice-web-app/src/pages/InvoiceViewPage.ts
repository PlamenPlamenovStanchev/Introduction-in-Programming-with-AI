/**
 * Invoice View Page
 * Route: /invoices/:id/view
 */

import { getAppData, Invoice, InvoiceItem } from '../data';

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
 * Format VAT rate as percentage
 */
function formatVatRate(rate: number): string {
  return (rate * 100).toFixed(0) + '%';
}

/**
 * Render invoice item row
 */
function renderItemRow(item: InvoiceItem, index: number): string {
  const vatAmount = item.value * item.vatRate;
  const totalWithVat = item.value + vatAmount;
  
  return `
    <tr>
      <td>${index + 1}</td>
      <td>${item.product}</td>
      <td class="text-right">${item.quantity}</td>
      <td>${item.unit}</td>
      <td class="text-right">${formatCurrency(item.price)}</td>
      <td class="text-right">${formatVatRate(item.vatRate)}</td>
      <td class="text-right">${formatCurrency(item.value)}</td>
      <td class="text-right">${formatCurrency(vatAmount)}</td>
      <td class="text-right">${formatCurrency(totalWithVat)}</td>
    </tr>
  `;
}

/**
 * Render recipient details
 */
function renderRecipient(invoice: Invoice): string {
  const recipient = invoice.recipient;
  
  if (recipient.type === 'company') {
    const company = recipient.data;
    return `
      <div class="info-group">
        <h3>Recipient (Company)</h3>
        <div class="info-row"><span class="label">Name:</span> <span>${company.name}</span></div>
        ${company.id ? `<div class="info-row"><span class="label">ID:</span> <span>${company.id}</span></div>` : ''}
        ${company.taxId ? `<div class="info-row"><span class="label">Tax ID:</span> <span>${company.taxId}</span></div>` : ''}
        ${company.address ? `<div class="info-row"><span class="label">Address:</span> <span>${company.address}</span></div>` : ''}
        ${company.manager ? `<div class="info-row"><span class="label">Manager:</span> <span>${company.manager}</span></div>` : ''}
      </div>
    `;
  } else {
    const individual = recipient.data;
    return `
      <div class="info-group">
        <h3>Recipient (Individual)</h3>
        <div class="info-row"><span class="label">Name:</span> <span>${individual.name}</span></div>
        ${individual.nationalIdNumber ? `<div class="info-row"><span class="label">National ID:</span> <span>${individual.nationalIdNumber}</span></div>` : ''}
      </div>
    `;
  }
}

export function InvoiceViewPage(id: string): string {
  const repo = getAppData();
  const invoice = repo.findInvoiceById(id);

  if (!invoice) {
    return `
      <div class="page">
        <h1>Invoice Not Found</h1>
        <p>Invoice with ID <strong>${id}</strong> was not found.</p>
        <a href="/invoices" class="btn btn-view" data-navigo>Back to Invoices</a>
      </div>
    `;
  }

  const issuer = invoice.issuer;
  const itemRows = invoice.items.map((item, index) => renderItemRow(item, index)).join('');

  return `
    <div class="page">
      <div class="page-header">
        <h1>Invoice: ${invoice.id}</h1>
        <div class="page-actions">
          <a href="/invoices/${invoice.id}/edit" class="btn btn-edit" data-navigo>Edit</a>
          <a href="/invoices/${invoice.id}/pdf" class="btn btn-view" data-navigo>PDF</a>
          <a href="/invoices" class="btn btn-secondary" data-navigo>Back to List</a>
        </div>
      </div>

      <div class="invoice-details">
        <div class="invoice-header-info">
          <div class="info-group">
            <h3>Invoice Details</h3>
            <div class="info-row"><span class="label">Invoice ID:</span> <span>${invoice.id}</span></div>
            <div class="info-row"><span class="label">Date:</span> <span>${formatDate(invoice.date)}</span></div>
          </div>
        </div>

        <div class="invoice-parties">
          <div class="info-group">
            <h3>Issuer</h3>
            <div class="info-row"><span class="label">Name:</span> <span>${issuer.name}</span></div>
            <div class="info-row"><span class="label">ID:</span> <span>${issuer.id}</span></div>
            <div class="info-row"><span class="label">Tax ID:</span> <span>${issuer.taxId}</span></div>
            <div class="info-row"><span class="label">Address:</span> <span>${issuer.address}</span></div>
            <div class="info-row"><span class="label">Manager:</span> <span>${issuer.manager}</span></div>
            <div class="info-row"><span class="label">IBAN:</span> <span>${issuer.iban}</span></div>
          </div>

          ${renderRecipient(invoice)}
        </div>

        <div class="invoice-items">
          <h3>Items</h3>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th class="text-right">Qty</th>
                  <th>Unit</th>
                  <th class="text-right">Price</th>
                  <th class="text-right">VAT %</th>
                  <th class="text-right">Subtotal</th>
                  <th class="text-right">VAT</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>
          </div>
        </div>

        <div class="invoice-totals">
          <div class="totals-row">
            <span class="label">Subtotal (without VAT):</span>
            <span class="value">${formatCurrency(invoice.subtotalAmount)}</span>
          </div>
          <div class="totals-row">
            <span class="label">VAT Amount:</span>
            <span class="value">${formatCurrency(invoice.vatAmount)}</span>
          </div>
          <div class="totals-row total">
            <span class="label">Total Amount:</span>
            <span class="value">${formatCurrency(invoice.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
