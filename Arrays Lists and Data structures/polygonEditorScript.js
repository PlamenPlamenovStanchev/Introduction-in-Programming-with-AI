// Initialize map centered on Pleven, Bulgaria
const pLevenLat = 43.4213;
const pLevenLng = 24.6116;

const map = L.map('map').setView([pLevenLat, pLevenLng], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

let polygonPoints = [];
let testPoints = [];
let currentTab = 'polygon';
let polygonMarkerGroup = L.featureGroup().addTo(map);
let testPointMarkerGroup = L.featureGroup().addTo(map);
let polygon = null;

// Switch between tabs
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(el => el.classList.remove('active'));
    
    if (tab === 'polygon') {
        document.getElementById('polygonTab').classList.add('active');
        document.querySelector('[onclick="switchTab(\'polygon\')"]').classList.add('active');
        map.off('click');
        map.on('click', addPolygonPoint);
    } else {
        document.getElementById('testPointsTab').classList.add('active');
        document.querySelector('[onclick="switchTab(\'testPoints\')"]').classList.add('active');
        map.off('click');
        map.on('click', addTestPoint);
    }
}

// Add polygon point
function addPolygonPoint(e) {
    const lat = e.latlng.lat.toFixed(4);
    const lng = e.latlng.lng.toFixed(4);
    
    polygonPoints.push({lat: parseFloat(lat), lng: parseFloat(lng)});
    updatePolygonTable();
    updatePolygonVisualization();
    updateTestPointsVisualization();
    updatePolygonStatus();
}

// Add test point
function addTestPoint(e) {
    const lat = e.latlng.lat.toFixed(4);
    const lng = e.latlng.lng.toFixed(4);
    
    testPoints.push({lat: parseFloat(lat), lng: parseFloat(lng)});
    updateTestPointsTable();
    updateTestPointsVisualization();
    updateTestPointsStatus();
}

// Point in polygon algorithm (ray casting)
function isPointInPolygon(point, polygon) {
    if (polygon.length < 3) return false;
    
    let x = point.lat, y = point.lng;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].lat, yi = polygon[i].lng;
        let xj = polygon[j].lat, yj = polygon[j].lng;

        let intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

// Update polygon visualization
function updatePolygonVisualization() {
    polygonMarkerGroup.clearLayers();

    polygonPoints.forEach((point, idx) => {
        const marker = L.circleMarker([point.lat, point.lng], {
            radius: 8,
            fillColor: '#667eea',
            color: '#764ba2',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(polygonMarkerGroup);

        marker.bindPopup(`<b>Polygon Point ${idx + 1}</b><br>Lat: ${point.lat}<br>Lng: ${point.lng}`);
    });

    if (polygon) {
        map.removeLayer(polygon);
    }

    if (polygonPoints.length >= 3) {
        polygon = L.polygon(
            polygonPoints.map(p => [p.lat, p.lng]),
            {
                color: '#667eea',
                weight: 2,
                opacity: 1,
                fillColor: '#667eea',
                fillOpacity: 0.3
            }
        ).addTo(map);
    }
}

// Update test points visualization
function updateTestPointsVisualization() {
    testPointMarkerGroup.clearLayers();

    testPoints.forEach((point, idx) => {
        const isInside = isPointInPolygon(point, polygonPoints);
        const color = isInside ? '#27ae60' : '#e74c3c';
        const borderColor = isInside ? '#229954' : '#c0392b';

        const marker = L.circleMarker([point.lat, point.lng], {
            radius: 6,
            fillColor: color,
            color: borderColor,
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(testPointMarkerGroup);

        const status = isInside ? 'Inside' : 'Outside';
        marker.bindPopup(`<b>Test Point ${idx + 1}</b><br>${status}<br>Lat: ${point.lat}<br>Lng: ${point.lng}`);
    });
}

function updatePolygonTable() {
    const tbody = document.getElementById('polygonBody');
    
    if (polygonPoints.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-message">No points added yet</td></tr>';
        return;
    }

    tbody.innerHTML = polygonPoints.map((point, idx) => `
        <tr>
            <td class="point-index">${idx + 1}</td>
            <td>${point.lat}</td>
            <td>${point.lng}</td>
            <td>
                <button class="arrow" onclick="movePolygonUp(${idx})" ${idx === 0 ? 'disabled' : ''}>↑</button>
                <button class="arrow" onclick="movePolygonDown(${idx})" ${idx === polygonPoints.length - 1 ? 'disabled' : ''}>↓</button>
                <button class="remove" onclick="removePolygonPoint(${idx})">✕</button>
            </td>
        </tr>
    `).join('');
}

function updateTestPointsTable() {
    const tbody = document.getElementById('testPointsBody');
    
    if (testPoints.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-message">No test points added yet</td></tr>';
        return;
    }

    tbody.innerHTML = testPoints.map((point, idx) => {
        const isInside = isPointInPolygon(point, polygonPoints);
        const statusClass = isInside ? 'inside' : 'outside';
        const statusText = isInside ? 'In' : 'Out';
        
        return `
            <tr>
                <td class="point-index">${idx + 1}</td>
                <td><span class="point-status ${statusClass}"></span>${statusText}</td>
                <td>${point.lat}</td>
                <td>${point.lng}</td>
                <td><button class="remove" onclick="removeTestPoint(${idx})">✕</button></td>
            </tr>
        `;
    }).join('');
}

function removePolygonPoint(idx) {
    if (confirm(`Remove polygon point ${idx + 1}?`)) {
        polygonPoints.splice(idx, 1);
        updatePolygonTable();
        updatePolygonVisualization();
        updateTestPointsTable();
        updateTestPointsVisualization();
        updatePolygonStatus();
    }
}

function removeTestPoint(idx) {
    if (confirm(`Remove test point ${idx + 1}?`)) {
        testPoints.splice(idx, 1);
        updateTestPointsTable();
        updateTestPointsVisualization();
        updateTestPointsStatus();
    }
}

function movePolygonUp(idx) {
    if (idx > 0) {
        [polygonPoints[idx], polygonPoints[idx - 1]] = [polygonPoints[idx - 1], polygonPoints[idx]];
        updatePolygonTable();
        updatePolygonVisualization();
    }
}

function movePolygonDown(idx) {
    if (idx < polygonPoints.length - 1) {
        [polygonPoints[idx], polygonPoints[idx + 1]] = [polygonPoints[idx + 1], polygonPoints[idx]];
        updatePolygonTable();
        updatePolygonVisualization();
    }
}

function viewPolygonAsArray() {
    const jsonOutput = document.getElementById('jsonOutput');
    jsonOutput.textContent = JSON.stringify(polygonPoints, null, 2);
    document.getElementById('jsonModal').classList.add('show');
}

function closeJsonModal() {
    document.getElementById('jsonModal').classList.remove('show');
}

function copyToClipboard() {
    const text = JSON.stringify(polygonPoints, null, 2);
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

function clearPolygon() {
    if (polygonPoints.length === 0) {
        alert('No polygon points to clear');
        return;
    }

    if (confirm('Clear all polygon points?')) {
        polygonPoints = [];
        updatePolygonTable();
        updatePolygonVisualization();
        updateTestPointsTable();
        updateTestPointsVisualization();
        updatePolygonStatus();
    }
}

function clearTestPoints() {
    if (testPoints.length === 0) {
        alert('No test points to clear');
        return;
    }

    if (confirm('Clear all test points?')) {
        testPoints = [];
        updateTestPointsTable();
        updateTestPointsVisualization();
        updateTestPointsStatus();
    }
}

function updatePolygonStatus() {
    document.getElementById('polygonStatus').textContent = `Points: ${polygonPoints.length}`;
}

function updateTestPointsStatus() {
    const inside = testPoints.filter(p => isPointInPolygon(p, polygonPoints)).length;
    const outside = testPoints.length - inside;
    document.getElementById('testPointsStatus').textContent = `Points: ${testPoints.length} (Inside: ${inside}, Outside: ${outside})`;
}

// Initial setup
switchTab('polygon');
updatePolygonTable();
updatePolygonStatus();
