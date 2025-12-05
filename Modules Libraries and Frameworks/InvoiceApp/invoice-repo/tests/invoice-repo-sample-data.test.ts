/**
 * Tests for generateSampleData function
 */

import generateSampleData from '../src/invoice-repo-sample-data.js';
import InvoiceRepo from '../src/invoice-repo.js';

describe('generateSampleData', () => {
  let repo: InvoiceRepo;

  beforeEach(() => {
    repo = generateSampleData();
  });

  describe('Repository Instance', () => {
    test('should return an InvoiceRepo instance', () => {
      expect(repo).toBeInstanceOf(InvoiceRepo);
    });
  });

  describe('Settings', () => {
    test('should have default VAT rate of 20%', () => {
      expect(repo.defaultVatRate).toBe(0.2);
    });

    test('should have a valid invoice issuer', () => {
      const issuer = repo.invoiceIssuer;

      expect(issuer.name).toBeDefined();
      expect(issuer.name.length).toBeGreaterThan(0);
      expect(issuer.id).toBeDefined();
      expect(issuer.taxId).toBeDefined();
      expect(issuer.address).toBeDefined();
      expect(issuer.manager).toBeDefined();
      expect(issuer.iban).toBeDefined();
    });

    test('should have tax ID in correct format (country code + company ID)', () => {
      const issuer = repo.invoiceIssuer;
      expect(issuer.taxId).toMatch(/^[A-Z]{2}\d+$/);
      expect(issuer.taxId).toContain(issuer.id);
    });
  });

  describe('Recipients', () => {
    test('should have between 5 and 10 recipients', () => {
      const recipientCount = repo.recipients.length;
      expect(recipientCount).toBeGreaterThanOrEqual(5);
      expect(recipientCount).toBeLessThanOrEqual(10);
    });

    test('should have both company and individual recipients', () => {
      const companies = repo.recipients.filter((r) => r.type === 'company');
      const individuals = repo.recipients.filter((r) => r.type === 'individual');

      expect(companies.length).toBeGreaterThan(0);
      expect(individuals.length).toBeGreaterThan(0);
    });

    test('should have valid company recipients with required fields', () => {
      const companies = repo.recipients.filter((r) => r.type === 'company');

      companies.forEach((recipient) => {
        if (recipient.type === 'company') {
          expect(recipient.data.name).toBeDefined();
          expect(recipient.data.name.length).toBeGreaterThan(0);
        }
      });
    });

    test('should have company recipients with tax IDs in correct format', () => {
      const companies = repo.recipients.filter((r) => r.type === 'company');

      companies.forEach((recipient) => {
        if (recipient.type === 'company' && recipient.data.taxId) {
          expect(recipient.data.taxId).toMatch(/^[A-Z]{2}\d+$/);
          if (recipient.data.id) {
            expect(recipient.data.taxId).toContain(recipient.data.id);
          }
        }
      });
    });

    test('should have valid individual recipients with required name', () => {
      const individuals = repo.recipients.filter((r) => r.type === 'individual');

      individuals.forEach((recipient) => {
        expect(recipient.data.name).toBeDefined();
        expect(recipient.data.name.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Invoices', () => {
    test('should have between 5 and 10 invoices', () => {
      const invoiceCount = repo.invoices.length;
      expect(invoiceCount).toBeGreaterThanOrEqual(5);
      expect(invoiceCount).toBeLessThanOrEqual(10);
    });

    test('should have unique invoice IDs', () => {
      const ids = repo.invoices.map((inv) => inv.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('should have invoices with valid dates', () => {
      repo.invoices.forEach((invoice) => {
        expect(invoice.date).toBeInstanceOf(Date);
        expect(invoice.date.getTime()).not.toBeNaN();
      });
    });

    test('should have invoices with correct issuer', () => {
      const expectedIssuer = repo.invoiceIssuer;

      repo.invoices.forEach((invoice) => {
        expect(invoice.issuer).toEqual(expectedIssuer);
      });
    });

    test('should have invoices with at least one item', () => {
      repo.invoices.forEach((invoice) => {
        expect(invoice.items.length).toBeGreaterThan(0);
      });
    });

    test('should have invoice items with valid units', () => {
      const validUnits = ['pcs', 'kg', 'liters', 'meters'];

      repo.invoices.forEach((invoice) => {
        invoice.items.forEach((item) => {
          expect(validUnits).toContain(item.unit);
        });
      });
    });

    test('should have correct subtotal calculations', () => {
      repo.invoices.forEach((invoice) => {
        const expectedSubtotal = invoice.items.reduce(
          (sum, item) => sum + item.value,
          0
        );
        expect(invoice.subtotalAmount).toBeCloseTo(expectedSubtotal, 2);
      });
    });

    test('should have correct VAT calculations', () => {
      repo.invoices.forEach((invoice) => {
        const expectedVat = invoice.items.reduce(
          (sum, item) => sum + item.value * item.vatRate,
          0
        );
        expect(invoice.vatAmount).toBeCloseTo(expectedVat, 2);
      });
    });

    test('should have correct total calculations', () => {
      repo.invoices.forEach((invoice) => {
        const expectedTotal = invoice.subtotalAmount + invoice.vatAmount;
        expect(invoice.totalAmount).toBeCloseTo(expectedTotal, 2);
      });
    });

    test('should have invoice items with correct value calculations', () => {
      repo.invoices.forEach((invoice) => {
        invoice.items.forEach((item) => {
          const expectedValue = item.quantity * item.price;
          expect(item.value).toBeCloseTo(expectedValue, 2);
        });
      });
    });

    test('should have items with 20% VAT rate by default', () => {
      repo.invoices.forEach((invoice) => {
        invoice.items.forEach((item) => {
          expect(item.vatRate).toBe(0.2);
        });
      });
    });
  });

  describe('Data Consistency', () => {
    test('should have invoice recipients that exist in recipients list or are valid', () => {
      repo.invoices.forEach((invoice) => {
        expect(invoice.recipient).toBeDefined();
        expect(invoice.recipient.type).toMatch(/^(company|individual)$/);
        expect(invoice.recipient.data.name).toBeDefined();
      });
    });

    test('should generate consistent data on multiple calls', () => {
      const repo1 = generateSampleData();
      const repo2 = generateSampleData();

      // Both should have same structure
      expect(repo1.recipients.length).toBe(repo2.recipients.length);
      expect(repo1.invoices.length).toBe(repo2.invoices.length);
      expect(repo1.defaultVatRate).toBe(repo2.defaultVatRate);
    });
  });
});
