import type { Company, Product, Invoice, InvoiceItem } from './types';
import { Currency } from './types';

// Company Profile (the user's company)
export let companyProfile: Company = {
    id: 'company-001',
    name: 'TechSoft Solutions Ltd.',
    taxId: 'BG123456789',
    address: '123 Innovation Street, Sofia 1000, Bulgaria',
    manager: 'Ivan Petrov',
    iban: 'BG80BNBG96611020345678',
    defaultVatRate: 20
};

// Clients array
export let clients: Company[] = [
    {
        id: 'client-001',
        name: 'Digital Dreams Inc.',
        taxId: 'BG987654321',
        address: '45 Tech Park Blvd, Plovdiv 4000, Bulgaria',
        manager: 'Maria Georgieva',
        iban: 'BG42UNCR70001522345678'
    },
    {
        id: 'client-002',
        name: 'Green Energy Corp.',
        taxId: 'BG456789123',
        address: '78 Eco Avenue, Varna 9000, Bulgaria',
        manager: 'Georgi Dimitrov',
        iban: 'BG18RZBB91551012345678'
    },
    {
        id: 'client-003',
        name: 'Smart Retail Solutions',
        taxId: 'BG789123456',
        address: '12 Commerce Street, Burgas 8000, Bulgaria',
        manager: 'Elena Todorova',
        iban: 'BG33STSA93001234567890'
    }
];

// Products array
export let products: Product[] = [
    {
        id: 'prod-001',
        name: 'Web Development Service',
        price: 80,
        currency: Currency.EUR,
        unit: 'hour'
    },
    {
        id: 'prod-002',
        name: 'Mobile App Development',
        price: 100,
        currency: Currency.EUR,
        unit: 'hour'
    },
    {
        id: 'prod-003',
        name: 'IT Consulting',
        price: 150,
        currency: Currency.BGN,
        unit: 'hour'
    },
    {
        id: 'prod-004',
        name: 'Server Maintenance',
        price: 500,
        currency: Currency.BGN,
        unit: 'month'
    },
    {
        id: 'prod-005',
        name: 'Cloud Hosting Package',
        price: 200,
        currency: Currency.USD,
        unit: 'month'
    },
    {
        id: 'prod-006',
        name: 'SEO Optimization',
        price: 300,
        currency: Currency.EUR,
        unit: 'project'
    }
];

// Helper function to create invoice items
function createInvoiceItem(product: Product, quantity: number, vatRate: number): InvoiceItem {
    const valueWithoutVat = product.price * quantity;
    return {
        product,
        quantity,
        vatRate,
        valueWithoutVat
    };
}

// Helper function to calculate invoice totals
function calculateInvoiceTotals(items: InvoiceItem[]): { amountSubtotal: number; vat: number; totalAmount: number } {
    const amountSubtotal = items.reduce((sum, item) => sum + item.valueWithoutVat, 0);
    const vat = items.reduce((sum, item) => sum + (item.valueWithoutVat * item.vatRate / 100), 0);
    const totalAmount = amountSubtotal + vat;
    return { amountSubtotal, vat, totalAmount };
}

// Sample invoice items
const invoice1Items: InvoiceItem[] = [
    createInvoiceItem(products[0], 40, 20), // 40 hours of Web Development
    createInvoiceItem(products[5], 1, 20)   // 1 SEO project
];

const invoice2Items: InvoiceItem[] = [
    createInvoiceItem(products[1], 80, 20), // 80 hours of Mobile App Development
    createInvoiceItem(products[4], 3, 20)   // 3 months of Cloud Hosting
];

const invoice3Items: InvoiceItem[] = [
    createInvoiceItem(products[2], 20, 20), // 20 hours of IT Consulting
    createInvoiceItem(products[3], 6, 20)   // 6 months of Server Maintenance
];

// Calculate totals for each invoice
const invoice1Totals = calculateInvoiceTotals(invoice1Items);
const invoice2Totals = calculateInvoiceTotals(invoice2Items);
const invoice3Totals = calculateInvoiceTotals(invoice3Items);

// Invoices array
export let invoices: Invoice[] = [
    {
        id: 'INV-2024-001',
        date: new Date('2024-01-15'),
        issuer: companyProfile,
        recipient: clients[0],
        items: invoice1Items,
        ...invoice1Totals,
        paid: true
    },
    {
        id: 'INV-2024-002',
        date: new Date('2024-02-20'),
        issuer: companyProfile,
        recipient: clients[1],
        items: invoice2Items,
        ...invoice2Totals,
        paid: false
    },
    {
        id: 'INV-2024-003',
        date: new Date('2024-03-10'),
        issuer: companyProfile,
        recipient: clients[2],
        items: invoice3Items,
        ...invoice3Totals,
        paid: false
    }
];

// Utility functions for data manipulation
export function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function addClient(client: Company): void {
    clients.push(client);
}

export function updateClient(id: string, updatedClient: Company): void {
    const index = clients.findIndex(c => c.id === id);
    if (index !== -1) {
        clients[index] = updatedClient;
    }
}

export function deleteClient(id: string): void {
    clients = clients.filter(c => c.id !== id);
}

export function addProduct(product: Product): void {
    products.push(product);
}

export function updateProduct(id: string, updatedProduct: Product): void {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = updatedProduct;
    }
}

export function deleteProduct(id: string): void {
    products = products.filter(p => p.id !== id);
}

export function addInvoice(invoice: Invoice): void {
    invoices.push(invoice);
}

export function updateInvoice(id: string, updatedInvoice: Invoice): void {
    const index = invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
        invoices[index] = updatedInvoice;
    }
}

export function deleteInvoice(id: string): void {
    invoices = invoices.filter(inv => inv.id !== id);
}

export function toggleInvoicePaid(id: string): void {
    const index = invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
        invoices[index].paid = !invoices[index].paid;
    }
}

export function updateCompanyProfile(company: Company): void {
    companyProfile = company;
}

export function createInvoice(
    recipient: Company,
    items: { product: Product; quantity: number; vatRate: number }[]
): Invoice {
    const invoiceItems = items.map(item => createInvoiceItem(item.product, item.quantity, item.vatRate));
    const totals = calculateInvoiceTotals(invoiceItems);
    
    const year = new Date().getFullYear();
    const invoiceNumber = invoices.length + 1;
    
    return {
        id: `INV-${year}-${String(invoiceNumber).padStart(3, '0')}`,
        date: new Date(),
        issuer: companyProfile,
        recipient,
        items: invoiceItems,
        ...totals
    };
}
