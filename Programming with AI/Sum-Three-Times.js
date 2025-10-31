// Function to sum three times in 24-hour format "hh:mm"
function sumThreeTimes(h1, m1, h2, m2, h3, m3) {
    // Convert all three times to total minutes
    let time1Minutes = h1 * 60 + m1;
    let time2Minutes = h2 * 60 + m2;
    let time3Minutes = h3 * 60 + m3;
    
    // Calculate result time in minutes (with wrap-around for 24-hour format)
    let resultMinutes = (time1Minutes + time2Minutes + time3Minutes) % (24 * 60);
    
    // Convert back to hours and minutes
    let resultHours = Math.floor(resultMinutes / 60);
    let resultMins = resultMinutes % 60;
    
    // Format as hh:mm with leading zeros
    const formatTime = (h, m) => {
        return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    };
    
    const firstTime = formatTime(h1, m1);
    const secondTime = formatTime(h2, m2);
    const thirdTime = formatTime(h3, m3);
    const resultTime = formatTime(resultHours, resultMins);
    
    // Print to console in format: hh:mm + hh:mm + hh:mm = hh:mm
    console.log(`${firstTime} + ${secondTime} + ${thirdTime} = ${resultTime}`);
}

// Example usage
sumThreeTimes(10, 30, 0, 5, 0, 2);
