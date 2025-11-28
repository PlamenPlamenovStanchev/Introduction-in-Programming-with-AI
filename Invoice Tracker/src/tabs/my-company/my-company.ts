import html from './my-company.html?raw';
import './my-company.css';
import { companyProfile, updateCompanyProfile } from '../../data';
import type { Company } from '../../data';

export function render(): string {
    return html;
}

export function init(): void {
    console.log('My Company tab initialized');
    
    // Get DOM elements
    const viewSection = document.getElementById('company-view')!;
    const editSection = document.getElementById('company-edit')!;
    const editBtn = document.getElementById('edit-btn')!;
    const cancelBtn = document.getElementById('cancel-btn')!;
    const form = document.getElementById('company-form') as HTMLFormElement;

    // Display company data
    displayCompanyData();

    // Edit button click handler
    editBtn.addEventListener('click', () => {
        populateEditForm();
        viewSection.style.display = 'none';
        editSection.style.display = 'block';
    });

    // Cancel button click handler
    cancelBtn.addEventListener('click', () => {
        editSection.style.display = 'none';
        viewSection.style.display = 'block';
    });

    // Form submit handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveCompanyData();
        editSection.style.display = 'none';
        viewSection.style.display = 'block';
    });
}

function displayCompanyData(): void {
    document.getElementById('view-name')!.textContent = companyProfile.name;
    document.getElementById('view-id')!.textContent = companyProfile.id;
    document.getElementById('view-taxId')!.textContent = companyProfile.taxId;
    document.getElementById('view-address')!.textContent = companyProfile.address;
    document.getElementById('view-manager')!.textContent = companyProfile.manager;
    document.getElementById('view-iban')!.textContent = companyProfile.iban;
    document.getElementById('view-vatRate')!.textContent = `${companyProfile.defaultVatRate ?? 20}%`;
}

function populateEditForm(): void {
    (document.getElementById('edit-name') as HTMLInputElement).value = companyProfile.name;
    (document.getElementById('edit-id') as HTMLInputElement).value = companyProfile.id;
    (document.getElementById('edit-taxId') as HTMLInputElement).value = companyProfile.taxId;
    (document.getElementById('edit-address') as HTMLInputElement).value = companyProfile.address;
    (document.getElementById('edit-manager') as HTMLInputElement).value = companyProfile.manager;
    (document.getElementById('edit-iban') as HTMLInputElement).value = companyProfile.iban;
    (document.getElementById('edit-vatRate') as HTMLInputElement).value = String(companyProfile.defaultVatRate ?? 20);
}

function saveCompanyData(): void {
    const updatedCompany: Company = {
        id: (document.getElementById('edit-id') as HTMLInputElement).value,
        name: (document.getElementById('edit-name') as HTMLInputElement).value,
        taxId: (document.getElementById('edit-taxId') as HTMLInputElement).value,
        address: (document.getElementById('edit-address') as HTMLInputElement).value,
        manager: (document.getElementById('edit-manager') as HTMLInputElement).value,
        iban: (document.getElementById('edit-iban') as HTMLInputElement).value,
        defaultVatRate: parseFloat((document.getElementById('edit-vatRate') as HTMLInputElement).value)
    };

    updateCompanyProfile(updatedCompany);
    displayCompanyData();
}
