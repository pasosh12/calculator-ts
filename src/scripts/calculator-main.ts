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

const doubleOperandOperators = ["+", "-", "×", "÷", "y√x", "xy", "EE"];
const singleOperandOperators = [ 
  "mc",
  "m+",
  "m-",
  "mr", 
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
  "Rad",
  "sinh",
  "cosh",
  "tanh",
];

function handleButtonClick(event: Event) {
  const button = event.target as HTMLElement;
  const buttonValue = button.textContent?.trim() || "";
  if (!isNaN(Number(buttonValue))) {
    new DigitCommand(buttonValue, receiver).execute();
  } else if ([",", "."].includes(buttonValue)) {
    new DecimalCommand(receiver).execute();
  } else if (buttonValue === "π") {
    // Специальная обработка для кнопки π
    handlePiButton(receiver);
  } else if (doubleOperandOperators.includes(buttonValue)) {
    new OperatorCommand(buttonValue, receiver).execute();
  } else if (singleOperandOperators.includes(buttonValue)) {
    // Проверяем, есть ли активный оператор и второй операнд
    // Если да, то применяем унарный оператор ко второму операнду
    if (receiver.operator && receiver.secondOperand) {
      // Преобразуем оператор для совместимости с реестром
      const op = convertOperator(buttonValue);
      receiver.applyUnaryToSecondOperand(op);
    } else {
      // Иначе используем стандартный унарный оператор
      new SingleOperandCommand(buttonValue, receiver).execute();
    }
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

function convertOperator(operator: string): string {
  switch(operator) {
    case "x²": return "x2";
    case "x³": return "x3";
    case "√x": return "√x";
    case "∛x": return "3√x";
    case "ex": return "ex";
    case "10x": return "10x";
    default: return operator;
  }
}

// Специальная функция для обработки кнопки π
function handlePiButton(calculator: CalculatorReceiver) {
  const piValue = Math.PI.toString();
  
  // Если есть активный оператор, значит π должно быть вторым операндом
  if (calculator.operator) {
    // Если secondOperand пуст, устанавливаем его равным π
    if (!calculator.secondOperand) {
      calculator.secondOperand = piValue;
    } else {
      // Иначе заменяем текущее значение на π (как при вводе цифры)
      calculator.secondOperand = piValue;
    }
    // Обновляем дисплей с учетом обоих операндов и оператора
    calculator.updateDisplay(`${calculator.firstOperand} ${calculator.operator} ${calculator.secondOperand}`);
  } else {
    // Если нет активного оператора, значит π должно быть первым операндом
    calculator.firstOperand = piValue;
    calculator.updateDisplay(calculator.firstOperand);
  }
}

// Функция для применения унарного оператора ко второму операнду (5+ln(10))
function applyUnaryToSecondOperand(calculator: CalculatorReceiver, operator: string) {
  // Если есть активный бинарный оператор и второй операнд
  if (calculator.operator && calculator.secondOperand) {
    // Получаем числовое значение второго операнда
    const value = parseFloat(calculator.secondOperand);
    
    // Получаем унарную команду
    const command = calculator.unaryOperatorRegistry.getOperator(operator);
    
    if (!command) {
      calculator.updateDisplay(`неизвестная команда`);
      return;
    }
    
    // Проверяем, можно ли выполнить вычисление
    if (command.canCalculate && !command.canCalculate(value)) {
      calculator.updateDisplay("Ошибка");
      return;
    }
    
    // Вычисляем результат унарной операции
    const result = command.calculate(value);
    
    // Форматируем результат и обновляем второй операнд
    if (result !== undefined && result !== null) {
      let formattedResult = result;
      
      if (typeof formattedResult === "number") {
        if (!Number.isInteger(formattedResult)) {
          formattedResult = parseFloat(formattedResult.toFixed(4));
        }
        calculator.secondOperand = formattedResult.toString();
      } else {
        calculator.secondOperand = String(formattedResult);
      }
      
      // Обновляем дисплей с новым значением второго операнда
      calculator.updateDisplay(`${calculator.firstOperand} ${calculator.operator} ${calculator.secondOperand}`);
    }
  } else {
    // Если нет активного оператора или второго операнда, используем стандартную обработку унарной операции
    calculator.executeOperation(operator);
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});
document.addEventListener("keydown", handleKeyboardInput);
