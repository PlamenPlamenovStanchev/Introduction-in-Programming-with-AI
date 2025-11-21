// Initialize Reports Tab
function initReportsTab() {
    const container = document.getElementById('reportsContent');
    
    if (container.innerHTML === '') {
        container.innerHTML = `
            <div class="reports-container">
                <div class="report-header">
                    <h3>Revenue Analysis by Location</h3>
                    <div class="action-buttons">
                        <button class="btn-secondary" onclick="exportReportData()">📥 Export Report</button>
                        <button class="btn-secondary" onclick="printReport()">🖨️ Print</button>
                    </div>
                </div>
                
                <div id="reportsOutput"></div>
            </div>
        `;
    }
    
    generateReports();
}

function generateReports() {
    const output = document.getElementById('reportsOutput');
    
    if (shop.locations.length === 0) {
        output.innerHTML = '<div class="empty-message">No locations available</div>';
        return;
    }
    
    let html = '';
    
    // Generate report for each location
    shop.locations.forEach((location, locIdx) => {
        html += generateLocationReport(location, locIdx);
    });
    
    // Add grand totals
    html += generateGrandTotals();
    
    output.innerHTML = html;
}

function generateLocationReport(location, locIdx) {
    // Build revenue data for this location
    const productRevenue = {};
    
    shop.products.forEach(product => {
        productRevenue[product] = {
            quantity: 0,
            price: shop.prices[product] || 0,
            revenue: 0
        };
    });
    
    // Calculate revenue from sales
    location.sales.forEach(sale => {
        const product = sale[0];
        const quantity = sale[1];
        const price = shop.prices[product] || 0;
        const revenue = price * quantity;
        
        if (productRevenue[product]) {
            productRevenue[product].quantity += quantity;
            productRevenue[product].revenue += revenue;
        }
    });
    
    // Filter products with sales
    const productsWithSales = Object.entries(productRevenue)
        .filter(([_, data]) => data.quantity > 0 || data.revenue > 0)
        .map(([product, data]) => ({product, ...data}));
    
    // Calculate location totals
    const locationTotals = {
        quantity: productsWithSales.reduce((sum, item) => sum + item.quantity, 0),
        revenue: productsWithSales.reduce((sum, item) => sum + item.revenue, 0)
    };
    
    let html = `
        <div class="location-report">
            <div class="location-header">
                <h4>📍 ${location.name}</h4>
                <p class="location-coords">Coordinates: ${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}</p>
            </div>
            
            <table class="location-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity Sold</th>
                        <th>Unit Price (€)</th>
                        <th>Revenue (€)</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    if (productsWithSales.length === 0) {
        html += `
            <tr>
                <td colspan="4" class="empty-message">No sales for this location</td>
            </tr>
        `;
    } else {
        productsWithSales.forEach(item => {
            html += `
                <tr>
                    <td>${item.product}</td>
                    <td>${item.quantity}</td>
                    <td>€${item.price.toFixed(2)}</td>
                    <td>€${item.revenue.toFixed(2)}</td>
                </tr>
            `;
        });
    }
    
    html += `
                    <tr class="location-totals">
                        <td><strong>Location Total</strong></td>
                        <td><strong>${locationTotals.quantity}</strong></td>
                        <td></td>
                        <td><strong>€${locationTotals.revenue.toFixed(2)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

function generateGrandTotals() {
    // Calculate totals across all locations
    let grandTotals = {
        quantity: 0,
        revenue: 0,
        locations: shop.locations.length,
        products: shop.products.length,
        productsWithSales: 0,
        avgRevenuePerLocation: 0,
        avgRevenuePerProduct: 0
    };
    
    const productTotals = {};
    
    shop.locations.forEach(location => {
        let locationRevenue = 0;
        
        location.sales.forEach(sale => {
            const product = sale[0];
            const quantity = sale[1];
            const price = shop.prices[product] || 0;
            const revenue = price * quantity;
            
            grandTotals.quantity += quantity;
            grandTotals.revenue += revenue;
            locationRevenue += revenue;
            
            if (!productTotals[product]) {
                productTotals[product] = {
                    quantity: 0,
                    revenue: 0
                };
            }
            productTotals[product].quantity += quantity;
            productTotals[product].revenue += revenue;
        });
    });
    
    grandTotals.productsWithSales = Object.keys(productTotals).length;
    grandTotals.avgRevenuePerLocation = shop.locations.length > 0 
        ? grandTotals.revenue / shop.locations.length 
        : 0;
    grandTotals.avgRevenuePerProduct = grandTotals.productsWithSales > 0 
        ? grandTotals.revenue / grandTotals.productsWithSales 
        : 0;
    
    let html = `
        <div class="grand-totals-section">
            <h3>📊 Grand Totals - All Locations Combined</h3>
            
            <div class="totals-grid">
                <div class="total-card">
                    <div class="total-label">Total Quantity Sold</div>
                    <div class="total-value">${grandTotals.quantity} units</div>
                </div>
                
                <div class="total-card">
                    <div class="total-label">Total Revenue</div>
                    <div class="total-value">€${grandTotals.revenue.toFixed(2)}</div>
                </div>
                
                <div class="total-card">
                    <div class="total-label">Number of Locations</div>
                    <div class="total-value">${grandTotals.locations}</div>
                </div>
                
                <div class="total-card">
                    <div class="total-label">Products with Sales</div>
                    <div class="total-value">${grandTotals.productsWithSales}</div>
                </div>
                
                <div class="total-card">
                    <div class="total-label">Avg Revenue per Location</div>
                    <div class="total-value">€${grandTotals.avgRevenuePerLocation.toFixed(2)}</div>
                </div>
                
                <div class="total-card">
                    <div class="total-label">Avg Revenue per Product</div>
                    <div class="total-value">€${grandTotals.avgRevenuePerProduct.toFixed(2)}</div>
                </div>
            </div>
            
            <h4 style="margin-top: 30px; color: #333;">Revenue by Product (All Locations)</h4>
            
            <table class="product-totals-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Total Quantity</th>
                        <th>Total Revenue (€)</th>
                        <th>% of Total</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Sort products by revenue descending
    const sortedProducts = Object.entries(productTotals)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .map(([product, data]) => ({product, ...data}));
    
    sortedProducts.forEach(item => {
        const percentage = grandTotals.revenue > 0 
            ? ((item.revenue / grandTotals.revenue) * 100).toFixed(1) 
            : 0;
        
        html += `
            <tr>
                <td><strong>${item.product}</strong></td>
                <td>${item.quantity}</td>
                <td>€${item.revenue.toFixed(2)}</td>
                <td>${percentage}%</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

function exportReportData() {
    let csv = 'Location,Product,Quantity,Unit Price,Revenue\n';
    
    // Add data for each location
    shop.locations.forEach(location => {
        const productsInLocation = {};
        
        location.sales.forEach(sale => {
            const product = sale[0];
            const quantity = sale[1];
            const price = shop.prices[product] || 0;
            const revenue = price * quantity;
            
            if (!productsInLocation[product]) {
                productsInLocation[product] = { quantity: 0, price, revenue: 0 };
            }
            productsInLocation[product].quantity += quantity;
            productsInLocation[product].revenue += revenue;
        });
        
        if (Object.keys(productsInLocation).length === 0) {
            csv += `${location.name},No sales,0,0,0\n`;
        } else {
            Object.entries(productsInLocation).forEach(([product, data]) => {
                csv += `${location.name},${product},${data.quantity},${data.price.toFixed(2)},${data.revenue.toFixed(2)}\n`;
            });
        }
        
        // Add location total
        const locTotal = Object.values(productsInLocation).reduce((sum, d) => sum + d.revenue, 0);
        csv += `${location.name},SUBTOTAL,,${locTotal.toFixed(2)},\n`;
        csv += '\n';
    });
    
    // Add grand totals
    const grandRevenue = shop.locations.reduce((sum, loc) => {
        return sum + loc.sales.reduce((locSum, sale) => {
            const price = shop.prices[sale[0]] || 0;
            return locSum + (price * sale[1]);
        }, 0);
    }, 0);
    
    const grandQuantity = shop.locations.reduce((sum, loc) => {
        return sum + loc.sales.reduce((locSum, sale) => locSum + sale[1], 0);
    }, 0);
    
    csv += `GRAND TOTAL,,${grandQuantity},,€${grandRevenue.toFixed(2)}\n`;
    
    // Download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    showMessage('Report exported to CSV', 'success');
}

function printReport() {
    window.print();
}
