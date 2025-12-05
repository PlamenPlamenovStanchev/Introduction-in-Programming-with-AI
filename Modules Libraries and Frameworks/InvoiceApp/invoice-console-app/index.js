/**
 * Invoice Console App
 * Demonstrates how the invoice-repo library works
 */

import InvoiceRepo, { generateSampleData } from 'invoice-repo';

// Helper function to format currency
function formatCurrency(amount) {
  return amount.toFixed(2) + ' BGN';
}

// Helper function to format date
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Helper function to print a separator line
function printSeparator(char = '=', length = 60) {
  console.log(char.repeat(length));
}

// Helper function to print invoice details
function printInvoice(invoice) {
  printSeparator();
  console.log(`INVOICE: ${invoice.id}`);
  console.log(`Date: ${formatDate(invoice.date)}`);
  printSeparator('-');
  
  console.log('ISSUER:');
  console.log(`  ${invoice.issuer.name}`);
  console.log(`  Tax ID: ${invoice.issuer.taxId}`);
  console.log(`  Address: ${invoice.issuer.address}`);
  console.log(`  IBAN: ${invoice.issuer.iban}`);
  
  printSeparator('-');
  console.log('RECIPIENT:');
  if (invoice.recipient.type === 'company') {
    console.log(`  ${invoice.recipient.data.name} (Company)`);
    if (invoice.recipient.data.taxId) {
      console.log(`  Tax ID: ${invoice.recipient.data.taxId}`);
    }
    if (invoice.recipient.data.address) {
      console.log(`  Address: ${invoice.recipient.data.address}`);
    }
  } else {
    console.log(`  ${invoice.recipient.data.name} (Individual)`);
    if (invoice.recipient.data.nationalIdNumber) {
      console.log(`  National ID: ${invoice.recipient.data.nationalIdNumber}`);
    }
  }
  
  printSeparator('-');
  console.log('ITEMS:');
  console.log('  Product                      Qty    Unit     Price      Value');
  console.log('  ' + '-'.repeat(56));
  
  invoice.items.forEach(item => {
    const product = item.product.padEnd(28);
    const qty = item.quantity.toString().padStart(5);
    const unit = item.unit.padEnd(8);
    const price = formatCurrency(item.price).padStart(10);
    const value = formatCurrency(item.value).padStart(12);
    console.log(`  ${product}${qty} ${unit}${price}${value}`);
  });
  
  printSeparator('-');
  console.log(`  Subtotal (without VAT): ${formatCurrency(invoice.subtotalAmount).padStart(20)}`);
  console.log(`  VAT Amount:             ${formatCurrency(invoice.vatAmount).padStart(20)}`);
  console.log(`  TOTAL:                  ${formatCurrency(invoice.totalAmount).padStart(20)}`);
  printSeparator();
}

// Helper function to print recipient summary
function printRecipient(recipient, index) {
  if (recipient.type === 'company') {
    const id = recipient.data.id || 'N/A';
    console.log(`  ${index + 1}. [Company] ${recipient.data.name} (ID: ${id})`);
  } else {
    const id = recipient.data.nationalIdNumber || 'N/A';
    console.log(`  ${index + 1}. [Individual] ${recipient.data.name} (NID: ${id})`);
  }
}

// Main demonstration
console.log('\n');
printSeparator('*');
console.log('       INVOICE REPOSITORY - CONSOLE DEMO');
printSeparator('*');
console.log('\n');

// 1. Start from sample data
console.log('1. LOADING SAMPLE DATA');
printSeparator('-', 40);
const repo = generateSampleData();
console.log(`   ✓ Loaded ${repo.invoices.length} invoices`);
console.log(`   ✓ Loaded ${repo.recipients.length} recipients`);
console.log(`   ✓ Default VAT rate: ${repo.defaultVatRate * 100}%`);
console.log(`   ✓ Issuer: ${repo.invoiceIssuer.name}`);
console.log('\n');

// 2. List all recipients
console.log('2. ALL RECIPIENTS');
printSeparator('-', 40);
repo.recipients.forEach((r, i) => printRecipient(r, i));
console.log('\n');

// 3. List all invoices (summary)
console.log('3. ALL INVOICES (Summary)');
printSeparator('-', 40);
repo.invoices.forEach(inv => {
  const recipientName = inv.recipient.data.name;
  console.log(`   ${inv.id} | ${formatDate(inv.date)} | ${recipientName.padEnd(20)} | ${formatCurrency(inv.totalAmount)}`);
});
console.log('\n');

// 4. Find an invoice by ID
console.log('4. FIND INVOICE BY ID');
printSeparator('-', 40);
const searchId = 'INV-2024-003';
console.log(`   Searching for invoice: ${searchId}`);
const foundInvoice = repo.findInvoiceById(searchId);
if (foundInvoice) {
  console.log(`   ✓ Found invoice for ${foundInvoice.recipient.data.name}`);
  printInvoice(foundInvoice);
} else {
  console.log(`   ✗ Invoice not found`);
}
console.log('\n');

// 5. Find recipients by name
console.log('5. FIND RECIPIENTS BY NAME');
printSeparator('-', 40);
const searchName = 'Global';
console.log(`   Searching for recipients with name containing: "${searchName}"`);
const foundRecipients = repo.findRecipientByName(searchName);
console.log(`   Found ${foundRecipients.length} recipient(s):`);
foundRecipients.forEach((r, i) => printRecipient(r, i));
console.log('\n');

// 6. Add a new invoice
console.log('6. ADD A NEW INVOICE');
printSeparator('-', 40);

// First, add a new recipient
const newRecipient = InvoiceRepo.createCompanyRecipient({
  name: 'New Customer Ltd.',
  id: '999888777',
  taxId: 'BG999888777',
  address: '99 New Street, Sofia, Bulgaria',
  manager: 'New Manager',
});
repo.addRecipient(newRecipient);
console.log(`   ✓ Added new recipient: ${newRecipient.data.name}`);

// Create invoice items
const newItems = [
  repo.createInvoiceItem('Web Development Service', 40, 'pcs', 50),   // 40 hours at 50 BGN/hour
  repo.createInvoiceItem('Domain Registration', 1, 'pcs', 25),
  repo.createInvoiceItem('Hosting (1 year)', 1, 'pcs', 120),
];

// Create the invoice
const newInvoice = repo.createInvoice(
  'INV-2024-009',
  new Date('2024-05-15'),
  newRecipient,
  newItems
);
repo.addInvoice(newInvoice);
console.log(`   ✓ Created new invoice: ${newInvoice.id}`);
console.log(`   Total invoices now: ${repo.invoices.length}`);
printInvoice(newInvoice);
console.log('\n');

// 7. Edit an invoice (simulate by deleting and re-adding)
console.log('7. EDIT AN INVOICE');
printSeparator('-', 40);
const editInvoiceId = 'INV-2024-001';
console.log(`   Editing invoice: ${editInvoiceId}`);

const invoiceToEdit = repo.findInvoiceById(editInvoiceId);
if (invoiceToEdit) {
  // Remove old invoice
  repo.deleteInvoice(editInvoiceId);
  
  // Create updated items (adding one more item)
  const updatedItems = [
    ...invoiceToEdit.items,
    repo.createInvoiceItem('Express Shipping', 1, 'pcs', 50),
  ];
  
  // Create updated invoice with same ID but new items
  const updatedInvoice = repo.createInvoice(
    editInvoiceId,
    invoiceToEdit.date,
    invoiceToEdit.recipient,
    updatedItems
  );
  repo.addInvoice(updatedInvoice);
  
  console.log(`   ✓ Added new item: Express Shipping`);
  console.log(`   ✓ Invoice updated`);
  console.log(`   Previous total: ${formatCurrency(invoiceToEdit.totalAmount)}`);
  console.log(`   New total: ${formatCurrency(updatedInvoice.totalAmount)}`);
  printInvoice(updatedInvoice);
}
console.log('\n');

// 8. Delete an invoice
console.log('8. DELETE AN INVOICE');
printSeparator('-', 40);
const deleteInvoiceId = 'INV-2024-006';
console.log(`   Deleting invoice: ${deleteInvoiceId}`);
console.log(`   Invoices before deletion: ${repo.invoices.length}`);

const deleted = repo.deleteInvoice(deleteInvoiceId);
if (deleted) {
  console.log(`   ✓ Invoice deleted successfully`);
} else {
  console.log(`   ✗ Invoice not found`);
}
console.log(`   Invoices after deletion: ${repo.invoices.length}`);
console.log('\n');

// 9. Verify the deleted invoice is gone
console.log('9. VERIFY DELETION');
printSeparator('-', 40);
const deletedInvoice = repo.findInvoiceById(deleteInvoiceId);
if (deletedInvoice) {
  console.log(`   ✗ Invoice still exists!`);
} else {
  console.log(`   ✓ Invoice ${deleteInvoiceId} no longer exists`);
}
console.log('\n');

// 10. Final summary
console.log('10. FINAL SUMMARY');
printSeparator('-', 40);
console.log(`   Total Recipients: ${repo.recipients.length}`);
console.log(`   Total Invoices: ${repo.invoices.length}`);

const totalRevenue = repo.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
const totalVAT = repo.invoices.reduce((sum, inv) => sum + inv.vatAmount, 0);
console.log(`   Total Revenue: ${formatCurrency(totalRevenue)}`);
console.log(`   Total VAT: ${formatCurrency(totalVAT)}`);
console.log('\n');

console.log('Remaining Invoices:');
repo.invoices.forEach(inv => {
  const recipientName = inv.recipient.data.name;
  console.log(`   ${inv.id} | ${formatDate(inv.date)} | ${recipientName.padEnd(20)} | ${formatCurrency(inv.totalAmount)}`);
});

console.log('\n');
printSeparator('*');
console.log('       DEMO COMPLETED SUCCESSFULLY');
printSeparator('*');
console.log('\n');
