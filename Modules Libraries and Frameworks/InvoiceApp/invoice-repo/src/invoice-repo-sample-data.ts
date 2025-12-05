/**
 * Invoice Repository Sample Data Module
 * Contains function to generate sample data for testing
 */

import { IssuerCompany, Recipient, ProductUnit } from './invoice-types.js';
import InvoiceRepo from './invoice-repo.js';

/**
 * Generates a tax ID by combining country code with company ID
 * @param countryCode - Country code (e.g., 'BG')
 * @param companyId - Company ID number
 * @returns Tax ID string (e.g., 'BG200776618')
 */
function generateTaxId(countryCode: string, companyId: string): string {
  return `${countryCode}${companyId}`;
}

/**
 * Generates a sample InvoiceRepo with test data
 * Default VAT rate is 20%
 * @returns InvoiceRepo instance with sample data (5-10 invoices)
 */
function generateSampleData(): InvoiceRepo {
  // Default issuer company
  const issuer: IssuerCompany = {
    name: 'Tech Solutions Ltd.',
    id: '200776618',
    taxId: generateTaxId('BG', '200776618'),
    address: '123 Business Park, Sofia 1000, Bulgaria',
    manager: 'Ivan Petrov',
    iban: 'BG80BNBG96611020345678',
  };

  // Create repo with 20% VAT
  const repo = new InvoiceRepo({
    defaultVatRate: 0.2,
    invoiceIssuer: issuer,
  });

  // Sample recipients
  const recipients: Recipient[] = [
    InvoiceRepo.createCompanyRecipient({
      name: 'ABC Corporation',
      id: '123456789',
      taxId: generateTaxId('BG', '123456789'),
      address: '456 Industrial Zone, Plovdiv 4000, Bulgaria',
      manager: 'Georgi Ivanov',
    }),
    InvoiceRepo.createCompanyRecipient({
      name: 'Global Trade Ltd.',
      id: '987654321',
      taxId: generateTaxId('BG', '987654321'),
      address: '78 Commerce Street, Varna 9000, Bulgaria',
      manager: 'Maria Dimitrova',
    }),
    InvoiceRepo.createCompanyRecipient({
      name: 'Sunrise Industries',
      id: '555666777',
      taxId: generateTaxId('BG', '555666777'),
      address: '12 Factory Road, Burgas 8000, Bulgaria',
      manager: 'Nikolay Stoyanov',
    }),
    InvoiceRepo.createCompanyRecipient({
      name: 'Quick Services',
      id: '111222333',
      taxId: generateTaxId('BG', '111222333'),
      address: '34 Service Lane, Ruse 7000, Bulgaria',
    }),
    InvoiceRepo.createIndividualRecipient({
      name: 'Petar Angelov',
      nationalIdNumber: '8501154567',
    }),
    InvoiceRepo.createIndividualRecipient({
      name: 'Elena Todorova',
      nationalIdNumber: '9003228901',
    }),
    InvoiceRepo.createIndividualRecipient({
      name: 'Stefan Kolev',
    }),
  ];

  // Add recipients to repo
  recipients.forEach((r) => repo.addRecipient(r));

  // Sample products data
  const products: Array<{
    name: string;
    unit: ProductUnit;
    price: number;
  }> = [
    { name: 'Laptop Dell XPS 15', unit: 'pcs', price: 2500 },
    { name: 'Office Chair Ergonomic', unit: 'pcs', price: 350 },
    { name: 'USB-C Cable 2m', unit: 'pcs', price: 15 },
    { name: 'Printer Paper A4', unit: 'pcs', price: 8 },
    { name: 'Coffee Beans Premium', unit: 'kg', price: 25 },
    { name: 'Cleaning Solution', unit: 'liters', price: 12 },
    { name: 'Network Cable Cat6', unit: 'meters', price: 2 },
    { name: 'Monitor 27" 4K', unit: 'pcs', price: 600 },
    { name: 'Wireless Mouse', unit: 'pcs', price: 45 },
    { name: 'Keyboard Mechanical', unit: 'pcs', price: 120 },
  ];

  // Generate 8 invoices
  const invoiceData = [
    {
      id: 'INV-2024-001',
      date: new Date('2024-01-15'),
      recipientIndex: 0,
      items: [
        { productIndex: 0, quantity: 5 },
        { productIndex: 1, quantity: 10 },
        { productIndex: 2, quantity: 20 },
      ],
    },
    {
      id: 'INV-2024-002',
      date: new Date('2024-02-01'),
      recipientIndex: 1,
      items: [
        { productIndex: 7, quantity: 3 },
        { productIndex: 8, quantity: 3 },
        { productIndex: 9, quantity: 3 },
      ],
    },
    {
      id: 'INV-2024-003',
      date: new Date('2024-02-20'),
      recipientIndex: 2,
      items: [
        { productIndex: 4, quantity: 50 },
        { productIndex: 5, quantity: 30 },
      ],
    },
    {
      id: 'INV-2024-004',
      date: new Date('2024-03-10'),
      recipientIndex: 3,
      items: [
        { productIndex: 6, quantity: 500 },
        { productIndex: 3, quantity: 100 },
      ],
    },
    {
      id: 'INV-2024-005',
      date: new Date('2024-03-25'),
      recipientIndex: 4,
      items: [
        { productIndex: 0, quantity: 1 },
        { productIndex: 8, quantity: 1 },
        { productIndex: 9, quantity: 1 },
      ],
    },
    {
      id: 'INV-2024-006',
      date: new Date('2024-04-05'),
      recipientIndex: 5,
      items: [{ productIndex: 1, quantity: 2 }],
    },
    {
      id: 'INV-2024-007',
      date: new Date('2024-04-18'),
      recipientIndex: 0,
      items: [
        { productIndex: 3, quantity: 500 },
        { productIndex: 2, quantity: 50 },
        { productIndex: 8, quantity: 20 },
      ],
    },
    {
      id: 'INV-2024-008',
      date: new Date('2024-05-02'),
      recipientIndex: 6,
      items: [
        { productIndex: 7, quantity: 1 },
        { productIndex: 0, quantity: 1 },
      ],
    },
  ];

  // Create and add invoices
  invoiceData.forEach((invData) => {
    const items = invData.items.map((itemData) => {
      const product = products[itemData.productIndex];
      return repo.createInvoiceItem(
        product.name,
        itemData.quantity,
        product.unit,
        product.price
      );
    });

    const invoice = repo.createInvoice(
      invData.id,
      invData.date,
      recipients[invData.recipientIndex],
      items
    );

    repo.addInvoice(invoice);
  });

  return repo;
}

export default generateSampleData;
