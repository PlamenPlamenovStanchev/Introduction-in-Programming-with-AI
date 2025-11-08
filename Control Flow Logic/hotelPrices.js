function hotelPrice(startDate, endDate) {
    // Parse date in format dd-MMM-yyyy (e.g., "12-Feb-2026")
    function parseDate(dateString) {
        return new Date(dateString);
    }

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    // Validate date range
    if (end <= start) {
        return "Invalid period!";
    }

    // Calculate number of nights
    const numNights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Price table by season and room type
    const prices = {
        "Studio": {
            "lowSeason": 50.00,      // May, October
            "midSeason": 70.00,      // June, September
            "highSeason": 80.00,     // July, August
            "outOfSeason": 40.00     // November - April
        },
        "Apartment": {
            "lowSeason": 65.00,      // May, October
            "midSeason": 80.00,      // June, September
            "highSeason": 95.00,     // July, August
            "outOfSeason": 55.00     // November - April
        }
    };

    // Function to determine the season for a given month
    function getSeason(month) {
        // month is 0-indexed (0 = January, 11 = December)
        if (month === 4 || month === 9) {
            return "lowSeason";      // May (4), October (9)
        } else if (month === 5 || month === 8) {
            return "midSeason";      // June (5), September (8)
        } else if (month === 6 || month === 7) {
            return "highSeason";     // July (6), August (7)
        } else {
            return "outOfSeason";    // November - April (10, 11, 0, 1, 2, 3)
        }
    }

    // Calculate price for a specific room type with discounts
    function calculatePrice(roomType) {
        const month = start.getMonth();
        const season = getSeason(month);
        const pricePerNight = prices[roomType][season];

        // Calculate base total price
        let totalPrice = pricePerNight * numNights;

        // Calculate applicable discounts and apply the biggest one
        let maxDiscount = 0; // No discount = 0%

        if (roomType === "Studio") {
            // Studio discounts - find the maximum applicable discount
            if (numNights >= 14) {
                // 14+ nights with special monthly discounts
                if (month === 6 || month === 7) {
                    // July or August: 15% discount
                    maxDiscount = Math.max(maxDiscount, 0.15);
                } else if (month === 5 || month === 8) {
                    // June or September: 20% discount
                    maxDiscount = Math.max(maxDiscount, 0.20);
                } else {
                    // All other months: 30% discount
                    maxDiscount = Math.max(maxDiscount, 0.30);
                }
            } else if (numNights >= 7) {
                // 7+ nights: 5% discount (any month)
                maxDiscount = Math.max(maxDiscount, 0.05);
            }
        } else if (roomType === "Apartment") {
            // Apartment discounts - find the maximum applicable discount
            if (numNights >= 14) {
                // 14+ nights: 10% discount (regardless of month)
                maxDiscount = Math.max(maxDiscount, 0.10);
            } else if (numNights >= 7) {
                // 7+ nights in May-October: 5% discount
                if (month >= 4 && month <= 9) {
                    // May (4) to October (9)
                    maxDiscount = Math.max(maxDiscount, 0.05);
                }
            }
        }

        // Apply the biggest discount
        totalPrice *= (1 - maxDiscount);

        return totalPrice;
    }

    // Calculate prices for both room types
    const studioPrice = calculatePrice("Studio");
    const apartmentPrice = calculatePrice("Apartment");

    // Format output
    let output = `${numNights} nights\n`;
    output += `Studio price: ${studioPrice.toFixed(2)}\n`;
    output += `Apartment price: ${apartmentPrice.toFixed(2)}`;

    return output;
}

// Example usage
console.log(hotelPrice("12-Feb-2026", "14-Feb-2026"));

