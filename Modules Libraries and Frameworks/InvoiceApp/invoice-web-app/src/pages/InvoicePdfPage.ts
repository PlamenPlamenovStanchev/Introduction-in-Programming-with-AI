/**
 * Invoice PDF Page
 * Route: /invoices/:id/pdf
 * Generates and displays a PDF preview of the invoice
 */

import { jsPDF } from 'jspdf';
import { getAppData, Invoice, InvoiceItem } from '../data';

// Store the generated PDF for download
let currentPdf: jsPDF | null = null;
let currentInvoiceId: string = '';

/**
 * Format date as DD/MM/YYYY
 */
function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format currency with 2 decimal places
 */
function formatCurrency(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Format VAT rate as percentage
 */
function formatVatPercent(rate: number): string {
  return (rate * 100).toFixed(0) + '%';
}

/**
 * Generate PDF document for an invoice
 */
function generateInvoicePdf(invoice: Invoice): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper function to add text
  const addText = (text: string, x: number, yPos: number, options?: { fontSize?: number; fontStyle?: string; align?: 'left' | 'center' | 'right' }) => {
    const { fontSize = 10, fontStyle = 'normal', align = 'left' } = options || {};
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    
    let xPos = x;
    if (align === 'center') {
      xPos = pageWidth / 2;
    } else if (align === 'right') {
      xPos = pageWidth - margin;
    }
    
    doc.text(text, xPos, yPos, { align });
  };

  // Helper to draw a line
  const drawLine = (y: number) => {
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
  };

  // ========== HEADER ==========
  addText('INVOICE', margin, y, { fontSize: 24, fontStyle: 'bold' });
  addText(invoice.id, 0, y, { fontSize: 14, fontStyle: 'bold', align: 'right' });
  y += 8;
  addText(`Date: ${formatDate(invoice.date)}`, 0, y, { fontSize: 10, align: 'right' });
  y += 15;

  drawLine(y);
  y += 10;

  // ========== ISSUER (From) ==========
  const issuer = invoice.issuer;
  addText('FROM:', margin, y, { fontSize: 10, fontStyle: 'bold' });
  y += 6;
  addText(issuer.name, margin, y, { fontSize: 12, fontStyle: 'bold' });
  y += 5;
  addText(`ID: ${issuer.id}`, margin, y);
  y += 5;
  addText(`Tax ID: ${issuer.taxId}`, margin, y);
  y += 5;
  addText(issuer.address, margin, y);
  y += 5;
  addText(`Manager: ${issuer.manager}`, margin, y);
  y += 5;
  addText(`IBAN: ${issuer.iban}`, margin, y);
  
  // ========== RECIPIENT (To) ==========
  const recipient = invoice.recipient;
  const recipientStartY = y - 25;
  const recipientX = pageWidth / 2 + 10;
  
  addText('TO:', recipientX, recipientStartY, { fontSize: 10, fontStyle: 'bold' });
  let recipientY = recipientStartY + 6;
  addText(recipient.data.name, recipientX, recipientY, { fontSize: 12, fontStyle: 'bold' });
  recipientY += 5;
  
  if (recipient.type === 'company') {
    const company = recipient.data;
    if (company.id) {
      addText(`ID: ${company.id}`, recipientX, recipientY);
      recipientY += 5;
    }
    if (company.taxId) {
      addText(`Tax ID: ${company.taxId}`, recipientX, recipientY);
      recipientY += 5;
    }
    if (company.address) {
      addText(company.address, recipientX, recipientY);
      recipientY += 5;
    }
    if (company.manager) {
      addText(`Manager: ${company.manager}`, recipientX, recipientY);
    }
  } else {
    const individual = recipient.data;
    if (individual.nationalIdNumber) {
      addText(`National ID: ${individual.nationalIdNumber}`, recipientX, recipientY);
    }
  }

  y += 15;
  drawLine(y);
  y += 10;

  // ========== ITEMS TABLE ==========
  addText('ITEMS', margin, y, { fontSize: 12, fontStyle: 'bold' });
  y += 8;

  // Table header
  const colWidths = {
    num: 10,
    product: 50,
    qty: 18,
    unit: 18,
    price: 22,
    vat: 18,
    subtotal: 22,
    total: 22
  };

  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y - 4, contentWidth, 8, 'F');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  let colX = margin + 2;
  doc.text('#', colX, y);
  colX += colWidths.num;
  doc.text('Product', colX, y);
  colX += colWidths.product;
  doc.text('Qty', colX, y, { align: 'right' });
  colX += colWidths.qty;
  doc.text('Unit', colX, y);
  colX += colWidths.unit;
  doc.text('Price', colX + colWidths.price - 2, y, { align: 'right' });
  colX += colWidths.price;
  doc.text('VAT', colX + colWidths.vat - 2, y, { align: 'right' });
  colX += colWidths.vat;
  doc.text('Subtotal', colX + colWidths.subtotal - 2, y, { align: 'right' });
  colX += colWidths.subtotal;
  doc.text('Total', colX + colWidths.total - 2, y, { align: 'right' });

  y += 8;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  invoice.items.forEach((item: InvoiceItem, index: number) => {
    const vatAmount = item.value * item.vatRate;
    const totalWithVat = item.value + vatAmount;

    colX = margin + 2;
    doc.text(String(index + 1), colX, y);
    colX += colWidths.num;
    
    // Truncate product name if too long
    let productName = item.product;
    if (productName.length > 30) {
      productName = productName.substring(0, 27) + '...';
    }
    doc.text(productName, colX, y);
    colX += colWidths.product;
    
    doc.text(String(item.quantity), colX, y, { align: 'right' });
    colX += colWidths.qty;
    doc.text(item.unit, colX, y);
    colX += colWidths.unit;
    doc.text(formatCurrency(item.price), colX + colWidths.price - 2, y, { align: 'right' });
    colX += colWidths.price;
    doc.text(formatVatPercent(item.vatRate), colX + colWidths.vat - 2, y, { align: 'right' });
    colX += colWidths.vat;
    doc.text(formatCurrency(item.value), colX + colWidths.subtotal - 2, y, { align: 'right' });
    colX += colWidths.subtotal;
    doc.text(formatCurrency(totalWithVat), colX + colWidths.total - 2, y, { align: 'right' });

    y += 6;

    // Add light gray line between rows
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y - 2, pageWidth - margin, y - 2);
  });

  y += 5;
  drawLine(y);
  y += 10;

  // ========== TOTALS ==========
  const totalsX = pageWidth - margin - 60;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX, y);
  doc.text(formatCurrency(invoice.subtotalAmount), pageWidth - margin, y, { align: 'right' });
  y += 6;
  
  doc.text('VAT:', totalsX, y);
  doc.text(formatCurrency(invoice.vatAmount), pageWidth - margin, y, { align: 'right' });
  y += 6;
  
  doc.setDrawColor(100, 108, 255);
  doc.setLineWidth(0.5);
  doc.line(totalsX - 5, y - 2, pageWidth - margin, y - 2);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', totalsX, y + 4);
  doc.text(formatCurrency(invoice.totalAmount), pageWidth - margin, y + 4, { align: 'right' });

  // ========== FOOTER ==========
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 128, 128);
  doc.text('Thank you for your business!', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Generated on ${formatDate(new Date())}`, pageWidth / 2, footerY + 5, { align: 'center' });

  return doc;
}

export function InvoicePdfPage(id: string): string {
  const repo = getAppData();
  const invoice = repo.findInvoiceById(id);

  if (!invoice) {
    return `
      <div class="page">
        <h1>Invoice Not Found</h1>
        <p>Invoice with ID <strong>${id}</strong> was not found.</p>
        <a href="/invoices" class="btn btn-view" data-navigo>Back to Invoices</a>
      </div>
    `;
  }

  // Store for later use
  currentInvoiceId = id;

  return `
    <div class="page">
      <div class="page-header">
        <h1>Invoice PDF: ${id}</h1>
        <div class="page-actions">
          <button type="button" class="btn btn-save" id="download-pdf-btn">Download PDF</button>
          <a href="/invoices/${id}/view" class="btn btn-view" data-navigo>View Invoice</a>
          <a href="/invoices" class="btn btn-secondary" data-navigo>Back to List</a>
        </div>
      </div>

      <div class="pdf-container">
        <div class="pdf-loading" id="pdf-loading">
          <p>Generating PDF...</p>
        </div>
        <iframe id="pdf-preview" class="pdf-preview" style="display: none;"></iframe>
      </div>
    </div>
  `;
}

/**
 * Initialize event handlers for the PDF page
 */
export function initInvoicePdfPageEvents(): void {
  const repo = getAppData();
  const invoice = repo.findInvoiceById(currentInvoiceId);

  if (!invoice) return;

  // Generate PDF
  currentPdf = generateInvoicePdf(invoice);

  // Display PDF in iframe
  const pdfBlob = currentPdf.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);

  const iframe = document.getElementById('pdf-preview') as HTMLIFrameElement;
  const loading = document.getElementById('pdf-loading');

  if (iframe) {
    iframe.src = pdfUrl;
    iframe.style.display = 'block';
  }
  if (loading) {
    loading.style.display = 'none';
  }

  // Download button handler
  const downloadBtn = document.getElementById('download-pdf-btn');
  if (downloadBtn && currentPdf) {
    downloadBtn.addEventListener('click', () => {
      if (currentPdf) {
        currentPdf.save(`invoice-${currentInvoiceId}.pdf`);
      }
    });
  }
}
