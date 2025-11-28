import './style.css';

// Import all tab modules
import * as myCompany from './tabs/my-company/my-company';
import * as clients from './tabs/clients/clients';
import * as products from './tabs/products/products';
import * as invoices from './tabs/invoices/invoices';
import * as tracker from './tabs/tracker/tracker';

// Tab configuration
interface TabModule {
  render: () => string;
  init: () => void;
}

const tabs: Record<string, TabModule> = {
  'my-company': myCompany,
  'clients': clients,
  'products': products,
  'invoices': invoices,
  'tracker': tracker
};

// Current active tab
let currentTab = 'my-company';

// Get DOM elements
const tabContent = document.getElementById('tab-content')!;
const tabButtons = document.querySelectorAll('.tab-button');

// Function to switch tabs
function switchTab(tabName: string): void {
  if (!tabs[tabName]) return;

  // Update current tab
  currentTab = tabName;

  // Update button states
  tabButtons.forEach(button => {
    if (button.getAttribute('data-tab') === tabName) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  // Render tab content
  tabContent.innerHTML = tabs[tabName].render();

  // Initialize tab functionality
  tabs[tabName].init();
}

// Add click event listeners to tab buttons
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabName = button.getAttribute('data-tab');
    if (tabName) {
      switchTab(tabName);
    }
  });
});

// Initialize with the first tab
switchTab(currentTab);
