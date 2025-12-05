/**
 * Invoice Repository Package
 * Main entry point - exports all types, classes, and functions
 */

// Export all types
export * from './invoice-types.js';

// Export InvoiceRepo class as default and named
export { default as InvoiceRepo } from './invoice-repo.js';
export { default } from './invoice-repo.js';

// Export generateSampleData function
export { default as generateSampleData } from './invoice-repo-sample-data.js';
