// Find the display on the page
const display = document.getElementById("display");

// What's on screen right now
let current = "0";

// NEW: memory for calculations
let previous = null;     // the first number, e.g. "12"
let operator = null;     // the operator pressed, e.g. "+"
let startNew = false;    // true right after pressing an operator or =

// Show the current number on the display
function updateDisplay() {
    display.textContent = current;
}

// CHANGED: start a fresh number after an operator was pressed
function addDigit(digit) {
    if (startNew || current === "0") {
        current = digit;
        startNew = false;
    } else {
        current = current + digit;
    }
}

// CHANGED: same idea for the decimal point
function addDecimal() {
    if (startNew) {
        current = "0.";
        startNew = false;
    } else if (!current.includes(".")) {
        current = current + ".";
    }
}

// NEW: do the actual math
function calculate(a, b, op) {
    const x = parseFloat(a);   // turn text "12" into the number 12
    const y = parseFloat(b);

    let result;
    if (op === "+") result = x + y;
    if (op === "−") result = x - y;
    if (op === "×") result = x * y;
    if (op === "÷") {
        if (y === 0) return "Error";   // can't divide by zero
        result = x / y;
    }

    // fix floating-point mess like 0.1 + 0.2 = 0.30000000000000004
    return String(parseFloat(result.toFixed(10)));
}

// NEW: when an operator button is pressed
function chooseOperator(op) {
    // If there's already a pending calculation (like 2 + 3 then ×),
    // finish it first so 2 + 3 × becomes 5 ×
    if (operator !== null && !startNew) {
        current = calculate(previous, current, operator);
    }
    previous = current;   // save the first number
    operator = op;        // save the operator
    startNew = true;      // next digit begins the second number
}

// NEW: when = is pressed
function equals() {
    if (operator === null) return;   // nothing to calculate
    current = calculate(previous, current, operator);
    previous = null;
    operator = null;
    startNew = true;
}

// C: reset everything (CHANGED: also clears the memory)
function clearAll() {
    current = "0";
    previous = null;
    operator = null;
    startNew = false;
}

// X: delete the last character
function backspace() {
    if (startNew) return;   // don't delete a finished result
    if (current.length > 1) {
        current = current.slice(0, -1);
    } else {
        current = "0";
    }
}

// Listen for clicks on every button
const buttons = document.querySelectorAll("button");

buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        const value = button.textContent;

        if ("0123456789".includes(value)) {
            addDigit(value);
        } else if (value === ".") {
            addDecimal();
        } else if (["+", "−", "×", "÷"].includes(value)) {   // NEW
            chooseOperator(value);
        } else if (button.classList.contains("equal")) {      // NEW
            equals();
        } else if (button.classList.contains("clear")) {
            clearAll();
        } else if (button.classList.contains("backspace")) {
            backspace();
        }

        updateDisplay();
    });
});