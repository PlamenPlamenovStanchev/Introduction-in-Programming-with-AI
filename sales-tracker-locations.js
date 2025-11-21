// Initialize Locations Tab
let isEditingLocation = null;
let selectedLocationName = null;

function initLocationsTab() {
    const container = document.getElementById('locationsContent');
    
    if (container.innerHTML === '') {
        container.innerHTML = `
            <div class="split-layout">
                <!-- Left Panel: Locations List -->
                <div class="split-left">
                    <h3>Locations</h3>
                    <div class="grid-2" style="grid-template-columns: 1fr; margin-bottom: 15px;">
                        <div class="form-group">
                            <label>Location Name:</label>
                            <input type="text" id="locationName" placeholder="e.g., Sofia">
                        </div>
                        
                        <div class="form-group">
                            <label>Latitude:</label>
                            <input type="number" id="locationLat" placeholder="42.657" step="0.001">
                        </div>
                        
                        <div class="form-group">
                            <label>Longitude:</label>
                            <input type="number" id="locationLng" placeholder="23.316" step="0.001">
                        </div>
                    </div>
                    
                    <div class="action-buttons" style="flex-direction: column;">
                        <button onclick="saveLocation()">➕ Add Location</button>
                        <button class="btn-secondary" onclick="cancelEditLocation()">❌ Cancel</button>
                        <button class="btn-secondary" onclick="clearLocationForm()">🗑️ Clear</button>
                    </div>
                    
                    <div id="locationsList" class="location-list"></div>
                </div>
                
                <!-- Right Panel: Sales for Selected Location -->
                <div class="split-right">
                    <h3>Sales for Location</h3>
                    <div id="salesPanel"></div>
                </div>
            </div>
        `;
    }
    
    displayLocations();
}

// Save location
function saveLocation() {
    const name = document.getElementById('locationName').value.trim();
    const lat = document.getElementById('locationLat').value;
    const lng = document.getElementById('locationLng').value;
    
    if (!name) {
        showMessage('Please enter a location name', 'error');
        return;
    }
    
    if (!lat || !lng) {
        showMessage('Please enter both latitude and longitude', 'error');
        return;
    }
    
    if (isEditingLocation !== null) {
        if (name !== isEditingLocation && shop.locations.find(loc => loc.name === name)) {
            showMessage('Location name already exists', 'error');
            return;
        }
        editLocation(isEditingLocation, name, lat, lng);
        isEditingLocation = null;
    } else {
        if (shop.locations.find(loc => loc.name === name)) {
            showMessage('Location already exists', 'error');
            return;
        }
        addLocation(name, lat, lng);
    }
    
    clearLocationForm();
    displayLocations();
}

// Display locations
function displayLocations() {
    const list = document.getElementById('locationsList');
    
    if (shop.locations.length === 0) {
        list.innerHTML = '<div class="empty-message">No locations. Add one to get started!</div>';
        displaySalesPanel(null);
        return;
    }
    
    list.innerHTML = shop.locations.map((location) => `
        <div class="location-item ${selectedLocationName === location.name ? 'active' : ''}" 
             onclick="selectLocation('${location.name}')">
            <div class="location-item-name">${location.name}</div>
            <div class="location-item-coords">
                📍 ${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}
            </div>
            <div class="location-item-sales">
                📦 ${location.sales.length} sales
            </div>
            <div style="display: flex; gap: 5px; margin-top: 8px;">
                <button class="btn-secondary" style="flex: 1; padding: 6px 10px; font-size: 12px;" 
                        onclick="event.stopPropagation(); editLocationClick('${location.name}')">Edit</button>
                <button class="btn-danger" style="flex: 1; padding: 6px 10px; font-size: 12px;" 
                        onclick="event.stopPropagation(); deleteLocationClick('${location.name}')">Delete</button>
            </div>
        </div>
    `).join('');
    
    if (!selectedLocationName && shop.locations.length > 0) {
        selectLocation(shop.locations[0].name);
    }
}

function selectLocation(locationName) {
    selectedLocationName = locationName;
    displayLocations();
    displaySalesPanel(locationName);
}

// Edit location
function editLocationClick(locationName) {
    const location = shop.locations.find(loc => loc.name === locationName);
    if (location) {
        document.getElementById('locationName').value = location.name;
        document.getElementById('locationLat').value = location.lat;
        document.getElementById('locationLng').value = location.lng;
        isEditingLocation = locationName;
        document.getElementById('locationName').focus();
    }
}

// Delete location
function deleteLocationClick(locationName) {
    const location = shop.locations.find(loc => loc.name === locationName);
    const salesCount = location.sales.length;
    
    let confirmMsg = `Delete location "${locationName}"?`;
    if (salesCount > 0) {
        confirmMsg += `\n\nThis will also delete ${salesCount} sales records from this location.`;
    }
    
    if (confirm(confirmMsg)) {
        removeLocation(locationName);
        if (selectedLocationName === locationName) {
            selectedLocationName = null;
        }
        if (isEditingLocation === locationName) {
            isEditingLocation = null;
        }
        displayLocations();
    }
}

function cancelEditLocation() {
    if (isEditingLocation !== null) {
        clearLocationForm();
    }
}

// Clear form
function clearLocationForm() {
    document.getElementById('locationName').value = '';
    document.getElementById('locationLat').value = '';
    document.getElementById('locationLng').value = '';
    isEditingLocation = null;
}

// ============== SALES PANEL ==============

let isEditingSale = null;

function displaySalesPanel(locationName) {
    const panel = document.getElementById('salesPanel');
    
    if (!locationName) {
        panel.innerHTML = '<div class="empty-message">Select a location to manage sales</div>';
        return;
    }
    
    const location = shop.locations.find(loc => loc.name === locationName);
    
    panel.innerHTML = `
        <div class="grid-2" style="grid-template-columns: 1fr; margin-bottom: 15px;">
            <div class="form-group">
                <label>Product:</label>
                <select id="saleProduct">
                    <option value="">Select a product...</option>
                    ${shop.products.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label>Quantity:</label>
                <input type="number" id="saleQuantity" placeholder="Enter quantity" min="1" value="1">
            </div>
        </div>
        
        <div class="action-buttons" style="flex-direction: column;">
            <button onclick="saveSale('${locationName}')">➕ Add Sale</button>
            <button class="btn-secondary" onclick="cancelEditSale()">❌ Cancel</button>
            <button class="btn-secondary" onclick="clearSaleForm()">🗑️ Clear</button>
        </div>
        
        <div id="salesTable"></div>
    `;
    
    displaySalesTable(locationName);
}

function saveSale(locationName) {
    const product = document.getElementById('saleProduct').value;
    const quantity = document.getElementById('saleQuantity').value;
    
    if (!product) {
        showMessage('Please select a product', 'error');
        return;
    }
    
    if (isEditingSale !== null) {
        editSale(locationName, isEditingSale, product, quantity);
        isEditingSale = null;
    } else {
        addSale(locationName, product, quantity);
    }
    
    clearSaleForm();
    displaySalesPanel(locationName);
}

function displaySalesTable(locationName) {
    const location = shop.locations.find(loc => loc.name === locationName);
    const table = document.getElementById('salesTable');
    
    if (!location || location.sales.length === 0) {
        table.innerHTML = '<div class="empty-message">No sales recorded</div>';
        return;
    }
    
    table.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${location.sales.map((sale, idx) => {
                    const price = shop.prices[sale[0]];
                    const total = price ? (price * sale[1]) : '-';
                    
                    return `
                        <tr>
                            <td><strong>${sale[0]}</strong></td>
                            <td>${sale[1]}</td>
                            <td>${price !== undefined ? '€' + price.toFixed(2) : '-'}</td>
                            <td>${total !== '-' ? '€' + total.toFixed(2) : '-'}</td>
                            <td>
                                <button class="btn-secondary" style="padding: 5px 10px; font-size: 12px;" 
                                        onclick="editSaleClick('${locationName}', ${idx})">Edit</button>
                                <button class="btn-danger" style="padding: 5px 10px; font-size: 12px;" 
                                        onclick="deleteSaleClick('${locationName}', ${idx})">Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function editSaleClick(locationName, saleIndex) {
    const location = shop.locations.find(loc => loc.name === locationName);
    const sale = location.sales[saleIndex];
    
    document.getElementById('saleProduct').value = sale[0];
    document.getElementById('saleQuantity').value = sale[1];
    isEditingSale = saleIndex;
}

function deleteSaleClick(locationName, saleIndex) {
    if (confirm('Delete this sale?')) {
        removeSale(locationName, saleIndex);
        if (isEditingSale === saleIndex) {
            isEditingSale = null;
        }
        displaySalesPanel(locationName);
    }
}

function cancelEditSale() {
    if (isEditingSale !== null) {
        clearSaleForm();
    }
}

function clearSaleForm() {
    document.getElementById('saleProduct').value = '';
    document.getElementById('saleQuantity').value = '1';
    isEditingSale = null;
}
