/**
 * Tests for InvoiceRepo class
 */

import InvoiceRepo from '../src/invoice-repo.js';
import {
  IssuerCompany,
  Recipient,
  RecipientCompany,
  RecipientIndividual,
  InvoiceItem,
  Invoice,
} from '../src/invoice-types.js';

describe('InvoiceRepo', () => {
  // Test data factory function to avoid mutation issues
  const createTestIssuer = (): IssuerCompany => ({
    name: 'Test Company Ltd.',
    id: '123456789',
    taxId: 'BG123456789',
    address: '123 Test Street, Sofia, Bulgaria',
    manager: 'Test Manager',
    iban: 'BG80BNBG96611020345678',
  });

  const createDefaultSettings = () => ({
    defaultVatRate: 0.2,
    invoiceIssuer: createTestIssuer(),
  });

  let repo: InvoiceRepo;
  let testIssuer: IssuerCompany;

  beforeEach(() => {
    testIssuer = createTestIssuer();
    repo = new InvoiceRepo(createDefaultSettings());
  });

  // ==================== Settings Tests ====================

  describe('Settings', () => {
    test('should initialize with correct settings', () => {
      expect(repo.settings.defaultVatRate).toBe(0.2);
      expect(repo.settings.invoiceIssuer).toEqual(testIssuer);
    });

    test('should get and set default VAT rate', () => {
      expect(repo.defaultVatRate).toBe(0.2);
      repo.defaultVatRate = 0.25;
      expect(repo.defaultVatRate).toBe(0.25);
    });

    test('should get and set invoice issuer', () => {
      const newIssuer: IssuerCompany = {
        ...testIssuer,
        name: 'New Company Ltd.',
      };
      repo.invoiceIssuer = newIssuer;
      expect(repo.invoiceIssuer.name).toBe('New Company Ltd.');
    });

    test('should set entire settings object', () => {
      const newSettings = {
        defaultVatRate: 0.1,
        invoiceIssuer: { ...testIssuer, name: 'Another Company' },
      };
      repo.settings = newSettings;
      expect(repo.defaultVatRate).toBe(0.1);
      expect(repo.invoiceIssuer.name).toBe('Another Company');
    });
  });

  // ==================== Recipients Tests ====================

  describe('Recipients', () => {
    const companyRecipient: Recipient = {
      type: 'company',
      data: {
        name: 'ABC Corporation',
        id: '987654321',
        taxId: 'BG987654321',
        address: '456 Business Ave',
        manager: 'John Doe',
      },
    };

    const individualRecipient: Recipient = {
      type: 'individual',
      data: {
        name: 'Peter Johnson',
        nationalIdNumber: '8501154567',
      },
    };

    test('should start with empty recipients list', () => {
      expect(repo.recipients).toHaveLength(0);
    });

    test('should add a company recipient', () => {
      repo.addRecipient(companyRecipient);
      expect(repo.recipients).toHaveLength(1);
      expect(repo.recipients[0]).toEqual(companyRecipient);
    });

    test('should add an individual recipient', () => {
      repo.addRecipient(individualRecipient);
      expect(repo.recipients).toHaveLength(1);
      expect(repo.recipients[0]).toEqual(individualRecipient);
    });

    test('should add multiple recipients', () => {
      repo.addRecipient(companyRecipient);
      repo.addRecipient(individualRecipient);
      expect(repo.recipients).toHaveLength(2);
    });

    test('should find company recipient by ID', () => {
      repo.addRecipient(companyRecipient);
      repo.addRecipient(individualRecipient);

      const found = repo.findRecipientById('987654321');
      expect(found).toBeDefined();
      expect(found?.type).toBe('company');
      expect(found?.data.name).toBe('ABC Corporation');
    });

    test('should find individual recipient by national ID', () => {
      repo.addRecipient(companyRecipient);
      repo.addRecipient(individualRecipient);

      const found = repo.findRecipientById('8501154567');
      expect(found).toBeDefined();
      expect(found?.type).toBe('individual');
      expect(found?.data.name).toBe('Peter Johnson');
    });

    test('should return undefined for non-existent recipient ID', () => {
      repo.addRecipient(companyRecipient);
      const found = repo.findRecipientById('nonexistent');
      expect(found).toBeUndefined();
    });

    test('should find recipients by name (case-insensitive)', () => {
      repo.addRecipient(companyRecipient);
      repo.addRecipient(individualRecipient);

      const found = repo.findRecipientByName('abc');
      expect(found).toHaveLength(1);
      expect(found[0].data.name).toBe('ABC Corporation');
    });

    test('should find recipients by partial name match', () => {
      repo.addRecipient(companyRecipient);
      repo.addRecipient(individualRecipient);

      const found = repo.findRecipientByName('John');
      expect(found).toHaveLength(1);
      expect(found[0].data.name).toBe('Peter Johnson');
    });

    test('should return empty array for no name matches', () => {
      repo.addRecipient(companyRecipient);
      const found = repo.findRecipientByName('XYZ');
      expect(found).toHaveLength(0);
    });

    test('should delete company recipient by ID', () => {
      repo.addRecipient(companyRecipient);
      repo.addRecipient(individualRecipient);

      const deleted = repo.deleteRecipient('987654321');
      expect(deleted).toBe(true);
      expect(repo.recipients).toHaveLength(1);
      expect(repo.findRecipientById('987654321')).toBeUndefined();
    });

    test('should delete individual recipient by national ID', () => {
      repo.addRecipient(companyRecipient);
      repo.addRecipient(individualRecipient);

      const deleted = repo.deleteRecipient('8501154567');
      expect(deleted).toBe(true);
      expect(repo.recipients).toHaveLength(1);
      expect(repo.findRecipientById('8501154567')).toBeUndefined();
    });

    test('should return false when deleting non-existent recipient', () => {
      repo.addRecipient(companyRecipient);
      const deleted = repo.deleteRecipient('nonexistent');
      expect(deleted).toBe(false);
      expect(repo.recipients).toHaveLength(1);
    });

    test('should return a copy of recipients array', () => {
      repo.addRecipient(companyRecipient);
      const recipients = repo.recipients;
      recipients.push(individualRecipient);
      expect(repo.recipients).toHaveLength(1); // Original should not be affected
    });
  });

  // ==================== Static Factory Methods Tests ====================

  describe('Static Factory Methods', () => {
    test('should create company recipient', () => {
      const companyData: RecipientCompany = {
        name: 'Test Corp',
        id: '111222333',
      };
      const recipient = InvoiceRepo.createCompanyRecipient(companyData);

      expect(recipient.type).toBe('company');
      expect(recipient.data).toEqual(companyData);
    });

    test('should create individual recipient', () => {
      const individualData: RecipientIndividual = {
        name: 'Jane Doe',
        nationalIdNumber: '9001015678',
      };
      const recipient = InvoiceRepo.createIndividualRecipient(individualData);

      expect(recipient.type).toBe('individual');
      expect(recipient.data).toEqual(individualData);
    });

    test('should create company recipient with minimal data', () => {
      const companyData: RecipientCompany = {
        name: 'Minimal Corp',
      };
      const recipient = InvoiceRepo.createCompanyRecipient(companyData);

      expect(recipient.type).toBe('company');
      expect(recipient.data.name).toBe('Minimal Corp');
      if (recipient.type === 'company') {
        expect(recipient.data.id).toBeUndefined();
      }
    });

    test('should create individual recipient without national ID', () => {
      const individualData: RecipientIndividual = {
        name: 'Anonymous Person',
      };
      const recipient = InvoiceRepo.createIndividualRecipient(individualData);

      expect(recipient.type).toBe('individual');
      expect(recipient.data.name).toBe('Anonymous Person');
      if (recipient.type === 'individual') {
        expect(recipient.data.nationalIdNumber).toBeUndefined();
      }
    });
  });

  // ==================== Invoice Items Tests ====================

  describe('Invoice Items', () => {
    test('should create invoice item with default VAT rate', () => {
      const item = repo.createInvoiceItem('Laptop', 2, 'pcs', 1000);

      expect(item.product).toBe('Laptop');
      expect(item.quantity).toBe(2);
      expect(item.unit).toBe('pcs');
      expect(item.price).toBe(1000);
      expect(item.vatRate).toBe(0.2); // default VAT
      expect(item.value).toBe(2000); // 2 * 1000
    });

    test('should create invoice item with custom VAT rate', () => {
      const item = repo.createInvoiceItem('Book', 5, 'pcs', 20, 0.09);

      expect(item.vatRate).toBe(0.09);
      expect(item.value).toBe(100); // 5 * 20
    });

    test('should create invoice item with different units', () => {
      const itemKg = repo.createInvoiceItem('Coffee', 10, 'kg', 25);
      const itemLiters = repo.createInvoiceItem('Milk', 5, 'liters', 3);
      const itemMeters = repo.createInvoiceItem('Cable', 100, 'meters', 2);

      expect(itemKg.unit).toBe('kg');
      expect(itemKg.value).toBe(250);

      expect(itemLiters.unit).toBe('liters');
      expect(itemLiters.value).toBe(15);

      expect(itemMeters.unit).toBe('meters');
      expect(itemMeters.value).toBe(200);
    });

    test('should calculate value correctly for decimal quantities', () => {
      const item = repo.createInvoiceItem('Sugar', 2.5, 'kg', 4);
      expect(item.value).toBe(10); // 2.5 * 4
    });
  });

  // ==================== Invoices Tests ====================

  describe('Invoices', () => {
    const recipient: Recipient = {
      type: 'company',
      data: {
        name: 'Test Customer',
        id: '555666777',
      },
    };

    let testItems: InvoiceItem[];

    beforeEach(() => {
      testItems = [
        repo.createInvoiceItem('Product A', 2, 'pcs', 100),
        repo.createInvoiceItem('Product B', 5, 'kg', 20),
      ];
    });

    test('should start with empty invoices list', () => {
      expect(repo.invoices).toHaveLength(0);
    });

    test('should create invoice with correct calculations', () => {
      const invoice = repo.createInvoice(
        'INV-001',
        new Date('2024-01-15'),
        recipient,
        testItems
      );

      expect(invoice.id).toBe('INV-001');
      expect(invoice.date).toEqual(new Date('2024-01-15'));
      expect(invoice.issuer).toEqual(testIssuer);
      expect(invoice.recipient).toEqual(recipient);
      expect(invoice.items).toHaveLength(2);

      // Subtotal: 200 (2*100) + 100 (5*20) = 300
      expect(invoice.subtotalAmount).toBe(300);

      // VAT: 200*0.2 + 100*0.2 = 40 + 20 = 60
      expect(invoice.vatAmount).toBe(60);

      // Total: 300 + 60 = 360
      expect(invoice.totalAmount).toBe(360);
    });

    test('should add invoice to repository', () => {
      const invoice = repo.createInvoice('INV-001', new Date(), recipient, testItems);
      repo.addInvoice(invoice);

      expect(repo.invoices).toHaveLength(1);
      expect(repo.invoices[0].id).toBe('INV-001');
    });

    test('should add multiple invoices', () => {
      const invoice1 = repo.createInvoice('INV-001', new Date(), recipient, testItems);
      const invoice2 = repo.createInvoice('INV-002', new Date(), recipient, testItems);

      repo.addInvoice(invoice1);
      repo.addInvoice(invoice2);

      expect(repo.invoices).toHaveLength(2);
    });

    test('should find invoice by ID', () => {
      const invoice1 = repo.createInvoice('INV-001', new Date(), recipient, testItems);
      const invoice2 = repo.createInvoice('INV-002', new Date(), recipient, testItems);

      repo.addInvoice(invoice1);
      repo.addInvoice(invoice2);

      const found = repo.findInvoiceById('INV-002');
      expect(found).toBeDefined();
      expect(found?.id).toBe('INV-002');
    });

    test('should return undefined for non-existent invoice ID', () => {
      const invoice = repo.createInvoice('INV-001', new Date(), recipient, testItems);
      repo.addInvoice(invoice);

      const found = repo.findInvoiceById('INV-999');
      expect(found).toBeUndefined();
    });

    test('should delete invoice by ID', () => {
      const invoice1 = repo.createInvoice('INV-001', new Date(), recipient, testItems);
      const invoice2 = repo.createInvoice('INV-002', new Date(), recipient, testItems);

      repo.addInvoice(invoice1);
      repo.addInvoice(invoice2);

      const deleted = repo.deleteInvoice('INV-001');
      expect(deleted).toBe(true);
      expect(repo.invoices).toHaveLength(1);
      expect(repo.findInvoiceById('INV-001')).toBeUndefined();
      expect(repo.findInvoiceById('INV-002')).toBeDefined();
    });

    test('should return false when deleting non-existent invoice', () => {
      const invoice = repo.createInvoice('INV-001', new Date(), recipient, testItems);
      repo.addInvoice(invoice);

      const deleted = repo.deleteInvoice('INV-999');
      expect(deleted).toBe(false);
      expect(repo.invoices).toHaveLength(1);
    });

    test('should return a copy of invoices array', () => {
      const invoice = repo.createInvoice('INV-001', new Date(), recipient, testItems);
      repo.addInvoice(invoice);

      const invoices = repo.invoices;
      const invoice2 = repo.createInvoice('INV-002', new Date(), recipient, testItems);
      invoices.push(invoice2);

      expect(repo.invoices).toHaveLength(1); // Original should not be affected
    });

    test('should handle invoice with empty items array', () => {
      const invoice = repo.createInvoice('INV-EMPTY', new Date(), recipient, []);

      expect(invoice.items).toHaveLength(0);
      expect(invoice.subtotalAmount).toBe(0);
      expect(invoice.vatAmount).toBe(0);
      expect(invoice.totalAmount).toBe(0);
    });

    test('should handle items with different VAT rates', () => {
      const items = [
        repo.createInvoiceItem('Standard VAT', 1, 'pcs', 100, 0.2),
        repo.createInvoiceItem('Reduced VAT', 1, 'pcs', 100, 0.09),
        repo.createInvoiceItem('Zero VAT', 1, 'pcs', 100, 0),
      ];

      const invoice = repo.createInvoice('INV-MIXED', new Date(), recipient, items);

      expect(invoice.subtotalAmount).toBe(300);
      // VAT: 100*0.2 + 100*0.09 + 100*0 = 20 + 9 + 0 = 29
      expect(invoice.vatAmount).toBe(29);
      expect(invoice.totalAmount).toBe(329);
    });
  });
});
