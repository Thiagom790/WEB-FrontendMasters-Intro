const screen = document.querySelector(".screen");

const initState = {
  displayValue: "0",
  clearDisplay: false,
  operator: null,
  values: [0, 0],
  currentIndex: 0,
};

let currentState = { ...initState };

const setState = (newState, rerender) => {
  currentState = { ...currentState, ...newState };
  if (rerender) screen.innerText = currentState.displayValue;
};

const clearMemory = () => setState({ ...initState }, true);

const wipeDigit = () => {
  let { displayValue } = currentState;
  const displayLenght = displayValue.length;
  displayValue =
    displayLenght === 1 ? "0" : displayValue.slice(0, displayLenght - 1);

  setState({ displayValue }, true);
};

const setOperation = (operator) => {
  let { currentIndex, values } = currentState;
  if (currentIndex === 0) {
    currentIndex++;
    setState({ currentIndex, operator, clearDisplay: true });
    return;
  }

  const equals = operator === "=";
  const currentOperator = currentState.operator;

  values[0] = eval(`${values[0]} ${currentOperator} ${values[1]}`);
  values[1] = 0;

  setState(
    {
      displayValue: values[0],
      clearDisplay: !equals,
      operator: equals ? null : operator,
      values,
      currentIndex: equals ? 0 : 1,
    },
    true
  );
};

const addDigit = (digit) => {
  if (digit === "." && currentState.displayValue.includes(".")) {
    return;
  }

  const isClearDisplay =
    currentState.displayValue === "0" || currentState.clearDisplay;
  const currentValue = isClearDisplay ? "" : currentState.displayValue;
  const displayValue = currentValue + digit;
  setState({ displayValue, clearDisplay: false }, true);

  if (digit !== ".") {
    const { currentIndex, values } = currentState;
    values[currentIndex] = parseFloat(displayValue);
    setState({ values });
  }
};

const handleButton = (value) => {
  const isSymbol = isNaN(parseInt(value)) && value !== ".";
  if (!isSymbol) {
    addDigit(value);
  } else if (value === "c") {
    clearMemory();
  } else if (value === "←") {
    wipeDigit();
  } else {
    const symbols = {
      "÷": "/",
      "×": "*",
      "-": "-",
      "+": "+",
    };
    setOperation(symbols[value]);
  }
};

document
  .querySelector(".calc-buttons")
  .addEventListener("click", (e) => handleButton(e.target.innerText));
