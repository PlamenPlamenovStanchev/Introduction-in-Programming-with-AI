let salesTableData = [];
let sortColumn = 'product';
let sortDirection = 'asc';
let filterProduct = '';
let filterLocation = '';

function initSalesTab() {
    const container = document.getElementById('salesContent');
    
    if (container.innerHTML === '') {
        container.innerHTML = `
            <div class="filter-controls">
                <div class="grid-2">
                    <div class="form-group">
                        <label>Filter by Product:</label>
                        <select id="filterProduct" onchange="applyFiltersAndSort()">
                            <option value="">All Products</option>
                            ${shop.products.map(p => `<option value="${p}">${p}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Filter by Location:</label>
                        <select id="filterLocation" onchange="applyFiltersAndSort()">
                            <option value="">All Locations</option>
                            ${shop.locations.map(l => `<option value="${l.name}">${l.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="btn-secondary" onclick="clearSalesFilters()">🗑️ Clear Filters</button>
                    <button class="btn-secondary" onclick="exportSalesData()">📥 Export CSV</button>
                </div>
            </div>
            
            <div id="salesTable"></div>
        `;
    }
    
    buildSalesTableData();
    applyFiltersAndSort();
}

function buildSalesTableData() {
    salesTableData = [];
    
    shop.locations.forEach(location => {
        location.sales.forEach(sale => {
            const product = sale[0];
            const quantity = sale[1];
            const price = shop.prices[product];
            const revenue = price ? price * quantity : 0;
            
            salesTableData.push({
                product,
                location: location.name,
                quantity,
                price: price || 0,
                revenue
            });
        });
    });
}

function applyFiltersAndSort() {
    filterProduct = document.getElementById('filterProduct').value;
    filterLocation = document.getElementById('filterLocation').value;
    
    // Apply filters
    let filtered = salesTableData.filter(row => {
        return (!filterProduct || row.product === filterProduct) &&
               (!filterLocation || row.location === filterLocation);
    });
    
    // Apply sorting
    filtered.sort((a, b) => {
        let aVal, bVal;
        
        switch(sortColumn) {
            case 'product':
                aVal = a.product;
                bVal = b.product;
                break;
            case 'location':
                aVal = a.location;
                bVal = b.location;
                break;
            case 'quantity':
                aVal = a.quantity;
                bVal = a.quantity;
                break;
            case 'price':
                aVal = a.price;
                bVal = b.price;
                break;
            case 'revenue':
                aVal = a.revenue;
                bVal = b.revenue;
                break;
            default:
                return 0;
        }
        
        // Handle string vs number sorting
        if (typeof aVal === 'string') {
            return sortDirection === 'asc' 
                ? aVal.localeCompare(bVal) 
                : bVal.localeCompare(aVal);
        } else {
            return sortDirection === 'asc' 
                ? aVal - bVal 
                : bVal - aVal;
        }
    });
    
    displaySalesTable(filtered);
}

function displaySalesTable(data) {
    const table = document.getElementById('salesTable');
    
    if (data.length === 0) {
        table.innerHTML = '<div class="empty-message">No sales found matching the selected filters</div>';
        return;
    }
    
    // Calculate totals
    const totals = {
        quantity: data.reduce((sum, row) => sum + row.quantity, 0),
        revenue: data.reduce((sum, row) => sum + row.revenue, 0),
        avgPrice: data.length > 0 ? (data.reduce((sum, row) => sum + row.price, 0) / data.length) : 0
    };
    
    table.innerHTML = `
        <div class="table-info">
            <p><strong>Showing ${data.length} sale(s)</strong> | Total Quantity: <strong>${totals.quantity} units</strong> | Total Revenue: <strong>€${totals.revenue.toFixed(2)}</strong></p>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th class="sortable" onclick="sortTable('product')">
                        Product ${getSortIndicator('product')}
                    </th>
                    <th class="sortable" onclick="sortTable('location')">
                        Location ${getSortIndicator('location')}
                    </th>
                    <th class="sortable" onclick="sortTable('quantity')">
                        Quantity ${getSortIndicator('quantity')}
                    </th>
                    <th class="sortable" onclick="sortTable('price')">
                        Unit Price (€) ${getSortIndicator('price')}
                    </th>
                    <th class="sortable" onclick="sortTable('revenue')">
                        Revenue (€) ${getSortIndicator('revenue')}
                    </th>
                </tr>
            </thead>
            <tbody>
                ${data.map((row, idx) => `
                    <tr>
                        <td>${row.product}</td>
                        <td>${row.location}</td>
                        <td>${row.quantity}</td>
                        <td>${row.price.toFixed(2)}</td>
                        <td><strong>${row.revenue.toFixed(2)}</strong></td>
                    </tr>
                `).join('')}
                <tr class="totals-row">
                    <td colspan="2"><strong>TOTALS</strong></td>
                    <td><strong>${totals.quantity}</strong></td>
                    <td><strong>€${totals.avgPrice.toFixed(2)}</strong> (avg)</td>
                    <td><strong>€${totals.revenue.toFixed(2)}</strong></td>
                </tr>
            </tbody>
        </table>
    `;
}

function sortTable(column) {
    if (sortColumn === column) {
        // Toggle direction if same column clicked
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        // New column, default to ascending
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    applyFiltersAndSort();
}

function getSortIndicator(column) {
    if (sortColumn !== column) return '';
    return sortDirection === 'asc' ? '▲' : '▼';
}

function clearSalesFilters() {
    document.getElementById('filterProduct').value = '';
    document.getElementById('filterLocation').value = '';
    filterProduct = '';
    filterLocation = '';
    applyFiltersAndSort();
    showMessage('Filters cleared', 'success');
}

function exportSalesData() {
    if (salesTableData.length === 0) {
        showMessage('No data to export', 'error');
        return;
    }
    
    // Rebuild data with current filters applied
    let filtered = salesTableData.filter(row => {
        return (!filterProduct || row.product === filterProduct) &&
               (!filterLocation || row.location === filterLocation);
    });
    
    // Create CSV content
    let csv = 'Product,Location,Quantity,Unit Price (€),Revenue (€)\n';
    
    filtered.forEach(row => {
        csv += `${row.product},${row.location},${row.quantity},${row.price.toFixed(2)},${row.revenue.toFixed(2)}\n`;
    });
    
    // Add totals
    const totals = {
        quantity: filtered.reduce((sum, row) => sum + row.quantity, 0),
        revenue: filtered.reduce((sum, row) => sum + row.revenue, 0),
        avgPrice: filtered.length > 0 ? (filtered.reduce((sum, row) => sum + row.price, 0) / filtered.length) : 0
    };
    
    csv += `TOTALS,,${totals.quantity},${totals.avgPrice.toFixed(2)},${totals.revenue.toFixed(2)}\n`;
    
    // Download CSV file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    showMessage('Sales data exported to CSV', 'success');
}
