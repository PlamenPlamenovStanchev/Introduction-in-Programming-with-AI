// Function to sum times in 24-hour format "hh:mm"
function sumTimes(h1, m1, h2, m2) {
    // Convert start time and interval to total minutes
    let startMinutes = h1 * 60 + m1;
    let addMinutes = h2 * 60 + m2;
    
    // Calculate result time in minutes (with wrap-around for 24-hour format)
    let resultMinutes = (startMinutes + addMinutes) % (24 * 60);
    
    // Convert back to hours and minutes
    let resultHours = Math.floor(resultMinutes / 60);
    let resultMins = resultMinutes % 60;
    
    // Format as hh:mm with leading zeros
    const formatTime = (h, m) => {
        return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    };
    
    const startTime = formatTime(h1, m1);
    const intervalTime = formatTime(h2, m2);
    const resultTime = formatTime(resultHours, resultMins);
    
    // Print to console
    console.log(`The time is ${startTime} now.`);
    console.log(`After ${intervalTime} the time will be ${resultTime}.`);
}

// Example usage
sumTimes(10, 30, 0, 5);