function calcEnergy(slots) {
  // Helper: Convert "hh:mm" to minutes from start of 48h period
  function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Helper: Convert minutes to "hh:mm" format
  function minutesToTime(mins) {
    // Handle minutes that wrap around (for 48h period)
    mins = mins % (24 * 60);
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Helper: Calculate duration in minutes (handling overnight)
  function getDurationMinutes(startMin, endMin) {
    if (endMin <= startMin) {
      // Spans midnight
      return (24 * 60 - startMin) + endMin;
    }
    return endMin - startMin;
  }

  // Helper: Format duration as "hh:mm"
  function formatDuration(durationMins) {
    const hours = Math.floor(durationMins / 60);
    const minutes = durationMins % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Parse input slots
  const powerSlots = slots.map(slot => {
    const match = slot.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*->\s*([\d.]+)\s*kW/);
    return {
      start: timeToMinutes(match[1]),
      end: timeToMinutes(match[2]),
      power: parseFloat(match[3])
    };
  });

  // Collect all unique time points
  const timePoints = new Set();
  for (const slot of powerSlots) {
    timePoints.add(slot.start);
    // Handle end time - if it's before start, it's next day
    if (slot.end <= slot.start) {
      timePoints.add(slot.end + 24 * 60); // Add as next day
    } else {
      timePoints.add(slot.end);
    }
  }

  // Sort time points
  const sortedPoints = Array.from(timePoints).sort((a, b) => a - b);

  // Build intervals and calculate power for each
  const intervals = [];
  
  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const intervalStart = sortedPoints[i];
    const intervalEnd = sortedPoints[i + 1];
    
    // Calculate total power for this interval
    let totalPower = 0;
    for (const slot of powerSlots) {
      let slotStart = slot.start;
      let slotEnd = slot.end;
      
      // Handle overnight slots
      if (slotEnd <= slotStart) {
        slotEnd += 24 * 60;
      }
      
      // Check if this slot covers this interval
      if (slotStart <= intervalStart && slotEnd >= intervalEnd) {
        totalPower += slot.power;
      }
    }
    
    if (totalPower > 0) {
      intervals.push({
        start: intervalStart,
        end: intervalEnd,
        power: Math.round(totalPower * 100) / 100
      });
    }
  }

  // Merge consecutive intervals with the same power
  const mergedIntervals = [];
  for (const interval of intervals) {
    const last = mergedIntervals[mergedIntervals.length - 1];
    if (last && last.end === interval.start && last.power === interval.power) {
      // Merge with previous interval
      last.end = interval.end;
    } else {
      mergedIntervals.push({ ...interval });
    }
  }

  // Build energy consumption table
  const energyConsumptionTable = mergedIntervals.map(interval => {
    const durationMins = interval.end - interval.start;
    const durationHours = durationMins / 60;
    const energy = Math.round(interval.power * durationHours * 100) / 100;
    
    return {
      startHour: minutesToTime(interval.start),
      endHour: minutesToTime(interval.end),
      duration: formatDuration(durationMins),
      power: interval.power,
      energy: energy
    };
  });

  // Find peak power interval (highest power, earliest if tie)
  let peakInterval = mergedIntervals[0];
  for (const interval of mergedIntervals) {
    if (interval.power > peakInterval.power || 
        (interval.power === peakInterval.power && interval.start < peakInterval.start)) {
      peakInterval = interval;
    }
  }

  const peakDurationMins = peakInterval.end - peakInterval.start;
  const peakDurationHours = peakDurationMins / 60;
  const peakEnergy = Math.round(peakInterval.power * peakDurationHours * 100) / 100;

  const peakPower = {
    startHour: minutesToTime(peakInterval.start),
    endHour: minutesToTime(peakInterval.end),
    duration: formatDuration(peakDurationMins),
    power: peakInterval.power,
    energy: peakEnergy
  };

  return {
    energyConsumptionTable,
    peakPower
  };
}

// Test case
console.log(calcEnergy([
  "15:00 - 18:00 -> 5.1 kW",
  "0:30 - 22:30 -> 3 kW",
  "11:00 - 14:00 -> 4.3 kW",
  "21:00 - 06:00 -> 0.6 kW",
  "14:20 - 16:40 -> 2 kW",
  "9:30 - 11:45 -> 2.5 kW"
]));
