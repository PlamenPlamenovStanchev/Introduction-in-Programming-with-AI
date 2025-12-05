/**
 * Global Data Repository for the Web App
 * Shared between all app pages
 */

import InvoiceRepo, { generateSampleData } from 'invoice-repo';

// Global app data repository instance
let appRepo: InvoiceRepo | null = null;

/**
 * Initialize the app data repository with sample data
 */
export function initAppData(): InvoiceRepo {
  if (!appRepo) {
    appRepo = generateSampleData();
    console.log('App data initialized with sample data');
    console.log(`- ${appRepo.recipients.length} recipients loaded`);
    console.log(`- ${appRepo.invoices.length} invoices loaded`);
  }
  return appRepo;
}

/**
 * Get the app data repository
 * Throws error if not initialized
 */
export function getAppData(): InvoiceRepo {
  if (!appRepo) {
    throw new Error('App data not initialized. Call initAppData() first.');
  }
  return appRepo;
}

/**
 * Reset the app data with fresh sample data
 */
export function resetAppData(): InvoiceRepo {
  appRepo = generateSampleData();
  console.log('App data reset with sample data');
  return appRepo;
}

// Export types for convenience
export type { 
  Invoice, 
  InvoiceItem, 
  IssuerCompany, 
  Recipient, 
  RecipientCompany, 
  RecipientIndividual,
  ProductUnit,
  InvoiceRepoSettings 
} from 'invoice-repo';

export { InvoiceRepo };
