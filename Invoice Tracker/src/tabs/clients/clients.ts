import html from './clients.html?raw';
import './clients.css';
import { clients, addClient, updateClient, deleteClient, generateId } from '../../data';
import type { Company } from '../../data';

let editingClientId: string | null = null;
let deletingClientId: string | null = null;

export function render(): string {
    return html;
}

export function init(): void {
    console.log('Clients tab initialized');
    
    // Render clients table
    renderClientsTable();
    
    // Setup event listeners
    setupEventListeners();
}

function renderClientsTable(): void {
    const tbody = document.getElementById('clients-tbody')!;
    
    if (clients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <p>No clients found. Click "Add Client" to create one.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = clients.map(client => `
        <tr data-id="${client.id}">
            <td>${escapeHtml(client.name)}</td>
            <td>${escapeHtml(client.taxId)}</td>
            <td>${escapeHtml(client.address)}</td>
            <td>${escapeHtml(client.manager)}</td>
            <td>${escapeHtml(client.iban)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${client.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${client.id}">Delete</button>
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
    // Add Client button
    document.getElementById('add-client-btn')!.addEventListener('click', () => {
        openAddModal();
    });
    
    // Modal close buttons
    document.getElementById('modal-close')!.addEventListener('click', closeModal);
    document.getElementById('modal-cancel')!.addEventListener('click', closeModal);
    document.querySelector('#client-modal .modal-overlay')!.addEventListener('click', closeModal);
    
    // Delete modal close buttons
    document.getElementById('delete-modal-close')!.addEventListener('click', closeDeleteModal);
    document.getElementById('cancel-delete-btn')!.addEventListener('click', closeDeleteModal);
    document.querySelector('#delete-modal .modal-overlay')!.addEventListener('click', closeDeleteModal);
    
    // Confirm delete button
    document.getElementById('confirm-delete-btn')!.addEventListener('click', confirmDelete);
    
    // Form submit
    document.getElementById('client-form')!.addEventListener('submit', handleFormSubmit);
}

function openAddModal(): void {
    editingClientId = null;
    document.getElementById('modal-title')!.textContent = 'Add Client';
    clearForm();
    showModal('client-modal');
}

function openEditModal(id: string): void {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    
    editingClientId = id;
    document.getElementById('modal-title')!.textContent = 'Edit Client';
    populateForm(client);
    showModal('client-modal');
}

function openDeleteModal(id: string): void {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    
    deletingClientId = id;
    document.getElementById('delete-client-name')!.textContent = client.name;
    showModal('delete-modal');
}

function closeModal(): void {
    hideModal('client-modal');
    editingClientId = null;
}

function closeDeleteModal(): void {
    hideModal('delete-modal');
    deletingClientId = null;
}

function showModal(modalId: string): void {
    document.getElementById(modalId)!.style.display = 'flex';
}

function hideModal(modalId: string): void {
    document.getElementById(modalId)!.style.display = 'none';
}

function clearForm(): void {
    (document.getElementById('client-form') as HTMLFormElement).reset();
    (document.getElementById('client-id') as HTMLInputElement).value = '';
}

function populateForm(client: Company): void {
    (document.getElementById('client-id') as HTMLInputElement).value = client.id;
    (document.getElementById('client-name') as HTMLInputElement).value = client.name;
    (document.getElementById('client-taxId') as HTMLInputElement).value = client.taxId;
    (document.getElementById('client-address') as HTMLInputElement).value = client.address;
    (document.getElementById('client-manager') as HTMLInputElement).value = client.manager;
    (document.getElementById('client-iban') as HTMLInputElement).value = client.iban;
}

function handleFormSubmit(e: Event): void {
    e.preventDefault();
    
    const client: Company = {
        id: editingClientId || generateId('client'),
        name: (document.getElementById('client-name') as HTMLInputElement).value,
        taxId: (document.getElementById('client-taxId') as HTMLInputElement).value,
        address: (document.getElementById('client-address') as HTMLInputElement).value,
        manager: (document.getElementById('client-manager') as HTMLInputElement).value,
        iban: (document.getElementById('client-iban') as HTMLInputElement).value
    };
    
    if (editingClientId) {
        updateClient(editingClientId, client);
    } else {
        addClient(client);
    }
    
    closeModal();
    renderClientsTable();
}

function confirmDelete(): void {
    if (deletingClientId) {
        deleteClient(deletingClientId);
        closeDeleteModal();
        renderClientsTable();
    }
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
