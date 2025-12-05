/**
 * Invoice Types Module
 * Contains all data types for the invoice-repo package
 */

/**
 * Represents the company that issues invoices
 * All properties are mandatory
 */
export interface IssuerCompany {
  /** Company name */
  name: string;
  /** Company ID */
  id: string;
  /** Tax identification number (e.g., BG200776618) */
  taxId: string;
  /** Company address */
  address: string;
  /** Manager name */
  manager: string;
  /** Bank account IBAN */
  iban: string;
}

/**
 * Represents a company that receives invoices
 * Only name is mandatory
 */
export interface RecipientCompany {
  /** Company name (mandatory) */
  name: string;
  /** Company ID (optional) */
  id?: string;
  /** Tax identification number (optional) */
  taxId?: string;
  /** Company address (optional) */
  address?: string;
  /** Manager name (optional) */
  manager?: string;
}

/**
 * Represents an individual that receives invoices
 */
export interface RecipientIndividual {
  /** Individual's name */
  name: string;
  /** National ID number (optional) */
  nationalIdNumber?: string;
}

/**
 * Recipient can be either a company or an individual
 */
export type Recipient = 
  | { type: 'company'; data: RecipientCompany }
  | { type: 'individual'; data: RecipientIndividual };

/**
 * Available units for products
 */
export type ProductUnit = 'pcs' | 'kg' | 'liters' | 'meters';

/**
 * Represents a single item on an invoice
 */
export interface InvoiceItem {
  /** Product name or description */
  product: string;
  /** Quantity of the product */
  quantity: number;
  /** Unit of measurement */
  unit: ProductUnit;
  /** Price per unit (without VAT) */
  price: number;
  /** VAT rate as a decimal (e.g., 0.20 for 20%) */
  vatRate: number;
  /** Total value without VAT (quantity * price) */
  value: number;
}

/**
 * Represents a complete invoice
 */
export interface Invoice {
  /** Unique invoice identifier */
  id: string;
  /** Invoice date */
  date: Date;
  /** Company issuing the invoice */
  issuer: IssuerCompany;
  /** Recipient of the invoice */
  recipient: Recipient;
  /** List of invoice items */
  items: InvoiceItem[];
  /** Subtotal amount (sum of all items without VAT) */
  subtotalAmount: number;
  /** Total VAT amount */
  vatAmount: number;
  /** Total amount including VAT */
  totalAmount: number;
}

/**
 * Settings shared across all invoices in the repository
 */
export interface InvoiceRepoSettings {
  /** Default VAT rate as a decimal (e.g., 0.20 for 20%) */
  defaultVatRate: number;
  /** Default issuer company for all invoices */
  invoiceIssuer: IssuerCompany;
}
