function calcEnergyPrice(...slots) {
  // Tariff rates
  const DAY_RATE = 0.10;      // 6:00 - 22:00
  const NIGHT_RATE = 0.07;    // 22:00 - 6:00
  const PEAK_RATE = 0.12;     // 18:00 - 21:00

  function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  function calculatePriceForRange(startMin, endMin, kW) {
    let price = 0;

    for (let min = startMin; min < endMin; min++) {
      const hour = Math.floor(min / 60);
      
      let rate;
      if (hour >= 18 && hour < 21) {
        rate = PEAK_RATE;
      } else if (hour >= 6 && hour < 22) {
        rate = DAY_RATE;
      } else {
        rate = NIGHT_RATE;
      }

      price += (rate * kW) / 60;
    }

    return price;
  }

  let totalPrice = 0;

  // Process each slot
  for (const slot of slots) {
    const startMinutes = timeToMinutes(slot.start);
    const endMinutes = timeToMinutes(slot.end);
    
    let slotPrice = 0;

    // Handle slots that span midnight
    if (endMinutes <= startMinutes) {
      // Slot goes past midnight
      slotPrice += calculatePriceForRange(startMinutes, 24 * 60, slot.kW);
      slotPrice += calculatePriceForRange(0, endMinutes, slot.kW);
    } else {
      // Slot within same day
      slotPrice += calculatePriceForRange(startMinutes, endMinutes, slot.kW);
    }

    totalPrice += slotPrice;
  }

  return Math.round(totalPrice * 10000) / 10000;
}

// Test case
console.log(calcEnergyPrice(
  {start:"10:15", end:"12:40", kW: 1.5},
  {start:"20:30", end:"07:40", kW: 0.9},
  {start:"17:30", end:"18:45", kW: 2.2}
)); // Output: 1.4685
