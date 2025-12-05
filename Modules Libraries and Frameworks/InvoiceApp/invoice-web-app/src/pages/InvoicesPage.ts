/**
 * Invoices List Page
 * Route: /invoices
 */

import { getAppData, Invoice } from '../data';

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
 * Get recipient name from invoice
 */
function getRecipientName(invoice: Invoice): string {
  return invoice.recipient.data.name;
}

/**
 * Generate table row for an invoice
 */
function renderInvoiceRow(invoice: Invoice): string {
  return `
    <tr>
      <td>${invoice.id}</td>
      <td>${formatDate(invoice.date)}</td>
      <td>${getRecipientName(invoice)}</td>
      <td class="text-right">${invoice.items.length}</td>
      <td class="text-right">${formatCurrency(invoice.subtotalAmount)}</td>
      <td class="text-right">${formatCurrency(invoice.vatAmount)}</td>
      <td class="text-right">${formatCurrency(invoice.totalAmount)}</td>
      <td class="actions">
        <a href="/invoices/${invoice.id}/view" class="btn btn-view" data-navigo>View</a>
        <a href="/invoices/${invoice.id}/edit" class="btn btn-edit" data-navigo>Edit</a>
        <button class="btn btn-delete" data-invoice-id="${invoice.id}">Delete</button>
      </td>
    </tr>
  `;
}

export function InvoicesPage(): string {
  const repo = getAppData();
  const invoices = repo.invoices;

  const tableRows = invoices.length > 0
    ? invoices.map(renderInvoiceRow).join('')
    : '<tr><td colspan="8" class="text-center">No invoices found</td></tr>';

  return `
    <div class="page">
      <div class="page-header">
        <h1>Invoices</h1>
        <div class="page-actions">
          <a href="/invoices/new/edit" class="btn btn-save" data-navigo>+ New Invoice</a>
        </div>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Date</th>
              <th>Recipient</th>
              <th class="text-right">Items</th>
              <th class="text-right">Subtotal</th>
              <th class="text-right">VAT</th>
              <th class="text-right">Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
      <p class="summary">Total: ${invoices.length} invoice(s)</p>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="delete-invoice-modal" class="modal" style="display: none;">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>Confirm Delete</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete invoice <strong id="delete-invoice-id"></strong>?</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-delete" id="confirm-invoice-delete">Delete</button>
          <button type="button" class="btn btn-secondary" id="cancel-invoice-delete">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize event handlers for the invoices page
 */
export function initInvoicesPageEvents(): void {
  const modal = document.getElementById('delete-invoice-modal');
  const modalOverlay = modal?.querySelector('.modal-overlay');
  const invoiceIdSpan = document.getElementById('delete-invoice-id');
  const confirmBtn = document.getElementById('confirm-invoice-delete');
  const cancelBtn = document.getElementById('cancel-invoice-delete');
  
  let invoiceIdToDelete: string | null = null;

  // Show modal function
  function showModal(invoiceId: string) {
    invoiceIdToDelete = invoiceId;
    if (invoiceIdSpan) invoiceIdSpan.textContent = invoiceId;
    if (modal) modal.style.display = 'flex';
  }

  // Hide modal function
  function hideModal() {
    invoiceIdToDelete = null;
    if (modal) modal.style.display = 'none';
  }

  // Delete button click handlers
  document.querySelectorAll('.btn-delete[data-invoice-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const invoiceId = target.getAttribute('data-invoice-id');
      if (invoiceId) {
        showModal(invoiceId);
      }
    });
  });

  // Confirm delete handler
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (invoiceIdToDelete) {
        const repo = getAppData();
        const deleted = repo.deleteInvoice(invoiceIdToDelete);
        if (deleted) {
          console.log(`Invoice deleted: ${invoiceIdToDelete}`);
          hideModal();
          // Re-render the page
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.innerHTML = InvoicesPage();
            initInvoicesPageEvents();
          }
        }
      }
    });
  }

  // Cancel delete handler
  if (cancelBtn) {
    cancelBtn.addEventListener('click', hideModal);
  }

  // Close modal on overlay click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', hideModal);
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.style.display === 'flex') {
      hideModal();
    }
  });
}
