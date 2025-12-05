# invoice-repo

A TypeScript library for managing invoices, including data types and repository functionality.

## Installation

```bash
npm install invoice-repo
```

## Features

- **Type-safe invoice management** - Full TypeScript support with comprehensive type definitions
- **Flexible recipient handling** - Support for both company and individual recipients
- **Automatic calculations** - VAT and totals are calculated automatically
- **Sample data generation** - Built-in function to generate test data

## Usage

### Basic Usage

```typescript
import InvoiceRepo, { IssuerCompany, generateSampleData } from 'invoice-repo';

// Create a new repository with settings
const issuer: IssuerCompany = {
  name: 'My Company Ltd.',
  id: '123456789',
  taxId: 'BG123456789',
  address: '123 Main Street, Sofia, Bulgaria',
  manager: 'John Smith',
  iban: 'BG80BNBG96611020345678',
};

const repo = new InvoiceRepo({
  defaultVatRate: 0.20, // 20% VAT
  invoiceIssuer: issuer,
});
```

### Using Sample Data

```typescript
import generateSampleData from 'invoice-repo/sample-data';

// Generate repository with sample data (8 invoices)
const repo = generateSampleData();

// Access invoices
console.log(`Total invoices: ${repo.invoices.length}`);
```

### Managing Recipients

```typescript
// Add a company recipient
const companyRecipient = InvoiceRepo.createCompanyRecipient({
  name: 'ABC Corporation',
  id: '987654321',
  taxId: 'BG987654321',
  address: '456 Business Ave',
  manager: 'Jane Doe',
});
repo.addRecipient(companyRecipient);

// Add an individual recipient
const individualRecipient = InvoiceRepo.createIndividualRecipient({
  name: 'Peter Johnson',
  nationalIdNumber: '8501154567',
});
repo.addRecipient(individualRecipient);

// Find recipients
const found = repo.findRecipientById('987654321');
const matches = repo.findRecipientByName('ABC');

// Delete recipient
repo.deleteRecipient('987654321');
```

### Creating Invoices

```typescript
// Create invoice items
const items = [
  repo.createInvoiceItem('Laptop', 2, 'pcs', 1500),
  repo.createInvoiceItem('Mouse', 5, 'pcs', 25),
  repo.createInvoiceItem('Cable', 10, 'meters', 3),
];

// Create invoice
const invoice = repo.createInvoice(
  'INV-2024-001',
  new Date(),
  companyRecipient,
  items
);

// Add to repository
repo.addInvoice(invoice);

// Find invoice
const foundInvoice = repo.findInvoiceById('INV-2024-001');

// Delete invoice
repo.deleteInvoice('INV-2024-001');
```

## Data Types

### IssuerCompany

Represents the company that issues invoices. All properties are mandatory.

```typescript
interface IssuerCompany {
  name: string;      // Company name
  id: string;        // Company ID
  taxId: string;     // Tax ID (e.g., BG200776618)
  address: string;   // Company address
  manager: string;   // Manager name
  iban: string;      // Bank account IBAN
}
```

### RecipientCompany

Represents a company that receives invoices. Only `name` is mandatory.

```typescript
interface RecipientCompany {
  name: string;      // Company name (mandatory)
  id?: string;       // Company ID (optional)
  taxId?: string;    // Tax ID (optional)
  address?: string;  // Company address (optional)
  manager?: string;  // Manager name (optional)
}
```

### RecipientIndividual

Represents an individual that receives invoices.

```typescript
interface RecipientIndividual {
  name: string;              // Individual's name
  nationalIdNumber?: string; // National ID (optional)
}
```

### Recipient

A union type that can be either a company or an individual.

```typescript
type Recipient = 
  | { type: 'company'; data: RecipientCompany }
  | { type: 'individual'; data: RecipientIndividual };
```

### ProductUnit

Available units for products.

```typescript
type ProductUnit = 'pcs' | 'kg' | 'liters' | 'meters';
```

### InvoiceItem

Represents a single item on an invoice.

```typescript
interface InvoiceItem {
  product: string;   // Product name
  quantity: number;  // Quantity
  unit: ProductUnit; // Unit of measurement
  price: number;     // Price per unit (without VAT)
  vatRate: number;   // VAT rate (e.g., 0.20 for 20%)
  value: number;     // Total value without VAT
}
```

### Invoice

Represents a complete invoice.

```typescript
interface Invoice {
  id: string;              // Invoice ID
  date: Date;              // Invoice date
  issuer: IssuerCompany;   // Issuing company
  recipient: Recipient;    // Invoice recipient
  items: InvoiceItem[];    // List of items
  subtotalAmount: number;  // Subtotal (without VAT)
  vatAmount: number;       // Total VAT
  totalAmount: number;     // Total (with VAT)
}
```

## Module Structure

The package is split into 3 modules:

| Module | Export | Description |
|--------|--------|-------------|
| `invoice-repo/types` | All types | All TypeScript interfaces and types |
| `invoice-repo/repo` | `InvoiceRepo` (default) | Repository class for managing invoices |
| `invoice-repo/sample-data` | `generateSampleData` (default) | Function to generate test data |

### Importing Specific Modules

```typescript
// Import only types
import type { Invoice, InvoiceItem, Recipient } from 'invoice-repo/types';

// Import only the repository class
import InvoiceRepo from 'invoice-repo/repo';

// Import only sample data generator
import generateSampleData from 'invoice-repo/sample-data';
```

## Building

```bash
npm run build
```

## License

ISC
