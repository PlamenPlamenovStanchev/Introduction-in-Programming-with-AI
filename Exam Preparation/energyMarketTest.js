// Test file for energy market
class EnergyPriceEntry {
  constructor(date, interval, price) {
    this.date = date;
    this.interval = interval;
    this.price = price;
  }

  startDateTime() {
    const minutes = (this.interval - 1) * 15;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${this.date} ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  endDateTime() {
    const minutes = this.interval * 15;
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    const date = this.date;
    return `${date} ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}

class MonthlyReportEntry {
  constructor(month, minPrice, maxPrice, avgPrice) {
    this.month = month;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.avgPrice = avgPrice;
  }
}

class EnergyPriceTable {
  constructor() {
    this.entries = [];
  }

  addEntry(entry) {
    this.entries.push(entry);
  }

  readFromCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split('|').map(p => p.trim());
      if (parts.length === 3) {
        const date = parts[0];
        const interval = parseInt(parts[1]);
        const price = parseFloat(parts[2]);
        this.addEntry(new EnergyPriceEntry(date, interval, price));
      }
    }
  }

  printAsCSV() {
    let csv = 'Date | Interval | Price\n';
    for (const entry of this.entries) {
      csv += `${entry.date} | ${entry.interval} | ${entry.price}\n`;
    }
    return csv;
  }

  monthlyReport() {
    const monthlyData = {};
    for (const entry of this.entries) {
      const month = parseInt(entry.date.split('-')[1]);
      if (!monthlyData[month]) {
        monthlyData[month] = [];
      }
      monthlyData[month].push(entry.price);
    }

    const report = [];
    for (let month = 1; month <= 12; month++) {
      if (monthlyData[month] && monthlyData[month].length > 0) {
        const prices = monthlyData[month];
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

        report.push(new MonthlyReportEntry(
          month,
          Math.round(minPrice * 100) / 100,
          Math.round(maxPrice * 100) / 100,
          Math.round(avgPrice * 100) / 100
        ));
      }
    }

    return report;
  }
}

function printMonthlyReport(csvText) {
  const table = new EnergyPriceTable();
  table.readFromCSV(csvText);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const report = table.monthlyReport();
  let output = '';

  for (const entry of report) {
    output += `# ${monthNames[entry.month - 1]}\n`;
    output += `Min price: ${entry.minPrice.toFixed(2)}\n`;
    output += `Max price: ${entry.maxPrice.toFixed(2)}\n`;
    output += `Avg price: ${entry.avgPrice.toFixed(2)}\n\n`;
  }

  return output.trim();
}

let pricesCSV = `Date | Interval | Price
2025-01-05 | 1 | 65.30
2025-01-05 | 2 | 64.80
2025-01-15 | 10 | 68.90
2025-01-15 | 11 | 69.50
2025-01-20 | 20 | 71.80
2025-03-10 | 10 | 70.40
2025-03-10 | 11 | 69.80
2025-03-25 | 25 | 75.20
2025-03-03 | 3 | 76.50
2025-03-10 | 12 | 74.30
2025-03-15 | 20 | 73.10
2025-06-25 | 50 | 75.30
2025-06-25 | 52 | 64.20
2025-07-03 | 8 | 82.10
2025-07-12 | 18 | 81.40
2025-07-21 | 35 | 80.20
2025-08-01 | 4 | 79.80
2025-08-10 | 14 | 78.60
2025-10-16 | 24 | 69.50
2025-10-25 | 42 | 70.20
2025-12-28 | 55 | 74.20
2025-12-05 | 9 | 75.90
2025-12-06 | 90 | 15.80
2025-12-06 | 91 | 16.00
2025-12-15 | 25 | 76.40
2025-12-24 | 44 | 77.60`;

console.log(printMonthlyReport(pricesCSV));
