/**
 * Clients List Page
 * Route: /clients
 */

import { getAppData, Recipient } from '../data';

/**
 * Get client ID based on type
 */
function getClientId(recipient: Recipient): string {
  if (recipient.type === 'company') {
    return recipient.data.id || 'N/A';
  } else {
    return recipient.data.nationalIdNumber || 'N/A';
  }
}

/**
 * Get client type label
 */
function getClientType(recipient: Recipient): string {
  return recipient.type === 'company' ? 'Company' : 'Individual';
}

/**
 * Get additional info based on type
 */
function getClientInfo(recipient: Recipient): string {
  if (recipient.type === 'company') {
    return recipient.data.taxId || '-';
  } else {
    return '-';
  }
}

/**
 * Get client address
 */
function getClientAddress(recipient: Recipient): string {
  if (recipient.type === 'company') {
    return recipient.data.address || '-';
  }
  return '-';
}

/**
 * Generate table row for a client
 */
function renderClientRow(recipient: Recipient): string {
  const clientId = getClientId(recipient);
  const hasId = clientId !== 'N/A';
  const clientName = recipient.data.name;
  
  return `
    <tr>
      <td><span class="badge badge-${recipient.type}">${getClientType(recipient)}</span></td>
      <td>${clientName}</td>
      <td>${clientId}</td>
      <td>${getClientInfo(recipient)}</td>
      <td class="address-cell">${getClientAddress(recipient)}</td>
      <td class="actions">
        ${hasId ? `<a href="/clients/${clientId}/view" class="btn btn-view" data-navigo>View</a>` : '<button class="btn btn-view" disabled>View</button>'}
        ${hasId ? `<a href="/clients/${clientId}/edit" class="btn btn-edit" data-navigo>Edit</a>` : '<button class="btn btn-edit" disabled>Edit</button>'}
        <button class="btn btn-delete" data-client-id="${clientId}" data-client-name="${clientName}" ${!hasId ? 'disabled' : ''}>Delete</button>
      </td>
    </tr>
  `;
}

export function ClientsPage(): string {
  const repo = getAppData();
  const recipients = repo.recipients;

  // Separate companies and individuals for counting
  const companies = recipients.filter(r => r.type === 'company');
  const individuals = recipients.filter(r => r.type === 'individual');

  const tableRows = recipients.length > 0
    ? recipients.map(renderClientRow).join('')
    : '<tr><td colspan="6" class="text-center">No clients found</td></tr>';

  return `
    <div class="page">
      <div class="page-header">
        <h1>Clients</h1>
        <div class="page-actions">
          <a href="/clients/new/edit" class="btn btn-save" data-navigo>+ Add Client</a>
        </div>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>ID</th>
              <th>Tax ID / Info</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
      <p class="summary">
        Total: ${recipients.length} client(s) 
        (${companies.length} companies, ${individuals.length} individuals)
      </p>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="delete-modal" class="modal" style="display: none;">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>Confirm Delete</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete client <strong id="delete-client-name"></strong>?</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-delete" id="confirm-delete">Delete</button>
          <button type="button" class="btn btn-secondary" id="cancel-delete">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize event handlers for the clients page
 */
export function initClientsPageEvents(): void {
  const modal = document.getElementById('delete-modal');
  const modalOverlay = modal?.querySelector('.modal-overlay');
  const clientNameSpan = document.getElementById('delete-client-name');
  const confirmBtn = document.getElementById('confirm-delete');
  const cancelBtn = document.getElementById('cancel-delete');
  
  let clientIdToDelete: string | null = null;
  let clientNameToDelete: string | null = null;

  // Show modal function
  function showModal(clientId: string, clientName: string) {
    clientIdToDelete = clientId;
    clientNameToDelete = clientName;
    if (clientNameSpan) clientNameSpan.textContent = clientName;
    if (modal) modal.style.display = 'flex';
  }

  // Hide modal function
  function hideModal() {
    clientIdToDelete = null;
    clientNameToDelete = null;
    if (modal) modal.style.display = 'none';
  }

  // Delete button click handlers
  document.querySelectorAll('.btn-delete[data-client-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const clientId = target.getAttribute('data-client-id');
      const clientName = target.getAttribute('data-client-name') || clientId;
      if (clientId && clientId !== 'N/A') {
        showModal(clientId, clientName || clientId);
      }
    });
  });

  // Confirm delete handler
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (clientIdToDelete) {
        const repo = getAppData();
        const deleted = repo.deleteRecipient(clientIdToDelete);
        if (deleted) {
          console.log(`Client deleted: ${clientNameToDelete} (${clientIdToDelete})`);
          hideModal();
          // Re-render the page
          const content = document.getElementById('content');
          if (content) {
            content.innerHTML = ClientsPage();
            initClientsPageEvents();
          }
        }
      }
    });
  }

  // Cancel delete handler
  if (cancelBtn) {
    cancelBtn.addEventListener('click', hideModal);
  }

  // Close modal on overlay click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', hideModal);
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.style.display === 'flex') {
      hideModal();
    }
  });
}
