/**
 * Invoice Edit Page
 * Route: /invoices/:id/edit (edit existing) or /invoices/new (add new)
 */

import { getAppData, Invoice, InvoiceItem, Recipient, ProductUnit } from '../data';

// Store items temporarily during editing
let editingItems: InvoiceItem[] = [];

/**
 * Format date as YYYY-MM-DD for input field
 */
function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format VAT rate as percentage for display
 */
function formatVatPercent(rate: number): string {
  return (rate * 100).toFixed(0);
}

/**
 * Check if we're in "add new" mode
 */
function isNewMode(id: string): boolean {
  return id === 'new';
}

/**
 * Generate next invoice ID
 */
function generateInvoiceId(): string {
  const repo = getAppData();
  const invoices = repo.invoices;
  
  // Find the highest number in existing IDs
  let maxNum = 0;
  invoices.forEach(inv => {
    const match = inv.id.match(/INV-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  
  return `INV-${String(maxNum + 1).padStart(3, '0')}`;
}

/**
 * Render recipient options for dropdown
 */
function renderRecipientOptions(selectedName?: string): string {
  const repo = getAppData();
  const recipients = repo.recipients;
  
  const options = recipients.map(r => {
    const name = r.data.name;
    const type = r.type === 'company' ? 'Company' : 'Individual';
    const selected = name === selectedName ? 'selected' : '';
    return `<option value="${name}" ${selected}>${name} (${type})</option>`;
  }).join('');
  
  return `<option value="">-- Select Recipient --</option>${options}`;
}

/**
 * Render unit options for dropdown
 */
function renderUnitOptions(selectedUnit?: ProductUnit): string {
  const units: { value: ProductUnit; label: string }[] = [
    { value: 'pcs', label: 'Pieces (pcs)' },
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'liters', label: 'Liters' },
    { value: 'meters', label: 'Meters' }
  ];
  
  return units.map(u => 
    `<option value="${u.value}" ${u.value === selectedUnit ? 'selected' : ''}>${u.label}</option>`
  ).join('');
}

/**
 * Render a single invoice item row in the items editor
 */
function renderItemRow(item: InvoiceItem, index: number): string {
  const vatPercent = formatVatPercent(item.vatRate);
  const vatAmount = item.value * item.vatRate;
  const totalWithVat = item.value + vatAmount;
  
  return `
    <tr data-item-index="${index}">
      <td>
        <input type="text" class="item-product" value="${item.product}" placeholder="Product name" required>
      </td>
      <td>
        <input type="number" class="item-quantity" value="${item.quantity}" min="0.01" step="0.01" required>
      </td>
      <td>
        <select class="item-unit">
          ${renderUnitOptions(item.unit)}
        </select>
      </td>
      <td>
        <input type="number" class="item-price" value="${item.price.toFixed(2)}" min="0" step="0.01" required>
      </td>
      <td>
        <input type="number" class="item-vat" value="${vatPercent}" min="0" max="100" step="1">
      </td>
      <td class="text-right item-value">${item.value.toFixed(2)}</td>
      <td class="text-right item-vat-amount">${vatAmount.toFixed(2)}</td>
      <td class="text-right item-total">${totalWithVat.toFixed(2)}</td>
      <td class="actions">
        <button type="button" class="btn btn-delete btn-sm remove-item-btn" data-index="${index}">×</button>
      </td>
    </tr>
  `;
}

/**
 * Render the items table
 */
function renderItemsTable(): string {
  const itemRows = editingItems.length > 0
    ? editingItems.map((item, index) => renderItemRow(item, index)).join('')
    : '<tr class="no-items-row"><td colspan="9" class="text-center">No items added yet. Click "Add Item" to add invoice items.</td></tr>';

  // Calculate totals
  const subtotal = editingItems.reduce((sum, item) => sum + item.value, 0);
  const vatTotal = editingItems.reduce((sum, item) => sum + (item.value * item.vatRate), 0);
  const grandTotal = subtotal + vatTotal;

  return `
    <div class="items-editor">
      <div class="items-header">
        <h3>Invoice Items</h3>
        <button type="button" class="btn btn-save btn-sm" id="add-item-btn">+ Add Item</button>
      </div>
      <div class="table-container">
        <table class="data-table items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th style="width: 80px;">Qty</th>
              <th style="width: 100px;">Unit</th>
              <th style="width: 100px;">Price</th>
              <th style="width: 70px;">VAT %</th>
              <th class="text-right" style="width: 90px;">Subtotal</th>
              <th class="text-right" style="width: 80px;">VAT</th>
              <th class="text-right" style="width: 90px;">Total</th>
              <th style="width: 50px;"></th>
            </tr>
          </thead>
          <tbody id="items-tbody">
            ${itemRows}
          </tbody>
          <tfoot>
            <tr class="totals-row">
              <td colspan="5" class="text-right"><strong>Totals:</strong></td>
              <td class="text-right" id="subtotal-display"><strong>${subtotal.toFixed(2)}</strong></td>
              <td class="text-right" id="vat-total-display"><strong>${vatTotal.toFixed(2)}</strong></td>
              <td class="text-right" id="grand-total-display"><strong>${grandTotal.toFixed(2)}</strong></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
}

export function InvoiceEditPage(id: string): string {
  const isNew = isNewMode(id);
  const repo = getAppData();
  
  let invoice: Invoice | undefined;
  let invoiceId = '';
  let invoiceDate = formatDateForInput(new Date());
  let recipientName = '';
  
  if (isNew) {
    // New invoice mode
    invoiceId = generateInvoiceId();
    editingItems = [];
  } else {
    // Edit existing invoice
    invoice = repo.findInvoiceById(id);
    if (!invoice) {
      return `
        <div class="page">
          <h1>Invoice Not Found</h1>
          <p>Invoice with ID <strong>${id}</strong> was not found.</p>
          <a href="/invoices" class="btn btn-view" data-navigo>Back to Invoices</a>
        </div>
      `;
    }
    invoiceId = invoice.id;
    invoiceDate = formatDateForInput(invoice.date);
    recipientName = invoice.recipient.data.name;
    // Deep copy items for editing
    editingItems = invoice.items.map(item => ({ ...item }));
  }

  const pageTitle = isNew ? 'Create New Invoice' : `Edit Invoice: ${invoiceId}`;
  const submitLabel = isNew ? 'Create Invoice' : 'Save Changes';

  return `
    <div class="page">
      <div class="page-header">
        <h1>${pageTitle}</h1>
        <div class="page-actions">
          <button type="submit" form="invoice-form" class="btn btn-save">${submitLabel}</button>
          <a href="/invoices" class="btn btn-secondary" data-navigo>Cancel</a>
        </div>
      </div>

      <form id="invoice-form" class="invoice-form">
        <input type="hidden" id="original-id" value="${isNew ? '' : id}">
        <input type="hidden" id="is-new" value="${isNew}">

        <div class="info-section">
          <h3>Invoice Details</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="invoice-id">Invoice ID *</label>
              <input type="text" id="invoice-id" name="invoiceId" value="${invoiceId}" ${isNew ? '' : 'readonly'} required>
              ${isNew ? '<span class="form-hint">Auto-generated, you can modify if needed</span>' : ''}
            </div>
            <div class="form-group">
              <label for="invoice-date">Date *</label>
              <input type="date" id="invoice-date" name="date" value="${invoiceDate}" required>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3>Recipient</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="invoice-recipient">Select Recipient *</label>
              <select id="invoice-recipient" name="recipient" required>
                ${renderRecipientOptions(recipientName)}
              </select>
              <span class="form-hint">
                <a href="/clients/new/edit" data-navigo>+ Add new client</a>
              </span>
            </div>
          </div>
        </div>

        <div class="info-section" id="items-section">
          ${renderItemsTable()}
        </div>
      </form>
    </div>
  `;
}

/**
 * Recalculate and update item row values
 */
function updateItemRow(row: HTMLTableRowElement): void {
  const quantity = parseFloat((row.querySelector('.item-quantity') as HTMLInputElement).value) || 0;
  const price = parseFloat((row.querySelector('.item-price') as HTMLInputElement).value) || 0;
  const vatPercent = parseFloat((row.querySelector('.item-vat') as HTMLInputElement).value) || 0;
  
  const value = quantity * price;
  const vatRate = vatPercent / 100;
  const vatAmount = value * vatRate;
  const total = value + vatAmount;
  
  (row.querySelector('.item-value') as HTMLElement).textContent = value.toFixed(2);
  (row.querySelector('.item-vat-amount') as HTMLElement).textContent = vatAmount.toFixed(2);
  (row.querySelector('.item-total') as HTMLElement).textContent = total.toFixed(2);
  
  // Update editingItems array
  const index = parseInt(row.getAttribute('data-item-index') || '0', 10);
  if (editingItems[index]) {
    editingItems[index].quantity = quantity;
    editingItems[index].price = price;
    editingItems[index].vatRate = vatRate;
    editingItems[index].value = value;
    editingItems[index].product = (row.querySelector('.item-product') as HTMLInputElement).value;
    editingItems[index].unit = (row.querySelector('.item-unit') as HTMLSelectElement).value as ProductUnit;
  }
  
  updateTotals();
}

/**
 * Update totals in the footer
 */
function updateTotals(): void {
  const subtotal = editingItems.reduce((sum, item) => sum + item.value, 0);
  const vatTotal = editingItems.reduce((sum, item) => sum + (item.value * item.vatRate), 0);
  const grandTotal = subtotal + vatTotal;
  
  const subtotalEl = document.getElementById('subtotal-display');
  const vatTotalEl = document.getElementById('vat-total-display');
  const grandTotalEl = document.getElementById('grand-total-display');
  
  if (subtotalEl) subtotalEl.innerHTML = `<strong>${subtotal.toFixed(2)}</strong>`;
  if (vatTotalEl) vatTotalEl.innerHTML = `<strong>${vatTotal.toFixed(2)}</strong>`;
  if (grandTotalEl) grandTotalEl.innerHTML = `<strong>${grandTotal.toFixed(2)}</strong>`;
}

/**
 * Add a new empty item row
 */
function addNewItem(): void {
  const repo = getAppData();
  const defaultVatRate = repo.defaultVatRate;
  
  const newItem: InvoiceItem = {
    product: '',
    quantity: 1,
    unit: 'pcs',
    price: 0,
    vatRate: defaultVatRate,
    value: 0
  };
  
  editingItems.push(newItem);
  
  // Re-render items table
  const itemsSection = document.getElementById('items-section');
  if (itemsSection) {
    itemsSection.innerHTML = renderItemsTable();
    initItemsEventHandlers();
  }
}

/**
 * Remove an item by index
 */
function removeItem(index: number): void {
  editingItems.splice(index, 1);
  
  // Re-render items table
  const itemsSection = document.getElementById('items-section');
  if (itemsSection) {
    itemsSection.innerHTML = renderItemsTable();
    initItemsEventHandlers();
  }
}

/**
 * Initialize event handlers for items table
 */
function initItemsEventHandlers(): void {
  // Add item button
  const addItemBtn = document.getElementById('add-item-btn');
  if (addItemBtn) {
    addItemBtn.addEventListener('click', addNewItem);
  }
  
  // Remove item buttons
  document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const index = parseInt(target.getAttribute('data-index') || '0', 10);
      removeItem(index);
    });
  });
  
  // Input change handlers for recalculation
  document.querySelectorAll('.items-table tbody tr[data-item-index]').forEach(row => {
    const inputs = row.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('change', () => updateItemRow(row as HTMLTableRowElement));
      input.addEventListener('input', () => updateItemRow(row as HTMLTableRowElement));
    });
  });
}

/**
 * Initialize event handlers for the invoice edit page
 */
export function initInvoiceEditPageEvents(): void {
  initItemsEventHandlers();
  
  // Form submit handler via button click (more reliable than form submit with external button)
  const submitBtn = document.querySelector('button[type="submit"][form="invoice-form"]');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const isNew = (document.getElementById('is-new') as HTMLInputElement).value === 'true';
      const originalId = (document.getElementById('original-id') as HTMLInputElement).value;
      const invoiceId = (document.getElementById('invoice-id') as HTMLInputElement).value.trim();
      const dateStr = (document.getElementById('invoice-date') as HTMLInputElement).value;
      const recipientName = (document.getElementById('invoice-recipient') as HTMLSelectElement).value;

      // Validation
      if (!invoiceId) {
        alert('Invoice ID is required!');
        return;
      }

      if (!dateStr) {
        alert('Date is required!');
        return;
      }

      if (!recipientName) {
        alert('Please select a recipient!');
        return;
      }

      if (editingItems.length === 0) {
        alert('Please add at least one item to the invoice!');
        return;
      }

      // Validate all items have products
      for (let i = 0; i < editingItems.length; i++) {
        if (!editingItems[i].product.trim()) {
          alert(`Item ${i + 1}: Product name is required!`);
          return;
        }
        if (editingItems[i].quantity <= 0) {
          alert(`Item ${i + 1}: Quantity must be greater than 0!`);
          return;
        }
      }

      const repo = getAppData();
      
      // Find recipient
      const recipient = repo.recipients.find((r: Recipient) => r.data.name === recipientName);
      if (!recipient) {
        alert('Selected recipient not found!');
        return;
      }

      // Calculate totals
      const subtotalAmount = editingItems.reduce((sum, item) => sum + item.value, 0);
      const vatAmount = editingItems.reduce((sum, item) => sum + (item.value * item.vatRate), 0);
      const totalAmount = subtotalAmount + vatAmount;

      // Create invoice object
      const newInvoice: Invoice = {
        id: invoiceId,
        date: new Date(dateStr),
        issuer: repo.invoiceIssuer,
        recipient: recipient,
        items: editingItems.map(item => ({ ...item })),
        subtotalAmount,
        vatAmount,
        totalAmount
      };

      // If editing, delete the old invoice first
      if (!isNew && originalId) {
        repo.deleteInvoice(originalId);
      }

      // Check for duplicate ID (only for new invoices or if ID changed)
      if (isNew || invoiceId !== originalId) {
        const existing = repo.findInvoiceById(invoiceId);
        if (existing) {
          alert(`Invoice with ID "${invoiceId}" already exists!`);
          return;
        }
      }

      // Add the invoice
      repo.addInvoice(newInvoice);

      console.log(isNew ? 'Invoice created:' : 'Invoice updated:', newInvoice);

      // Navigate back to invoices list
      alert(isNew ? 'Invoice created successfully!' : 'Invoice updated successfully!');
      window.location.hash = '/invoices';
    });
  }
}
