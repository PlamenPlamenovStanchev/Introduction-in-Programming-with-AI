import html from './tracker.html?raw';
import './tracker.css';
import { invoices, toggleInvoicePaid } from '../../data';
import type { Invoice } from '../../data';

let currentFilter: 'all' | 'paid' | 'unpaid' = 'all';

export function render(): string {
    return html;
}

export function init(): void {
    console.log('Tracker tab initialized');
    
    updateSummary();
    renderTrackerTable();
    setupEventListeners();
}

function setupEventListeners(): void {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = (e.target as HTMLElement).getAttribute('data-filter') as 'all' | 'paid' | 'unpaid';
            setFilter(filter);
        });
    });
}

function setFilter(filter: 'all' | 'paid' | 'unpaid'): void {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTrackerTable();
}

function getFilteredInvoices(): Invoice[] {
    switch (currentFilter) {
        case 'paid':
            return invoices.filter(inv => inv.paid === true);
        case 'unpaid':
            return invoices.filter(inv => inv.paid !== true);
        default:
            return invoices;
    }
}

function updateSummary(): void {
    const total = invoices.length;
    const paid = invoices.filter(inv => inv.paid === true).length;
    const unpaid = total - paid;
    const unpaidAmount = invoices
        .filter(inv => inv.paid !== true)
        .reduce((sum, inv) => sum + inv.totalAmount, 0);
    
    document.getElementById('total-invoices')!.textContent = String(total);
    document.getElementById('paid-invoices')!.textContent = String(paid);
    document.getElementById('unpaid-invoices')!.textContent = String(unpaid);
    document.getElementById('unpaid-amount')!.textContent = unpaidAmount.toFixed(2);
}

function renderTrackerTable(): void {
    const tbody = document.getElementById('tracker-tbody')!;
    const filteredInvoices = getFilteredInvoices();
    
    if (filteredInvoices.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <p>No invoices found${currentFilter !== 'all' ? ` with status "${currentFilter}"` : ''}.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredInvoices.map(invoice => `
        <tr data-id="${invoice.id}" class="${invoice.paid ? 'row-paid' : 'row-unpaid'}">
            <td>${escapeHtml(invoice.id)}</td>
            <td>${formatDate(invoice.date)}</td>
            <td>${escapeHtml(invoice.recipient.name)}</td>
            <td class="amount-cell">${invoice.totalAmount.toFixed(2)}</td>
            <td>
                <span class="status-badge ${invoice.paid ? 'paid' : 'unpaid'}">
                    ${invoice.paid ? 'Yes' : 'No'}
                </span>
            </td>
            <td>
                <label class="toggle-switch">
                    <input type="checkbox" class="paid-toggle" data-id="${invoice.id}" ${invoice.paid ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to toggles
    document.querySelectorAll('.paid-toggle').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const id = (e.target as HTMLElement).getAttribute('data-id')!;
            handleTogglePaid(id);
        });
    });
}

function handleTogglePaid(id: string): void {
    toggleInvoicePaid(id);
    updateSummary();
    renderTrackerTable();
}

function formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB');
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
