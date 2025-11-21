// Global data model
let shop = {
    products: ['bread', 'butter', 'eggs', 'yogurt', 'milk', 'cheese', 'ham', 'tomato'],
    prices: { 
        butter: 5.30, 
        eggs: 0.40, 
        bread: 3.50, 
        yogurt: 1.65,
        milk: 2.10,
        cheese: 8.50,
        ham: 12.00,
        tomato: 1.20
    },
    locations: [ 
        { 
            name: "Sofia", 
            lat: 42.657, 
            lng: 23.316, 
            sales: [ 
                ['bread', 2], ['eggs', 5], ['butter', 1], ['bread', 2], ['yogurt', 2],
                ['milk', 3], ['cheese', 1], ['ham', 2], ['tomato', 4]
            ]
        },
        { 
            name: "Plovdiv", 
            lat: 42.145, 
            lng: 24.779, 
            sales: [ 
                ['eggs', 3], ['butter', 2], ['bread', 1], ['yogurt', 4], ['bread', 3],
                ['milk', 2], ['cheese', 2], ['ham', 1], ['tomato', 6]
            ] 
        },
        { 
            name: "Varna", 
            lat: 43.204, 
            lng: 27.911, 
            sales: [ 
                ['bread', 4], ['eggs', 2], ['butter', 3], ['yogurt', 1], ['milk', 5],
                ['cheese', 1], ['ham', 3], ['tomato', 2]
            ] 
        }
    ]
};

// Global app data reference
const appData = shop;

// ============== PRODUCT OPERATIONS ==============

/**
 * Add a new product
 * @param {string} productName - Name of the product
 * @returns {boolean} - Success status
 */
function addProduct(productName) {
    const name = productName.toLowerCase().trim();
    
    if (!name) {
        showMessage('Product name cannot be empty', 'error');
        return false;
    }
    
    if (shop.products.includes(name)) {
        showMessage('Product already exists', 'error');
        return false;
    }
    
    shop.products.push(name);
    // New products have no price initially
    showMessage('Product added successfully', 'success');
    return true;
}

/**
 * Remove a product and update related data
 * @param {string} productName - Name of the product to remove
 * @returns {boolean} - Success status
 */
function removeProduct(productName) {
    const idx = shop.products.indexOf(productName);
    
    if (idx === -1) {
        showMessage('Product not found', 'error');
        return false;
    }
    
    // Remove from products array
    shop.products.splice(idx, 1);
    
    // Remove from prices
    if (shop.prices[productName]) {
        delete shop.prices[productName];
    }
    
    // Remove from all sales in all locations
    shop.locations.forEach(location => {
        location.sales = location.sales.filter(sale => sale[0] !== productName);
    });
    
    showMessage('Product removed and all related data updated', 'success');
    return true;
}

/**
 * Edit/rename a product
 * @param {string} oldName - Current product name
 * @param {string} newName - New product name
 * @returns {boolean} - Success status
 */
function editProduct(oldName, newName) {
    const newNameLower = newName.toLowerCase().trim();
    const idx = shop.products.indexOf(oldName);
    
    if (idx === -1) {
        showMessage('Product not found', 'error');
        return false;
    }
    
    if (shop.products.includes(newNameLower) && newNameLower !== oldName) {
        showMessage('Product name already exists', 'error');
        return false;
    }
    
    // Update products array
    shop.products[idx] = newNameLower;
    
    // Update prices
    if (shop.prices[oldName] !== undefined) {
        shop.prices[newNameLower] = shop.prices[oldName];
        delete shop.prices[oldName];
    }
    
    // Update sales in all locations
    shop.locations.forEach(location => {
        location.sales.forEach(sale => {
            if (sale[0] === oldName) {
                sale[0] = newNameLower;
            }
        });
    });
    
    showMessage('Product updated successfully', 'success');
    return true;
}

// ============== PRICE OPERATIONS ==============

/**
 * Set price for a product
 * @param {string} productName - Product name
 * @param {number} price - Price value
 * @returns {boolean} - Success status
 */
function setProductPrice(productName, price) {
    const productNameLower = productName.toLowerCase();
    
    if (!shop.products.includes(productNameLower)) {
        showMessage('Product not found', 'error');
        return false;
    }
    
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
        showMessage('Invalid price', 'error');
        return false;
    }
    
    shop.prices[productNameLower] = priceNum;
    showMessage('Price updated successfully', 'success');
    return true;
}

/**
 * Get price for a product
 * @param {string} productName - Product name
 * @returns {number|null} - Price or null if not set
 */
function getProductPrice(productName) {
    return shop.prices[productName] || null;
}

// ============== LOCATION OPERATIONS ==============

/**
 * Add a new location
 * @param {string} name - Location name
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} - Success status
 */
function addLocation(name, lat, lng) {
    const nameTrim = name.trim();
    
    if (!nameTrim) {
        showMessage('Location name cannot be empty', 'error');
        return false;
    }
    
    if (shop.locations.find(loc => loc.name === nameTrim)) {
        showMessage('Location already exists', 'error');
        return false;
    }
    
    const location = {
        name: nameTrim,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        sales: []
    };
    
    shop.locations.push(location);
    showMessage('Location added successfully', 'success');
    return true;
}

/**
 * Remove a location
 * @param {string} locationName - Name of location to remove
 * @returns {boolean} - Success status
 */
function removeLocation(locationName) {
    const idx = shop.locations.findIndex(loc => loc.name === locationName);
    
    if (idx === -1) {
        showMessage('Location not found', 'error');
        return false;
    }
    
    shop.locations.splice(idx, 1);
    showMessage('Location removed successfully', 'success');
    return true;
}

/**
 * Edit a location
 * @param {string} oldName - Current location name
 * @param {string} newName - New location name
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} - Success status
 */
function editLocation(oldName, newName, lat, lng) {
    const location = shop.locations.find(loc => loc.name === oldName);
    
    if (!location) {
        showMessage('Location not found', 'error');
        return false;
    }
    
    const newNameTrim = newName.trim();
    if (shop.locations.find(loc => loc.name === newNameTrim && loc.name !== oldName)) {
        showMessage('Location name already exists', 'error');
        return false;
    }
    
    location.name = newNameTrim;
    location.lat = parseFloat(lat);
    location.lng = parseFloat(lng);
    
    showMessage('Location updated successfully', 'success');
    return true;
}

// ============== SALES OPERATIONS ==============

/**
 * Add a sale to a location
 * @param {string} locationName - Location name
 * @param {string} productName - Product name
 * @param {number} quantity - Quantity sold
 * @returns {boolean} - Success status
 */
function addSale(locationName, productName, quantity) {
    const location = shop.locations.find(loc => loc.name === locationName);
    
    if (!location) {
        showMessage('Location not found', 'error');
        return false;
    }
    
    const productNameLower = productName.toLowerCase();
    if (!shop.products.includes(productNameLower)) {
        showMessage('Product not found', 'error');
        return false;
    }
    
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
        showMessage('Invalid quantity', 'error');
        return false;
    }
    
    location.sales.push([productNameLower, qty]);
    showMessage('Sale added successfully', 'success');
    return true;
}

/**
 * Remove a sale from a location
 * @param {string} locationName - Location name
 * @param {number} saleIndex - Index of sale to remove
 * @returns {boolean} - Success status
 */
function removeSale(locationName, saleIndex) {
    const location = shop.locations.find(loc => loc.name === locationName);
    
    if (!location) {
        showMessage('Location not found', 'error');
        return false;
    }
    
    if (saleIndex < 0 || saleIndex >= location.sales.length) {
        showMessage('Invalid sale index', 'error');
        return false;
    }
    
    location.sales.splice(saleIndex, 1);
    showMessage('Sale removed successfully', 'success');
    return true;
}

/**
 * Edit a sale in a location
 * @param {string} locationName - Location name
 * @param {number} saleIndex - Index of sale to edit
 * @param {string} productName - New product name
 * @param {number} quantity - New quantity
 * @returns {boolean} - Success status
 */
function editSale(locationName, saleIndex, productName, quantity) {
    const location = shop.locations.find(loc => loc.name === locationName);
    
    if (!location) {
        showMessage('Location not found', 'error');
        return false;
    }
    
    if (saleIndex < 0 || saleIndex >= location.sales.length) {
        showMessage('Invalid sale index', 'error');
        return false;
    }
    
    const productNameLower = productName.toLowerCase();
    if (!shop.products.includes(productNameLower)) {
        showMessage('Product not found', 'error');
        return false;
    }
    
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
        showMessage('Invalid quantity', 'error');
        return false;
    }
    
    location.sales[saleIndex] = [productNameLower, qty];
    showMessage('Sale updated successfully', 'success');
    return true;
}

// ============== QUERY OPERATIONS ==============

/**
 * Get total sales for a product
 * @param {string} productName - Product name
 * @returns {number} - Total quantity sold
 */
function getTotalSalesForProduct(productName) {
    let total = 0;
    shop.locations.forEach(location => {
        location.sales.forEach(sale => {
            if (sale[0] === productName) {
                total += sale[1];
            }
        });
    });
    return total;
}

/**
 * Get total sales for a location
 * @param {string} locationName - Location name
 * @returns {number} - Total quantity sold
 */
function getTotalSalesForLocation(locationName) {
    const location = shop.locations.find(loc => loc.name === locationName);
    if (!location) return 0;
    
    return location.sales.reduce((sum, sale) => sum + sale[1], 0);
}

/**
 * Get revenue for a product
 * @param {string} productName - Product name
 * @returns {number} - Total revenue
 */
function getProductRevenue(productName) {
    const price = shop.prices[productName];
    if (!price) return 0;
    
    const quantity = getTotalSalesForProduct(productName);
    return price * quantity;
}

/**
 * Get all products
 * @returns {array} - Products array
 */
function getProducts() {
    return [...shop.products];
}

/**
 * Get all locations
 * @returns {array} - Locations array
 */
function getLocations() {
    return shop.locations.map(loc => ({...loc}));
}

// ============== TAB SWITCHING ==============

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'products' && typeof initProductsTab === 'function') {
        initProductsTab();
    } else if (tabName === 'prices' && typeof initPricesTab === 'function') {
        initPricesTab();
    } else if (tabName === 'locations' && typeof initLocationsTab === 'function') {
        initLocationsTab();
    } else if (tabName === 'sales' && typeof initSalesTab === 'function') {
        initSalesTab();
    } else if (tabName === 'reports' && typeof initReportsTab === 'function') {
        initReportsTab();
    }
}

// ============== UTILITIES ==============

function showMessage(message, type = 'success') {
    const msg = document.createElement('div');
    msg.className = `status-message ${type} show`;
    msg.textContent = message;
    
    document.body.insertBefore(msg, document.body.firstChild);
    
    setTimeout(() => {
        msg.remove();
    }, 3000);
}

function initApp() {
    console.log('Sales Tracker app initialized with data model');
    console.log('Shop data:', shop);
}

document.addEventListener('DOMContentLoaded', initApp);
