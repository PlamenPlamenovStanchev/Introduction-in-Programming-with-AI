// Initialize Prices Tab
let isEditingPrice = null;

function initPricesTab() {
    const container = document.getElementById('pricesContent');
    
    if (container.innerHTML === '') {
        container.innerHTML = `
            <div class="grid-2">
                <div class="form-group">
                    <label>Product:</label>
                    <select id="priceProduct">
                        <option value="">Select a product...</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Price (€):</label>
                    <input type="number" id="priceAmount" placeholder="Enter price" min="0" step="0.01">
                </div>
            </div>
            
            <div class="action-buttons">
                <button onclick="savePrice()">💾 Set Price</button>
                <button class="btn-secondary" onclick="cancelEditPrice()">❌ Cancel</button>
                <button class="btn-secondary" onclick="clearPriceForm()">🗑️ Clear</button>
            </div>
            
            <div id="pricesList"></div>
        `;
    }
    
    updateProductSelect();
    displayPrices();
}

// Update product select options
function updateProductSelect() {
    const select = document.getElementById('priceProduct');
    select.innerHTML = '<option value="">Select a product...</option>';
    
    shop.products.forEach(product => {
        const option = document.createElement('option');
        option.value = product;
        option.textContent = product;
        select.appendChild(option);
    });
}

// Save price
function savePrice() {
    const product = document.getElementById('priceProduct').value;
    const priceInput = document.getElementById('priceAmount').value;
    
    if (!product) {
        showMessage('Please select a product', 'error');
        return;
    }
    
    if (!priceInput) {
        showMessage('Please enter a price', 'error');
        return;
    }
    
    const price = parseFloat(priceInput);
    
    if (isNaN(price) || price < 0) {
        showMessage('Please enter a valid price (must be >= 0)', 'error');
        return;
    }
    
    if (setProductPrice(product, price)) {
        clearPriceForm();
        displayPrices();
    }
}

// Display prices
function displayPrices() {
    const list = document.getElementById('pricesList');
    
    if (shop.products.length === 0) {
        list.innerHTML = '<div class="empty-message">No products available. Add products first in Product Editor tab.</div>';
        return;
    }
    
    const priceEntries = shop.products.map(product => ({
        product,
        price: shop.prices[product],
        totalSold: getTotalSalesForProduct(product),
        revenue: getProductRevenue(product)
    }));
    
    list.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price (€)</th>
                    <th>Status</th>
                    <th>Total Sold</th>
                    <th>Revenue (€)</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${priceEntries.map((entry) => {
                    const priceStatus = entry.price !== undefined ? '✓ Set' : '⚠ Not set';
                    const priceClass = entry.price !== undefined ? '' : 'warning';
                    
                    return `
                        <tr class="${priceClass}">
                            <td><strong>${entry.product}</strong></td>
                            <td>${entry.price !== undefined ? entry.price.toFixed(2) : '-'}</td>
                            <td>${priceStatus}</td>
                            <td>${entry.totalSold} units</td>
                            <td>${entry.price !== undefined ? entry.revenue.toFixed(2) : '-'}</td>
                            <td>
                                <button class="btn-secondary" onclick="editPriceClick('${entry.product}')">Edit</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Edit price
function editPriceClick(product) {
    document.getElementById('priceProduct').value = product;
    const price = shop.prices[product];
    document.getElementById('priceAmount').value = price !== undefined ? price : '';
    isEditingPrice = product;
    document.getElementById('priceAmount').focus();
    
    updateEditButtonText();
}

function updateEditButtonText() {
    const btn = document.querySelector('#pricesContent .action-buttons button:first-child');
    if (isEditingPrice !== null) {
        btn.textContent = '💾 Update Price';
    } else {
        btn.textContent = '💾 Set Price';
    }
}

// Cancel editing price
function cancelEditPrice() {
    if (isEditingPrice !== null) {
        clearPriceForm();
    }
}

// Clear form
function clearPriceForm() {
    document.getElementById('priceProduct').value = '';
    document.getElementById('priceAmount').value = '';
    isEditingPrice = null;
    updateEditButtonText();
}
