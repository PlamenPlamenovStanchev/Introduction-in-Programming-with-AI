// Initialize Products Tab
let isEditingProduct = null;

function initProductsTab() {
    const container = document.getElementById('productsContent');
    
    if (container.innerHTML === '') {
        container.innerHTML = `
            <div class="form-group">
                <label>Product Name:</label>
                <input type="text" id="productName" placeholder="Enter product name">
            </div>
            
            <div class="action-buttons">
                <button onclick="saveProduct()">➕ Add Product</button>
                <button class="btn-secondary" onclick="cancelEditProduct()">❌ Cancel</button>
                <button class="btn-secondary" onclick="clearProductForm()">🗑️ Clear</button>
            </div>
            
            <div id="productsList"></div>
        `;
    }
    
    displayProducts();
}

// Save product (add or edit)
function saveProduct() {
    const name = document.getElementById('productName').value.trim();
    
    if (!name) {
        showMessage('Please enter a product name', 'error');
        return;
    }
    
    if (isEditingProduct !== null) {
        // Editing existing product
        if (name !== isEditingProduct && shop.products.includes(name)) {
            showMessage('Product name already exists', 'error');
            return;
        }
        editProduct(isEditingProduct, name);
        isEditingProduct = null;
    } else {
        // Adding new product
        if (shop.products.includes(name)) {
            showMessage('Product already exists', 'error');
            return;
        }
        addProduct(name);
    }
    
    clearProductForm();
    displayProducts();
}

// Display products
function displayProducts() {
    const list = document.getElementById('productsList');
    
    if (shop.products.length === 0) {
        list.innerHTML = '<div class="empty-message">No products available. Add one to get started!</div>';
        return;
    }
    
    list.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Total Sold</th>
                    <th>Revenue</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${shop.products.map((product) => {
                    const price = shop.prices[product];
                    const totalSold = getTotalSalesForProduct(product);
                    const revenue = getProductRevenue(product);
                    
                    return `
                        <tr>
                            <td><strong>${product}</strong></td>
                            <td>${price !== undefined ? '€' + price.toFixed(2) : '<em>Not set</em>'}</td>
                            <td>${totalSold} units</td>
                            <td>${price !== undefined ? '€' + revenue.toFixed(2) : '-'}</td>
                            <td>
                                <button class="btn-secondary" onclick="editProductClick('${product}')">Edit</button>
                                <button class="btn-danger" onclick="deleteProductClick('${product}')">Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Edit product (set form values)
function editProductClick(productName) {
    document.getElementById('productName').value = productName;
    isEditingProduct = productName;
    document.getElementById('productName').focus();
    
    // Update button text to show editing mode
    updateEditButtonText();
}

function updateEditButtonText() {
    const btn = document.querySelector('.action-buttons button:first-child');
    if (isEditingProduct !== null) {
        btn.textContent = '💾 Save Changes';
    } else {
        btn.textContent = '➕ Add Product';
    }
}

// Cancel product editing
function cancelEditProduct() {
    if (isEditingProduct !== null) {
        clearProductForm();
    }
}

// Delete product
function deleteProductClick(productName) {
    const totalSold = getTotalSalesForProduct(productName);
    const salesLocations = [];
    
    shop.locations.forEach(location => {
        const hasSale = location.sales.some(sale => sale[0] === productName);
        if (hasSale) {
            salesLocations.push(location.name);
        }
    });
    
    let confirmMsg = `Delete product "${productName}"?`;
    if (totalSold > 0) {
        confirmMsg += `\n\nThis will also delete ${totalSold} units of sales from: ${salesLocations.join(', ')}`;
    }
    if (shop.prices[productName] !== undefined) {
        confirmMsg += '\nPrice data will be removed.';
    }
    
    if (confirm(confirmMsg)) {
        removeProduct(productName);
        if (isEditingProduct === productName) {
            isEditingProduct = null;
        }
        displayProducts();
    }
}

// Clear form
function clearProductForm() {
    document.getElementById('productName').value = '';
    isEditingProduct = null;
    updateEditButtonText();
}
