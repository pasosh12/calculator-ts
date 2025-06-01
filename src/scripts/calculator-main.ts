import { CalculatorReceiver } from "./calculator-receiver";
import { DigitCommand } from "./commands/digit-command";
import { DecimalCommand } from "./commands/decimal-command";
import { OperatorCommand } from "./commands/operator-command";
import { SingleOperandCommand } from "./commands/single-operand-command";
import { ResultCommand } from "./commands/result-command";
import { ClearCommand } from "./commands/clear-command";
import { ToggleSignCommand } from "./commands/toggle-sign-command";
import { DeleteLastDigitCommand } from "./commands/delete-last-digit-command";
import { PercentageCommand } from "./commands/percentage-command";
import "../scripts/ThemeToggle"; 

const display = document.querySelector(".display") as HTMLElement | null;
const buttons = document.querySelectorAll(".buttons button");
const receiver = new CalculatorReceiver(display);

const doubleOperandOperators = ["+", "-", "×", "÷", "y√x", "xy"];
const singleOperandOperators = [
  "mc",
  "m+",
  "m-",
  "mr",
  "2nd",
  "x2",
  "x3",
  "ex",
  "10x",
  "1/x",
  "√x",
  "3√x",
  "ln",
  "log10",
  "x!",
  "sin",
  "cos",
  "tan",
  "e",
  "EE",
  "Rad",
  "sinh",
  "cosh",
  "tanh",
  "π",
  "Rand",
];

function handleButtonClick(event: Event) {
  const button = event.target as HTMLElement;
  const buttonValue = button.textContent?.trim() || "";
  if (!isNaN(Number(buttonValue))) {
    new DigitCommand(buttonValue, receiver).execute();
  } else if ([",", "."].includes(buttonValue)) {
    new DecimalCommand(receiver).execute();
  } else if (doubleOperandOperators.includes(buttonValue)) {
    new OperatorCommand(buttonValue, receiver).execute();
  } else if (singleOperandOperators.includes(buttonValue)) {
    new SingleOperandCommand(buttonValue, receiver).execute();
  } else if (buttonValue === "=") {
    new ResultCommand(receiver).execute();
  } else if (buttonValue === "AC") {
    new ClearCommand(receiver).execute();
  } else if (buttonValue === "±") {
    new ToggleSignCommand(receiver).execute();
  } else if (buttonValue === "%") {
    new PercentageCommand(receiver).execute();
  }
}

function handleKeyboardInput(event: KeyboardEvent) {
  const key = event.key;
  if (!isNaN(Number(key))) {
    new DigitCommand(key, receiver).execute();
  } else if (["+", "-", "*", "/"].includes(key)) {
    new OperatorCommand(convertOperator(key), receiver).execute();
  } else if ([",", "."].includes(key)) {
    new DecimalCommand(receiver).execute();
  } else if (key === "Enter" || key === "=") {
    new ResultCommand(receiver).execute();
  } else if (key === "Escape" || key === "Delete") {
    new ClearCommand(receiver).execute();
  } else if (key === "Backspace") {
    new DeleteLastDigitCommand(receiver).execute();
  }
}

function convertOperator(key: string): string {
  switch (key) {
    case "/":
      return "÷";
    case "*":
      return "×";
    default:
      return key;
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});
document.addEventListener("keydown", handleKeyboardInput);
