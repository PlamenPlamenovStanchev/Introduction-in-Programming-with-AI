# Invoices-App

A JavaScript monorepo for managing invoices, consisting of several sub-components.

## Project Structure

```
InvoiceApp/
├── package.json           # Root package.json with workspaces configuration
├── invoice-repo/          # Library for invoice data types and logic
├── invoice-console-app/   # Console application for invoice management
└── invoice-web-app/       # Web application for invoice management
```

## Sub-Components

### invoice-repo
A library that holds invoice data types and logic to manage invoices.

### invoice-console-app
A simple console application that demonstrates how to create and edit invoices.

### invoice-web-app
A web application for managing invoices.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. This will install dependencies for all workspaces.

## License

ISC
