function electricityPrice(hour, consumption) {
  let tariff = '';
  let rate = 0;

  // Peak tariff: 18:00 - 21:00 (0.12 EUR/kWh)
  if (hour >= 18 && hour < 21) {
    tariff = 'Peak tariff';
    rate = 0.12;
  }
  // Day tariff: 6:00 - 22:00 (0.10 EUR/kWh)
  // Note: Peak tariff takes precedence for 18:00-21:00
  else if (hour >= 6 && hour < 22) {
    tariff = 'Day tariff';
    rate = 0.10;
  }
  // Night tariff: 22:00 - 6:00 (0.07 EUR/kWh)
  else {
    tariff = 'Night tariff';
    rate = 0.07;
  }

  // Calculate the price
  const price = consumption * rate;

  // Output the result with 2 decimal places
  console.log(`${tariff}: ${price.toFixed(2)} EUR`);
}

// Test cases
electricityPrice(7, 1.8);      // Day tariff: 0.18 EUR
electricityPrice(20, 2.43);    // Peak tariff: 0.29 EUR
electricityPrice(22, 4.5);     // Night tariff: 0.32 EUR
