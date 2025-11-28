import html from './products.html?raw';
import './products.css';
import { products, addProduct, updateProduct, deleteProduct, generateId, Currency } from '../../data';
import type { Product } from '../../data';

let editingProductId: string | null = null;
let deletingProductId: string | null = null;

export function render(): string {
    return html;
}

export function init(): void {
    console.log('Products tab initialized');
    
    // Render products table
    renderProductsTable();
    
    // Setup event listeners
    setupEventListeners();
}

function renderProductsTable(): void {
    const tbody = document.getElementById('products-tbody')!;
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <p>No products found. Click "Add Product" to create one.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr data-id="${product.id}">
            <td>${escapeHtml(product.name)}</td>
            <td class="price-cell">${product.price.toFixed(2)}</td>
            <td>${escapeHtml(product.currency)}</td>
            <td>${escapeHtml(product.unit)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${product.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${product.id}">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to edit/delete buttons
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
    // Add Product button
    document.getElementById('add-product-btn')!.addEventListener('click', () => {
        openAddModal();
    });
    
    // Modal close buttons
    document.getElementById('modal-close')!.addEventListener('click', closeModal);
    document.getElementById('modal-cancel')!.addEventListener('click', closeModal);
    document.querySelector('#product-modal .modal-overlay')!.addEventListener('click', closeModal);
    
    // Delete modal close buttons
    document.getElementById('delete-modal-close')!.addEventListener('click', closeDeleteModal);
    document.getElementById('cancel-delete-btn')!.addEventListener('click', closeDeleteModal);
    document.querySelector('#delete-modal .modal-overlay')!.addEventListener('click', closeDeleteModal);
    
    // Confirm delete button
    document.getElementById('confirm-delete-btn')!.addEventListener('click', confirmDelete);
    
    // Form submit
    document.getElementById('product-form')!.addEventListener('submit', handleFormSubmit);
}

function openAddModal(): void {
    editingProductId = null;
    document.getElementById('modal-title')!.textContent = 'Add Product';
    clearForm();
    showModal('product-modal');
}

function openEditModal(id: string): void {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    editingProductId = id;
    document.getElementById('modal-title')!.textContent = 'Edit Product';
    populateForm(product);
    showModal('product-modal');
}

function openDeleteModal(id: string): void {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    deletingProductId = id;
    document.getElementById('delete-product-name')!.textContent = product.name;
    showModal('delete-modal');
}

function closeModal(): void {
    hideModal('product-modal');
    editingProductId = null;
}

function closeDeleteModal(): void {
    hideModal('delete-modal');
    deletingProductId = null;
}

function showModal(modalId: string): void {
    document.getElementById(modalId)!.style.display = 'flex';
}

function hideModal(modalId: string): void {
    document.getElementById(modalId)!.style.display = 'none';
}

function clearForm(): void {
    (document.getElementById('product-form') as HTMLFormElement).reset();
    (document.getElementById('product-id') as HTMLInputElement).value = '';
}

function populateForm(product: Product): void {
    (document.getElementById('product-id') as HTMLInputElement).value = product.id;
    (document.getElementById('product-name') as HTMLInputElement).value = product.name;
    (document.getElementById('product-price') as HTMLInputElement).value = String(product.price);
    (document.getElementById('product-currency') as HTMLSelectElement).value = product.currency;
    (document.getElementById('product-unit') as HTMLInputElement).value = product.unit;
}

function handleFormSubmit(e: Event): void {
    e.preventDefault();
    
    const currencyValue = (document.getElementById('product-currency') as HTMLSelectElement).value;
    
    const product: Product = {
        id: editingProductId || generateId('prod'),
        name: (document.getElementById('product-name') as HTMLInputElement).value,
        price: parseFloat((document.getElementById('product-price') as HTMLInputElement).value),
        currency: currencyValue as typeof Currency[keyof typeof Currency],
        unit: (document.getElementById('product-unit') as HTMLInputElement).value
    };
    
    if (editingProductId) {
        updateProduct(editingProductId, product);
    } else {
        addProduct(product);
    }
    
    closeModal();
    renderProductsTable();
}

function confirmDelete(): void {
    if (deletingProductId) {
        deleteProduct(deletingProductId);
        closeDeleteModal();
        renderProductsTable();
    }
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
