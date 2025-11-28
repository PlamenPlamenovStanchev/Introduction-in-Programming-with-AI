// Company type definition
export interface Company {
    id: string;
    name: string;
    taxId: string;
    address: string;
    manager: string;
    iban: string;
    defaultVatRate?: number; // Default VAT rate in percent (only for company profile)
}

// Currency type (using const object pattern for TypeScript compatibility)
export const Currency = {
    BGN: 'BGN',
    EUR: 'EUR',
    USD: 'USD'
} as const;

export type Currency = typeof Currency[keyof typeof Currency];

// Product type definition
export interface Product {
    id: string;
    name: string;
    price: number;
    currency: Currency;
    unit: string;
}

// Invoice Item type definition
export interface InvoiceItem {
    product: Product;
    quantity: number;
    vatRate: number; // VAT rate as percentage (e.g., 20 for 20%)
    valueWithoutVat: number; // Calculated: product.price * quantity
}

// Invoice type definition
export interface Invoice {
    id: string;
    date: Date;
    issuer: Company;
    recipient: Company;
    items: InvoiceItem[];
    amountSubtotal: number; // Sum of all items' valueWithoutVat
    vat: number; // Total VAT amount
    totalAmount: number; // amountSubtotal + vat
    paid?: boolean; // Whether the invoice has been paid
}
