function calculateBMI(event) {
    event.preventDefault();

    // Get input values
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Get BMI category
    const category = getBMICategory(bmi);
    
    // Display result
    displayResult(bmi, category);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

function displayResult(bmi, category) {
    const resultDiv = document.getElementById('result');
    const bmiNumber = resultDiv.querySelector('.bmi-number');
    const bmiCategory = resultDiv.querySelector('.bmi-category');

    // Update values
    bmiNumber.textContent = bmi.toFixed(1);
    bmiCategory.textContent = `Category: ${category}`;

    // Add highlight class based on category
    const allMarkers = document.querySelectorAll('.scale-marker');
    allMarkers.forEach(marker => marker.classList.remove('active'));
    
    const categoryClass = category.toLowerCase();
    document.querySelector(`.scale-marker.${categoryClass}`).classList.add('active');

    // Show result with animation
    resultDiv.classList.add('show');

    // Add color animation based on category
    const colors = {
        'Underweight': '#ff6b6b',
        'Normal': '#51cf66',
        'Overweight': '#ffd43b',
        'Obese': '#ff922b'
    };
    
    bmiNumber.style.color = colors[category];
    
    // Add pulse animation
    bmiNumber.style.animation = 'none';
    bmiNumber.offsetHeight; // Trigger reflow
    bmiNumber.style.animation = 'pulse 1s ease-in-out';
}

// Add input validation
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        let value = parseFloat(this.value);
        let min = parseFloat(this.getAttribute('min'));
        let max = parseFloat(this.getAttribute('max'));
        
        if (value < min) this.value = min;
        if (value > max) this.value = max;
    });
});