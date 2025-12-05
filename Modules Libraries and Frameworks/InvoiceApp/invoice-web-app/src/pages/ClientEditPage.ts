/**
 * Client Edit Page
 * Route: /clients/:id/edit (edit existing) or /clients/new (add new)
 */

import { getAppData, Recipient, RecipientCompany, RecipientIndividual } from '../data';

/**
 * Find a recipient by ID (company ID or national ID)
 */
function findRecipientById(id: string): Recipient | undefined {
  const repo = getAppData();
  const recipients = repo.recipients;
  
  return recipients.find((r: Recipient) => {
    if (r.type === 'company') {
      return r.data.id === id || r.data.name === id;
    } else {
      return r.data.nationalIdNumber === id || r.data.name === id;
    }
  });
}

/**
 * Render company form fields
 */
function renderCompanyFields(data?: RecipientCompany): string {
  return `
    <div class="form-group">
      <label for="client-name">Company Name *</label>
      <input type="text" id="client-name" name="name" value="${data?.name || ''}" required>
    </div>
    <div class="form-group">
      <label for="client-id">Company ID</label>
      <input type="text" id="client-id" name="id" value="${data?.id || ''}" placeholder="e.g., 123456789">
    </div>
    <div class="form-group">
      <label for="client-taxId">Tax ID (VAT Number)</label>
      <input type="text" id="client-taxId" name="taxId" value="${data?.taxId || ''}" placeholder="e.g., BG123456789">
    </div>
    <div class="form-group full-width">
      <label for="client-address">Address</label>
      <input type="text" id="client-address" name="address" value="${data?.address || ''}" placeholder="Full business address">
    </div>
    <div class="form-group">
      <label for="client-manager">Manager / Representative</label>
      <input type="text" id="client-manager" name="manager" value="${data?.manager || ''}" placeholder="Contact person">
    </div>
  `;
}

/**
 * Render individual form fields
 */
function renderIndividualFields(data?: RecipientIndividual): string {
  return `
    <div class="form-group">
      <label for="client-name">Full Name *</label>
      <input type="text" id="client-name" name="name" value="${data?.name || ''}" required>
    </div>
    <div class="form-group">
      <label for="client-nationalId">National ID Number</label>
      <input type="text" id="client-nationalId" name="nationalIdNumber" value="${data?.nationalIdNumber || ''}" placeholder="e.g., 8501011234">
    </div>
  `;
}

/**
 * Check if we're in "add new" mode
 */
function isNewMode(id: string): boolean {
  return id === 'new';
}

export function ClientEditPage(id: string): string {
  const isNew = isNewMode(id);
  const decodedId = decodeURIComponent(id);
  
  // For edit mode, find the existing client
  let recipient: Recipient | undefined;
  let clientType: 'company' | 'individual' = 'company'; // Default for new
  
  if (!isNew) {
    recipient = findRecipientById(decodedId);
    if (!recipient) {
      return `
        <div class="page">
          <h1>Client Not Found</h1>
          <p>Client with ID <strong>${decodedId}</strong> was not found.</p>
          <a href="/clients" class="btn btn-view" data-navigo>Back to Clients</a>
        </div>
      `;
    }
    clientType = recipient.type;
  }

  const pageTitle = isNew ? 'Add New Client' : `Edit Client: ${recipient?.data.name}`;
  const submitLabel = isNew ? 'Add Client' : 'Save Changes';

  // Get form fields based on type
  const companyFields = renderCompanyFields(
    clientType === 'company' && recipient ? recipient.data as RecipientCompany : undefined
  );
  const individualFields = renderIndividualFields(
    clientType === 'individual' && recipient ? recipient.data as RecipientIndividual : undefined
  );

  return `
    <div class="page">
      <div class="page-header">
        <h1>${pageTitle}</h1>
        <div class="page-actions">
          <button type="submit" form="client-form" class="btn btn-save">${submitLabel}</button>
          <a href="/clients" class="btn btn-secondary" data-navigo>Cancel</a>
        </div>
      </div>

      <form id="client-form" class="client-form">
        <input type="hidden" id="original-id" value="${isNew ? '' : decodedId}">
        <input type="hidden" id="is-new" value="${isNew}">
        
        <div class="info-section">
          <h3>Client Type</h3>
          <div class="form-group">
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" name="clientType" value="company" ${clientType === 'company' ? 'checked' : ''}>
                <span class="radio-text">Company</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="clientType" value="individual" ${clientType === 'individual' ? 'checked' : ''}>
                <span class="radio-text">Individual</span>
              </label>
            </div>
          </div>
        </div>

        <div class="info-section" id="company-fields" style="display: ${clientType === 'company' ? 'block' : 'none'}">
          <h3>Company Information</h3>
          <div class="form-grid">
            ${companyFields}
          </div>
        </div>

        <div class="info-section" id="individual-fields" style="display: ${clientType === 'individual' ? 'block' : 'none'}">
          <h3>Personal Information</h3>
          <div class="form-grid">
            ${individualFields}
          </div>
        </div>
      </form>
    </div>
  `;
}

/**
 * Initialize event handlers for the client edit page
 */
export function initClientEditPageEvents(): void {
  // Handle client type switching
  const radioButtons = document.querySelectorAll('input[name="clientType"]');
  const companyFields = document.getElementById('company-fields');
  const individualFields = document.getElementById('individual-fields');

  radioButtons.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.value === 'company') {
        if (companyFields) companyFields.style.display = 'block';
        if (individualFields) individualFields.style.display = 'none';
      } else {
        if (companyFields) companyFields.style.display = 'none';
        if (individualFields) individualFields.style.display = 'block';
      }
    });
  });

  // Handle form submission via button click (more reliable than form submit with external button)
  const submitBtn = document.querySelector('button[type="submit"][form="client-form"]');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const isNew = (document.getElementById('is-new') as HTMLInputElement).value === 'true';
      const originalId = (document.getElementById('original-id') as HTMLInputElement).value;
      const clientType = (document.querySelector('input[name="clientType"]:checked') as HTMLInputElement)?.value;

      const repo = getAppData();
      let newRecipient: Recipient;

      if (clientType === 'company') {
        const name = (document.querySelector('#company-fields #client-name') as HTMLInputElement)?.value.trim();
        const id = (document.querySelector('#company-fields #client-id') as HTMLInputElement)?.value.trim();
        const taxId = (document.querySelector('#company-fields #client-taxId') as HTMLInputElement)?.value.trim();
        const address = (document.querySelector('#company-fields #client-address') as HTMLInputElement)?.value.trim();
        const manager = (document.querySelector('#company-fields #client-manager') as HTMLInputElement)?.value.trim();

        if (!name) {
          alert('Company name is required!');
          return;
        }

        newRecipient = {
          type: 'company',
          data: {
            name,
            ...(id && { id }),
            ...(taxId && { taxId }),
            ...(address && { address }),
            ...(manager && { manager })
          }
        };
      } else {
        const name = (document.querySelector('#individual-fields #client-name') as HTMLInputElement)?.value.trim();
        const nationalIdNumber = (document.querySelector('#individual-fields #client-nationalId') as HTMLInputElement)?.value.trim();

        if (!name) {
          alert('Full name is required!');
          return;
        }

        newRecipient = {
          type: 'individual',
          data: {
            name,
            ...(nationalIdNumber && { nationalIdNumber })
          }
        };
      }

      // If editing, delete the old recipient first
      if (!isNew && originalId) {
        repo.deleteRecipient(originalId);
      }

      // Add the new/updated recipient
      repo.addRecipient(newRecipient);

      console.log(isNew ? 'Client added:' : 'Client updated:', newRecipient);

      // Navigate back to clients list
      alert(isNew ? 'Client added successfully!' : 'Client updated successfully!');
      window.location.hash = '/clients';
    });
  }
}
