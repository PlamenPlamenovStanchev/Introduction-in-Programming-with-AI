// Web Application for Unit Converter
// Converter logic for browser compatibility

// Metric converter logic
const METRIC_CONVERSION_TO_METERS = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.34
};

// Weight converter logic
const WEIGHT_CONVERSION_TO_GRAMS = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  t: 1000000,
  lb: 453.592,
  oz: 28.3495
};

// Temperature converter logic - using Celsius as intermediate
function convertTemperature(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;
  
  // Convert to Celsius first
  let valueInCelsius;
  switch (fromUnit) {
    case 'cel':
      valueInCelsius = value;
      break;
    case 'fah':
      valueInCelsius = (value - 32) * 5 / 9;
      break;
    case 'kel':
      valueInCelsius = value - 273.15;
      break;
    default:
      throw new Error(`Unsupported temperature unit: ${fromUnit}`);
  }
  
  // Convert from Celsius to target unit
  let result;
  switch (toUnit) {
    case 'cel':
      result = valueInCelsius;
      break;
    case 'fah':
      result = valueInCelsius * 9 / 5 + 32;
      break;
    case 'kel':
      result = valueInCelsius + 273.15;
      break;
    default:
      throw new Error(`Unsupported temperature unit: ${toUnit}`);
  }
  
  return result;
}

// Main converter function
function convertUnits(value, fromUnit, toUnit) {
  // Determine converter type based on unit
  let converterMap = {
    ...Object.keys(METRIC_CONVERSION_TO_METERS).reduce((acc, unit) => ({...acc, [unit]: 'metric'}), {}),
    ...Object.keys(WEIGHT_CONVERSION_TO_GRAMS).reduce((acc, unit) => ({...acc, [unit]: 'weight'}), {}),
    'cel': 'temperature', 'fah': 'temperature', 'kel': 'temperature'
  };
  
  const fromType = converterMap[fromUnit];
  const toType = converterMap[toUnit];
  
  if (!fromType) throw new Error(`Unit '${fromUnit}' is not supported`);
  if (!toType) throw new Error(`Unit '${toUnit}' is not supported`);
  if (fromType !== toType) throw new Error(`Cannot convert between '${fromUnit}' and '${toUnit}'. They belong to different unit categories.`);
  
  switch (fromType) {
    case 'metric':
      const valueInMeters = value * METRIC_CONVERSION_TO_METERS[fromUnit];
      return valueInMeters / METRIC_CONVERSION_TO_METERS[toUnit];
    
    case 'weight':
      const valueInGrams = value * WEIGHT_CONVERSION_TO_GRAMS[fromUnit];
      return valueInGrams / WEIGHT_CONVERSION_TO_GRAMS[toUnit];
    
    case 'temperature':
      return convertTemperature(value, fromUnit, toUnit);
    
    default:
      throw new Error(`Unknown converter type: ${fromType}`);
  }
}

// Converter data structure
const converters = {
    metric: {
        inputSelector: '#metric-input',
        outputSelector: '#metric-output',
        fromUnitSelector: '#metric-from-unit',
        toUnitSelector: '#metric-to-unit',
        resultInfoSelector: '#metric-result-info',
        swapButtonSelector: '#metric-swap'
    },
    weight: {
        inputSelector: '#weight-input',
        outputSelector: '#weight-output',
        fromUnitSelector: '#weight-from-unit',
        toUnitSelector: '#weight-to-unit',
        resultInfoSelector: '#weight-result-info',
        swapButtonSelector: '#weight-swap'
    },
    temperature: {
        inputSelector: '#temperature-input',
        outputSelector: '#temperature-output',
        fromUnitSelector: '#temperature-from-unit',
        toUnitSelector: '#temperature-to-unit',
        resultInfoSelector: '#temperature-result-info',
        swapButtonSelector: '#temperature-swap'
    }
};

/**
 * Perform the conversion and update the output
 * @param {string} converterType - Type of converter (metric, weight, temperature)
 */
function performConversion(converterType) {
    const config = converters[converterType];
    const inputElement = document.querySelector(config.inputSelector);
    const outputElement = document.querySelector(config.outputSelector);
    const fromUnitElement = document.querySelector(config.fromUnitSelector);
    const toUnitElement = document.querySelector(config.toUnitSelector);
    const resultInfoElement = document.querySelector(config.resultInfoSelector);

    const value = parseFloat(inputElement.value);
    const fromUnit = fromUnitElement.value;
    const toUnit = toUnitElement.value;

    // Clear previous error state
    resultInfoElement.classList.remove('error');

    // Validate input
    if (isNaN(value) || value === '') {
        outputElement.value = '';
        resultInfoElement.textContent = '';
        return;
    }

    try {
        const result = convertUnits(value, fromUnit, toUnit);
        
        // Format the result based on the value size
        let formattedResult;
        if (Math.abs(result) < 0.01 && result !== 0) {
            formattedResult = result.toExponential(6);
        } else if (Math.abs(result) > 1000000) {
            formattedResult = result.toExponential(6);
        } else {
            formattedResult = result.toFixed(6).replace(/\.?0+$/, '');
        }

        outputElement.value = formattedResult;
        
        // Display conversion info
        resultInfoElement.textContent = `✓ ${value} ${fromUnit} = ${formattedResult} ${toUnit}`;
        resultInfoElement.classList.remove('error');
    } catch (error) {
        outputElement.value = '';
        resultInfoElement.textContent = `✗ Error: ${error.message}`;
        resultInfoElement.classList.add('error');
    }
}

/**
 * Swap the from and to units
 * @param {string} converterType - Type of converter
 */
function swapUnits(converterType) {
    const config = converters[converterType];
    const fromUnitElement = document.querySelector(config.fromUnitSelector);
    const toUnitElement = document.querySelector(config.toUnitSelector);
    const inputElement = document.querySelector(config.inputSelector);
    const outputElement = document.querySelector(config.outputSelector);

    // Swap units
    [fromUnitElement.value, toUnitElement.value] = [toUnitElement.value, fromUnitElement.value];

    // Swap values if output has a value
    if (outputElement.value) {
        [inputElement.value, outputElement.value] = [outputElement.value, inputElement.value];
    }

    // Perform conversion
    performConversion(converterType);
}

/**
 * Initialize event listeners for a converter
 * @param {string} converterType - Type of converter
 */
function initializeConverter(converterType) {
    const config = converters[converterType];
    
    const inputElement = document.querySelector(config.inputSelector);
    const fromUnitElement = document.querySelector(config.fromUnitSelector);
    const toUnitElement = document.querySelector(config.toUnitSelector);
    const swapButton = document.querySelector(config.swapButtonSelector);

    // Add event listeners
    inputElement.addEventListener('input', () => performConversion(converterType));
    fromUnitElement.addEventListener('change', () => performConversion(converterType));
    toUnitElement.addEventListener('change', () => performConversion(converterType));
    swapButton.addEventListener('click', () => swapUnits(converterType));

    // Initial conversion
    performConversion(converterType);
}

/**
 * Initialize tab switching
 */
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('🚀 Initializing Unit Converter Web App...');
    
    // Initialize tab switching
    initializeTabs();
    
    // Initialize each converter
    Object.keys(converters).forEach(converterType => {
        initializeConverter(converterType);
    });
    
    console.log('✅ Unit Converter Web App initialized successfully!');
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
