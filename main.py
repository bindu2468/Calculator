from pyscript import document, when

# Find the display on the page
display = document.querySelector("#display")

# What's on screen, and the calculator's memory
current = "0"
previous = None      # the first number, e.g. "12"
operator = None      # the operator pressed, e.g. "+"
start_new = False    # True right after pressing an operator or =


def format_number(number):
    """Turn 5.0 into '5' and fix things like 0.30000000000000004."""
    number = round(number, 10)
    if number == int(number):
        return str(int(number))
    return str(number)


def calculate(a, b, op):
    x = float(a)     # turn text "12" into the number 12.0
    y = float(b)

    if op == "+":
        return format_number(x + y)
    if op == "−":
        return format_number(x - y)
    if op == "×":
        return format_number(x * y)
    if op == "%":
        return format_number(x % y)
    if op == "÷":
        if y == 0:
            return "Error"
        return format_number(x / y)


def add_digit(digit):
    global current, start_new
    if start_new or current == "0":
        current = digit
        start_new = False
    else:
        current = current + digit


def add_decimal():
    global current, start_new
    if start_new:
        current = "0."
        start_new = False
    elif "." not in current:
        current = current + "."


def choose_operator(op):
    global current, previous, operator, start_new
    # finish a pending calculation first: 2 + 3 × becomes 5 ×
    if operator is not None and not start_new:
        current = calculate(previous, current, operator)
    previous = current
    operator = op
    start_new = True


def equals():
    global current, previous, operator, start_new
    if operator is None:
        return
    current = calculate(previous, current, operator)
    previous = None
    operator = None
    start_new = True


def clear_all():
    global current, previous, operator, start_new
    current = "0"
    previous = None
    operator = None
    start_new = False


def backspace():
    global current
    if start_new:
        return
    if len(current) > 1:
        current = current[:-1]
    else:
        current = "0"


# Run this function whenever ANY button is clicked
@when("click", "button")
def on_click(event):
    button = event.target
    value = button.textContent

    if value in "0123456789":
        add_digit(value)
    elif value == ".":
        add_decimal()
    elif value in ["+", "−", "×", "÷"]:
        choose_operator(value)
    elif button.classList.contains("equal"):
        equals()
    elif button.classList.contains("clear"):
        clear_all()
    elif button.classList.contains("backspace"):
        backspace()

    display.textContent = current