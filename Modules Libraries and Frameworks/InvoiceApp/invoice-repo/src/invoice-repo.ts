/**
 * Invoice Repository Module
 * Contains the InvoiceRepo class for managing invoices and recipients
 */

import {
  Invoice,
  InvoiceItem,
  InvoiceRepoSettings,
  IssuerCompany,
  ProductUnit,
  Recipient,
  RecipientCompany,
  RecipientIndividual,
} from './invoice-types.js';

/**
 * InvoiceRepo class - manages invoices and recipients
 * Holds settings, recipients list, and invoices list
 */
class InvoiceRepo {
  private _settings: InvoiceRepoSettings;
  private _recipients: Recipient[] = [];
  private _invoices: Invoice[] = [];

  /**
   * Creates a new InvoiceRepo instance
   * @param settings - Repository settings including default VAT rate and issuer
   */
  constructor(settings: InvoiceRepoSettings) {
    this._settings = settings;
  }

  // ==================== Settings ====================

  /**
   * Gets the repository settings
   */
  get settings(): InvoiceRepoSettings {
    return this._settings;
  }

  /**
   * Sets the repository settings
   */
  set settings(value: InvoiceRepoSettings) {
    this._settings = value;
  }

  /**
   * Gets the default VAT rate
   */
  get defaultVatRate(): number {
    return this._settings.defaultVatRate;
  }

  /**
   * Sets the default VAT rate
   */
  set defaultVatRate(rate: number) {
    this._settings.defaultVatRate = rate;
  }

  /**
   * Gets the invoice issuer
   */
  get invoiceIssuer(): IssuerCompany {
    return this._settings.invoiceIssuer;
  }

  /**
   * Sets the invoice issuer
   */
  set invoiceIssuer(issuer: IssuerCompany) {
    this._settings.invoiceIssuer = issuer;
  }

  // ==================== Recipients ====================

  /**
   * Gets all recipients
   */
  get recipients(): Recipient[] {
    return [...this._recipients];
  }

  /**
   * Finds a recipient by ID
   * @param id - The recipient ID to search for
   * @returns The recipient if found, undefined otherwise
   */
  findRecipientById(id: string): Recipient | undefined {
    return this._recipients.find((r) => {
      if (r.type === 'company') {
        return r.data.id === id;
      } else {
        return r.data.nationalIdNumber === id;
      }
    });
  }

  /**
   * Finds recipients by name (partial match, case-insensitive)
   * @param name - The name to search for
   * @returns Array of matching recipients
   */
  findRecipientByName(name: string): Recipient[] {
    const searchName = name.toLowerCase();
    return this._recipients.filter((r) =>
      r.data.name.toLowerCase().includes(searchName)
    );
  }

  /**
   * Adds a recipient to the repository
   * @param recipient - The recipient to add
   */
  addRecipient(recipient: Recipient): void {
    this._recipients.push(recipient);
  }

  /**
   * Deletes a recipient by ID
   * @param id - The recipient ID to delete
   * @returns true if deleted, false if not found
   */
  deleteRecipient(id: string): boolean {
    const index = this._recipients.findIndex((r) => {
      if (r.type === 'company') {
        return r.data.id === id;
      } else {
        return r.data.nationalIdNumber === id;
      }
    });

    if (index !== -1) {
      this._recipients.splice(index, 1);
      return true;
    }
    return false;
  }

  // ==================== Invoices ====================

  /**
   * Gets all invoices
   */
  get invoices(): Invoice[] {
    return [...this._invoices];
  }

  /**
   * Finds an invoice by ID
   * @param id - The invoice ID to search for
   * @returns The invoice if found, undefined otherwise
   */
  findInvoiceById(id: string): Invoice | undefined {
    return this._invoices.find((inv) => inv.id === id);
  }

  /**
   * Adds an invoice to the repository
   * @param invoice - The invoice to add
   */
  addInvoice(invoice: Invoice): void {
    this._invoices.push(invoice);
  }

  /**
   * Deletes an invoice by ID
   * @param id - The invoice ID to delete
   * @returns true if deleted, false if not found
   */
  deleteInvoice(id: string): boolean {
    const index = this._invoices.findIndex((inv) => inv.id === id);
    if (index !== -1) {
      this._invoices.splice(index, 1);
      return true;
    }
    return false;
  }

  // ==================== Helper Methods ====================

  /**
   * Creates a new invoice item with calculated value
   * @param product - Product name
   * @param quantity - Quantity
   * @param unit - Unit of measurement
   * @param price - Price per unit
   * @param vatRate - VAT rate (defaults to repository default)
   * @returns A new InvoiceItem
   */
  createInvoiceItem(
    product: string,
    quantity: number,
    unit: ProductUnit,
    price: number,
    vatRate?: number
  ): InvoiceItem {
    const rate = vatRate ?? this._settings.defaultVatRate;
    return {
      product,
      quantity,
      unit,
      price,
      vatRate: rate,
      value: quantity * price,
    };
  }

  /**
   * Creates a new invoice with calculated totals
   * @param id - Invoice ID
   * @param date - Invoice date
   * @param recipient - Invoice recipient
   * @param items - Invoice items
   * @returns A new Invoice
   */
  createInvoice(
    id: string,
    date: Date,
    recipient: Recipient,
    items: InvoiceItem[]
  ): Invoice {
    const subtotalAmount = items.reduce((sum, item) => sum + item.value, 0);
    const vatAmount = items.reduce(
      (sum, item) => sum + item.value * item.vatRate,
      0
    );
    const totalAmount = subtotalAmount + vatAmount;

    return {
      id,
      date,
      issuer: this._settings.invoiceIssuer,
      recipient,
      items,
      subtotalAmount,
      vatAmount,
      totalAmount,
    };
  }

  /**
   * Creates a company recipient
   * @param data - Company data
   * @returns A Recipient of type 'company'
   */
  static createCompanyRecipient(data: RecipientCompany): Recipient {
    return { type: 'company', data };
  }

  /**
   * Creates an individual recipient
   * @param data - Individual data
   * @returns A Recipient of type 'individual'
   */
  static createIndividualRecipient(data: RecipientIndividual): Recipient {
    return { type: 'individual', data };
  }
}

export default InvoiceRepo;
