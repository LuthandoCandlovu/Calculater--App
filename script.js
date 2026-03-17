const display = document.getElementById('display');
let firstOperand = null;
let currentOperator = null;
let shouldResetScreen = false;
let displayValue = '0';

function updateDisplay() {
    display.textContent = displayValue;
}

function resetState() {
    firstOperand = null;
    currentOperator = null;
    shouldResetScreen = false;
    displayValue = '0';
    updateDisplay();
}

function handleNumber(num) {
    if (shouldResetScreen) {
        displayValue = num;
        shouldResetScreen = false;
    } else if (displayValue === '0' || displayValue === 'Error') {
        displayValue = num;
    } else {
        if (displayValue.replace(/[^0-9]/g, '').length < 12) {
            displayValue += num;
        }
    }
    updateDisplay();
}

function handleDecimal() {
    if (shouldResetScreen || displayValue === 'Error') {
        displayValue = '0.';
        shouldResetScreen = false;
    } else if (!displayValue.includes('.')) {
        displayValue += '.';
    }
    updateDisplay();
}

function handleBackspace() {
    if (displayValue === 'Error') {
        resetState();
        return;
    }
    if (shouldResetScreen) return;
    displayValue = displayValue.length > 1 ? displayValue.slice(0, -1) : '0';
    updateDisplay();
}

function compute() {
    if (currentOperator === null || firstOperand === null) return;
    const prev = parseFloat(firstOperand);
    const current = parseFloat(displayValue);
    if (isNaN(prev) || isNaN(current)) return;
    let result;
    switch (currentOperator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/':
            if (current === 0) {
                displayValue = 'Error';
                updateDisplay();
                firstOperand = null;
                currentOperator = null;
                shouldResetScreen = true;
                return;
            }
            result = prev / current;
            break;
        default: return;
    }
    result = Math.round(result * 1e12) / 1e12;
    displayValue = result.toString();
    firstOperand = displayValue;
    currentOperator = null;
    shouldResetScreen = true;
    updateDisplay();
}

function handleOperator(op) {
    if (displayValue === 'Error') {
        resetState();
    }
    if (firstOperand === null) {
        firstOperand = displayValue;
        currentOperator = op;
        shouldResetScreen = true;
    } else if (currentOperator && !shouldResetScreen) {
        compute();
        currentOperator = op;
        shouldResetScreen = true;
    } else {
        currentOperator = op;
    }
}

function handleEquals() {
    if (displayValue === 'Error') {
        resetState();
        return;
    }
    if (currentOperator && firstOperand !== null && !shouldResetScreen) {
        compute();
    }
}

// Button event listeners
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const val = e.currentTarget.getAttribute('data-value');
        if (!val) return;
        if (val === 'C') resetState();
        else if (val === '⌫') handleBackspace();
        else if (val === '=') handleEquals();
        else if (val === '+' || val === '-' || val === '*' || val === '/') handleOperator(val);
        else if (val === '.') handleDecimal();
        else if (!isNaN(val) && val.trim() !== '') handleNumber(val);
    });
});

// Keyboard support
window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (!isNaN(key) && key !== ' ') {
        e.preventDefault();
        handleNumber(key);
    } else if (key === '.') {
        e.preventDefault();
        handleDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault();
        handleOperator(key === '*' ? '*' : key);  // '*' already correct
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        e.preventDefault();
        resetState();
    } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
    }
});

updateDisplay();
