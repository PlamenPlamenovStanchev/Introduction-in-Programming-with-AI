import html from './invoices.html?raw';
import './invoices.css';
import { 
    invoices, 
    clients, 
    products, 
    companyProfile,
    addInvoice, 
    updateInvoice, 
    deleteInvoice
} from '../../data';
import type { Invoice, InvoiceItem, Company, Product } from '../../data';

let editingInvoiceId: string | null = null;
let deletingInvoiceId: string | null = null;
let currentItems: InvoiceItem[] = [];
let selectedClient: Company | null = null;
let editingItemIndex: number | null = null;

export function render(): string {
    return html;
}

export function init(): void {
    console.log('Invoices tab initialized');
    
    renderInvoicesTable();
    setupEventListeners();
}

function renderInvoicesTable(): void {
    const tbody = document.getElementById('invoices-tbody')!;
    
    if (invoices.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <p>No invoices found. Click "Add Invoice" to create one.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = invoices.map(invoice => `
        <tr data-id="${invoice.id}">
            <td>${escapeHtml(invoice.id)}</td>
            <td>${formatDate(invoice.date)}</td>
            <td>${escapeHtml(invoice.recipient.name)}</td>
            <td>${invoice.items.length}</td>
            <td class="amount-cell">${invoice.amountSubtotal.toFixed(2)}</td>
            <td class="amount-cell">${invoice.vat.toFixed(2)}</td>
            <td class="amount-cell amount-positive">${invoice.totalAmount.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${invoice.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${invoice.id}">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = (e.target as HTMLElement).getAttribute('data-id')!;
            openEditModal(id);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = (e.target as HTMLElement).getAttribute('data-id')!;
            openDeleteModal(id);
        });
    });
}

function setupEventListeners(): void {
    // Add Invoice button
    document.getElementById('add-invoice-btn')!.addEventListener('click', openAddModal);
    
    // Invoice modal close buttons
    document.getElementById('modal-close')!.addEventListener('click', closeInvoiceModal);
    document.getElementById('modal-cancel')!.addEventListener('click', closeInvoiceModal);
    document.querySelector('#invoice-modal .modal-overlay')!.addEventListener('click', closeInvoiceModal);
    
    // Client selection
    document.getElementById('select-client-btn')!.addEventListener('click', openClientModal);
    document.getElementById('invoice-client-display')!.addEventListener('click', openClientModal);
    
    // Client modal close
    document.getElementById('client-modal-close')!.addEventListener('click', closeClientModal);
    document.getElementById('client-modal-overlay')!.addEventListener('click', closeClientModal);
    document.getElementById('client-search')!.addEventListener('input', filterClients);
    
    // Product modal close
    document.getElementById('product-modal-close')!.addEventListener('click', closeProductModal);
    document.getElementById('product-modal-overlay')!.addEventListener('click', closeProductModal);
    document.getElementById('product-search')!.addEventListener('input', filterProducts);
    
    // Add item button
    document.getElementById('add-item-btn')!.addEventListener('click', () => openProductModal(null));
    
    // Delete modal
    document.getElementById('delete-modal-close')!.addEventListener('click', closeDeleteModal);
    document.getElementById('cancel-delete-btn')!.addEventListener('click', closeDeleteModal);
    document.querySelector('#delete-modal .modal-overlay')!.addEventListener('click', closeDeleteModal);
    document.getElementById('confirm-delete-btn')!.addEventListener('click', confirmDelete);
    
    // Form submit
    document.getElementById('invoice-form')!.addEventListener('submit', handleFormSubmit);
}

// Invoice Modal Functions
function openAddModal(): void {
    editingInvoiceId = null;
    selectedClient = null;
    currentItems = [];
    
    document.getElementById('modal-title')!.textContent = 'Add Invoice';
    clearInvoiceForm();
    
    // Generate new invoice ID
    const year = new Date().getFullYear();
    const nextNum = invoices.length + 1;
    (document.getElementById('invoice-id') as HTMLInputElement).value = `INV-${year}-${String(nextNum).padStart(3, '0')}`;
    (document.getElementById('invoice-date') as HTMLInputElement).value = new Date().toISOString().split('T')[0];
    
    renderItemsTable();
    showModal('invoice-modal');
}

function openEditModal(id: string): void {
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;
    
    editingInvoiceId = id;
    selectedClient = invoice.recipient;
    currentItems = invoice.items.map(item => ({ ...item, product: { ...item.product } }));
    
    document.getElementById('modal-title')!.textContent = 'Edit Invoice';
    
    (document.getElementById('invoice-id') as HTMLInputElement).value = invoice.id;
    (document.getElementById('invoice-date') as HTMLInputElement).value = formatDateForInput(invoice.date);
    (document.getElementById('invoice-client-display') as HTMLInputElement).value = invoice.recipient.name;
    (document.getElementById('invoice-client-id') as HTMLInputElement).value = invoice.recipient.id;
    
    renderItemsTable();
    showModal('invoice-modal');
}

function closeInvoiceModal(): void {
    hideModal('invoice-modal');
    editingInvoiceId = null;
    selectedClient = null;
    currentItems = [];
}

function clearInvoiceForm(): void {
    (document.getElementById('invoice-form') as HTMLFormElement).reset();
    (document.getElementById('invoice-client-display') as HTMLInputElement).value = '';
    (document.getElementById('invoice-client-id') as HTMLInputElement).value = '';
}

// Client Modal Functions
function openClientModal(): void {
    renderClientList(clients);
    (document.getElementById('client-search') as HTMLInputElement).value = '';
    showModal('client-modal');
}

function closeClientModal(): void {
    hideModal('client-modal');
}

function renderClientList(clientList: Company[]): void {
    const listEl = document.getElementById('client-list')!;
    
    if (clientList.length === 0) {
        listEl.innerHTML = '<div class="items-empty">No clients found</div>';
        return;
    }
    
    listEl.innerHTML = clientList.map(client => `
        <div class="selection-item" data-id="${client.id}">
            <div class="item-name">${escapeHtml(client.name)}</div>
            <div class="item-details">${escapeHtml(client.taxId)} • ${escapeHtml(client.address)}</div>
        </div>
    `).join('');
    
    listEl.querySelectorAll('.selection-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id')!;
            selectClient(id);
        });
    });
}

function filterClients(): void {
    const search = (document.getElementById('client-search') as HTMLInputElement).value.toLowerCase();
    const filtered = clients.filter(c => 
        c.name.toLowerCase().includes(search) || 
        c.taxId.toLowerCase().includes(search)
    );
    renderClientList(filtered);
}

function selectClient(id: string): void {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    
    selectedClient = client;
    (document.getElementById('invoice-client-display') as HTMLInputElement).value = client.name;
    (document.getElementById('invoice-client-id') as HTMLInputElement).value = client.id;
    closeClientModal();
}

// Product Modal Functions
function openProductModal(itemIndex: number | null): void {
    editingItemIndex = itemIndex;
    renderProductList(products);
    (document.getElementById('product-search') as HTMLInputElement).value = '';
    showModal('product-modal');
}

function closeProductModal(): void {
    hideModal('product-modal');
    editingItemIndex = null;
}

function renderProductList(productList: Product[]): void {
    const listEl = document.getElementById('product-list')!;
    
    if (productList.length === 0) {
        listEl.innerHTML = '<div class="items-empty">No products found</div>';
        return;
    }
    
    listEl.innerHTML = productList.map(product => `
        <div class="selection-item" data-id="${product.id}">
            <div class="item-name">${escapeHtml(product.name)}</div>
            <div class="item-details">${product.price.toFixed(2)} ${product.currency} / ${product.unit}</div>
        </div>
    `).join('');
    
    listEl.querySelectorAll('.selection-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id')!;
            selectProduct(id);
        });
    });
}

function filterProducts(): void {
    const search = (document.getElementById('product-search') as HTMLInputElement).value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(search)
    );
    renderProductList(filtered);
}

function selectProduct(id: string): void {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const vatRate = companyProfile.defaultVatRate ?? 20;
    
    if (editingItemIndex !== null) {
        // Update existing item
        currentItems[editingItemIndex].product = product;
        currentItems[editingItemIndex].valueWithoutVat = product.price * currentItems[editingItemIndex].quantity;
    } else {
        // Add new item
        const newItem: InvoiceItem = {
            product,
            quantity: 1,
            vatRate,
            valueWithoutVat: product.price
        };
        currentItems.push(newItem);
    }
    
    closeProductModal();
    renderItemsTable();
}

// Invoice Items Table
function renderItemsTable(): void {
    const tbody = document.getElementById('invoice-items-tbody')!;
    
    if (currentItems.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="items-empty">No items added. Click "Add Item" to add products.</td>
            </tr>
        `;
        updateTotals();
        return;
    }
    
    tbody.innerHTML = currentItems.map((item, index) => `
        <tr data-index="${index}">
            <td>
                <input type="text" value="${escapeHtml(item.product.name)}" readonly 
                    class="product-select" data-index="${index}">
            </td>
            <td>
                <input type="number" value="${item.quantity}" min="1" step="1" 
                    class="quantity-input" data-index="${index}">
            </td>
            <td>
                <input type="text" value="${item.product.price.toFixed(2)} ${item.product.currency}" readonly>
            </td>
            <td>
                <input type="number" value="${item.vatRate}" min="0" max="100" step="0.1"
                    class="vat-input" data-index="${index}">
            </td>
            <td>
                <input type="text" value="${item.valueWithoutVat.toFixed(2)}" readonly>
            </td>
            <td>
                <button type="button" class="btn btn-danger btn-sm remove-item-btn" data-index="${index}">Remove</button>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners
    tbody.querySelectorAll('.product-select').forEach(input => {
        input.addEventListener('click', (e) => {
            const index = parseInt((e.target as HTMLElement).getAttribute('data-index')!);
            openProductModal(index);
        });
    });
    
    tbody.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt((e.target as HTMLElement).getAttribute('data-index')!);
            const value = parseInt((e.target as HTMLInputElement).value) || 1;
            updateItemQuantity(index, value);
        });
    });
    
    tbody.querySelectorAll('.vat-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt((e.target as HTMLElement).getAttribute('data-index')!);
            const value = parseFloat((e.target as HTMLInputElement).value) || 0;
            updateItemVat(index, value);
        });
    });
    
    tbody.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt((e.target as HTMLElement).getAttribute('data-index')!);
            removeItem(index);
        });
    });
    
    updateTotals();
}

function updateItemQuantity(index: number, quantity: number): void {
    currentItems[index].quantity = quantity;
    currentItems[index].valueWithoutVat = currentItems[index].product.price * quantity;
    renderItemsTable();
}

function updateItemVat(index: number, vatRate: number): void {
    currentItems[index].vatRate = vatRate;
    updateTotals();
}

function removeItem(index: number): void {
    currentItems.splice(index, 1);
    renderItemsTable();
}

function updateTotals(): void {
    const subtotal = currentItems.reduce((sum, item) => sum + item.valueWithoutVat, 0);
    const vat = currentItems.reduce((sum, item) => sum + (item.valueWithoutVat * item.vatRate / 100), 0);
    const total = subtotal + vat;
    
    document.getElementById('items-subtotal')!.textContent = subtotal.toFixed(2);
    document.getElementById('items-vat')!.textContent = vat.toFixed(2);
    document.getElementById('items-total')!.textContent = total.toFixed(2);
}

// Delete Modal Functions
function openDeleteModal(id: string): void {
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;
    
    deletingInvoiceId = id;
    document.getElementById('delete-invoice-id')!.textContent = invoice.id;
    showModal('delete-modal');
}

function closeDeleteModal(): void {
    hideModal('delete-modal');
    deletingInvoiceId = null;
}

function confirmDelete(): void {
    if (deletingInvoiceId) {
        deleteInvoice(deletingInvoiceId);
        closeDeleteModal();
        renderInvoicesTable();
    }
}

// Form Submit
function handleFormSubmit(e: Event): void {
    e.preventDefault();
    
    if (!selectedClient) {
        alert('Please select a client');
        return;
    }
    
    if (currentItems.length === 0) {
        alert('Please add at least one item');
        return;
    }
    
    const subtotal = currentItems.reduce((sum, item) => sum + item.valueWithoutVat, 0);
    const vat = currentItems.reduce((sum, item) => sum + (item.valueWithoutVat * item.vatRate / 100), 0);
    const total = subtotal + vat;
    
    const invoice: Invoice = {
        id: (document.getElementById('invoice-id') as HTMLInputElement).value,
        date: new Date((document.getElementById('invoice-date') as HTMLInputElement).value),
        issuer: companyProfile,
        recipient: selectedClient,
        items: currentItems.map(item => ({ ...item, product: { ...item.product } })),
        amountSubtotal: subtotal,
        vat: vat,
        totalAmount: total
    };
    
    if (editingInvoiceId) {
        updateInvoice(editingInvoiceId, invoice);
    } else {
        addInvoice(invoice);
    }
    
    closeInvoiceModal();
    renderInvoicesTable();
}

// Utility Functions
function showModal(modalId: string): void {
    document.getElementById(modalId)!.style.display = 'flex';
}

function hideModal(modalId: string): void {
    document.getElementById(modalId)!.style.display = 'none';
}

function formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB');
}

function formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
