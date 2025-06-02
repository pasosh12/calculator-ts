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
import { CalculatorInvoker } from "./invoker/calculator-invoker";
import "../scripts/ThemeToggle";

const display = document.querySelector(".display") as HTMLElement | null;
const buttons = document.querySelectorAll(".buttons button");
const receiver = new CalculatorReceiver(display);
const invoker = new CalculatorInvoker();

const doubleOperandOperators = ["+", "-", "×", "÷", "y√x", "xy", "EE"];
const singleOperandOperators = [ 
  "mc",  "m+",  "m-",  "mr", 
  "x2",  "x3",  "ex",  "10x",  "1/x",  "√x",  "3√x",
  "ln",  "log10",  "x!",  "sin",  "cos",  "tan",  "e",
  "Rad",  "sinh",  "cosh",  "tanh",  "π",
];

function handleButtonClick(event: Event) {
  const button = event.target as HTMLElement;
  const buttonValue = button.textContent?.trim() || "";
  if (!isNaN(Number(buttonValue))) {
    invoker.executeCommand(new DigitCommand(buttonValue, receiver));
  } else if ([",", "."].includes(buttonValue)) {
    invoker.executeCommand(new DecimalCommand(receiver));
  } else if (doubleOperandOperators.includes(buttonValue)) {
    invoker.executeCommand(new OperatorCommand(buttonValue, receiver));
  } else if (singleOperandOperators.includes(buttonValue)) {
    invoker.executeCommand(new SingleOperandCommand(buttonValue, receiver));
  } else if (buttonValue === "=") {
    invoker.executeCommand(new ResultCommand(receiver));
  } else if (buttonValue === "AC") {
    invoker.executeCommand(new ClearCommand(receiver));
  } else if (buttonValue === "±") {
    invoker.executeCommand(new ToggleSignCommand(receiver));
  } else if (buttonValue === "%") {
    invoker.executeCommand(new PercentageCommand(receiver));
  }
}

function handleKeyboardInput(event: KeyboardEvent) {
  const key = event.key;
  if (!isNaN(Number(key))) {
    invoker.executeCommand(new DigitCommand(key, receiver));
  } else if (["+", "-", "*", "/"].includes(key)) {
    invoker.executeCommand(new OperatorCommand(convertOperator(key), receiver));
  } else if ([",", "."].includes(key)) {
    invoker.executeCommand(new DecimalCommand(receiver));
  } else if (key === "Enter" || key === "=") {
    invoker.executeCommand(new ResultCommand(receiver));
  } else if (key === "Escape" || key === "Delete") {
    invoker.executeCommand(new ClearCommand(receiver));
  } else if (key === "Backspace") {
    invoker.executeCommand(new DeleteLastDigitCommand(receiver));
  }
}

function convertOperator(key: string): string {
  switch (key) {
    case "/":
      return "÷";
    case "*":
      return "×";
      case 'ex':
        return "e^x";
    default:
      return key;
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});
document.addEventListener("keydown", handleKeyboardInput);
