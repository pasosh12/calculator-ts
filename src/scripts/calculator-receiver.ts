export class CalculatorReceiver {
  firstOperand: string = "";
  operator: string = "";
  secondOperand: string = "";
  shouldResetDisplay: boolean = false;
  memory: number = 0;
  display: HTMLElement | null;

  constructor(display: HTMLElement | null) {
    this.display = display;
  }

  updateDisplay(value: string) {
    if (this.display) {
      this.display.textContent = value.toString();
    }
  }

  clear() {
    this.firstOperand = "";
    this.secondOperand = "";
    this.operator = "";
    this.shouldResetDisplay = false;
    this.updateDisplay("0");
  }

  deleteLastDigit() {
    if (this.shouldResetDisplay) return;
    if (!this.operator) {
      if (this.firstOperand) {
        this.firstOperand =
          this.firstOperand.length > 1 ? this.firstOperand.slice(0, -1) : "";
      }
      this.updateDisplay(this.firstOperand || "0");
    } else if (this.secondOperand) {
      this.secondOperand =
        this.secondOperand.length > 1 ? this.secondOperand.slice(0, -1) : "";
      this.updateDisplay(
        `${this.firstOperand} ${this.operator} ${this.secondOperand}`
      );
    }
  }

  toggleSign() {
    if (!this.operator) {
      if (this.firstOperand) {
        if (this.firstOperand[0] === "-") {
          this.firstOperand = this.firstOperand.substring(1);
        } else {
          this.firstOperand = "-" + this.firstOperand;
        }
        this.updateDisplay(this.firstOperand);
      }
    } else if (this.secondOperand) {
      if (this.secondOperand[0] === "-") {
        this.secondOperand = this.secondOperand.substring(1);
      } else {
        this.secondOperand = "-" + this.secondOperand;
      }
      this.updateDisplay(
        `${this.firstOperand} ${this.operator} ${this.secondOperand}`
      );
    }
  }

  handlePercentage() {
    if (this.firstOperand && !this.operator) {
      const value = parseFloat(this.firstOperand) / 100;
      this.firstOperand = value.toString();
      this.updateDisplay(this.firstOperand);
    }
    if (this.secondOperand && this.operator) {
      const value =
        (parseFloat(this.firstOperand) * parseFloat(this.secondOperand)) / 100;
      this.secondOperand = value.toString();
      this.updateDisplay(
        `${this.firstOperand} ${this.operator} ${this.secondOperand}`
      );
    }
  }

  calculateResult() {
    if (!this.firstOperand || !this.secondOperand) return;

    const a = parseFloat(this.firstOperand);
    const b = parseFloat(this.secondOperand);
    let result: number | string = "";

    switch (this.operator) {
      case "+":
        result = a + b;
        break;
      case "-":
        result = a - b;
        break;
      case "×":
        result = a * b;
        break;
      case "÷":
        result = b !== 0 ? a / b : "Ошибка";
        break;
      case "y√x":
        result = a ** (1 / b);
        break;
      case "xy":
        result = Math.pow(a, b);
        break;
      case "e":
        if (this.operator) {
          this.secondOperand = Math.E.toString();
          this.updateDisplay(
            `${this.firstOperand} ${this.operator} ${this.secondOperand}`
          );
        } else {
          this.firstOperand = Math.E.toString();
          this.updateDisplay(this.firstOperand);
        }
        break;
      default:
        return;
    }

    if (typeof result === "number" && !Number.isInteger(result)) {
      result = parseFloat(result.toFixed(2));
    }

    this.updateDisplay(result.toString());

    this.shouldResetDisplay = true;
    this.firstOperand = typeof result === "number" ? result.toString() : "";
    this.secondOperand = "";
    this.operator = "";
  }

  inputDigit(digit: string) {
    if (digit === "0" && this.firstOperand === "0" && !this.operator) return;

    if (this.shouldResetDisplay) {
      this.firstOperand = "";
      this.operator = "";
      this.shouldResetDisplay = false;
    }

    if (!this.operator) {
      if (!this.firstOperand) {
        this.firstOperand = digit;
      } else {
        this.firstOperand = `${this.firstOperand}${digit}`;
      }
      this.updateDisplay(this.firstOperand);
    } else {
      if (!this.secondOperand) {
        this.secondOperand = digit;
      } else {
        this.secondOperand = `${this.secondOperand}${digit}`;
      }
      this.updateDisplay(
        `${this.firstOperand} ${this.operator} ${this.secondOperand}`
      );
    }
  }

  inputDecimal() {
    if (this.shouldResetDisplay) {
      this.firstOperand = "0";
      this.operator = "";
      this.shouldResetDisplay = false;
    }

    if (!this.operator) {
      if (!this.firstOperand) {
        this.firstOperand = "0";
      }
      if (!this.firstOperand.includes(".")) {
        this.firstOperand = `${this.firstOperand}.`;
        this.updateDisplay(this.firstOperand);
      }
    } else {
      if (!this.secondOperand) {
        this.secondOperand = "0";
      }
      if (!this.secondOperand.includes(".")) {
        this.secondOperand = `${this.secondOperand}.`;
        this.updateDisplay(
          `${this.firstOperand} ${this.operator} ${this.secondOperand}`
        );
      }
    }
  }

  inputOperator(op: string) {
    if (!this.firstOperand) return;
    if (this.operator && !this.secondOperand) {
      this.operator = op;
      this.updateDisplay(`${this.firstOperand} ${this.operator}`);
      return;
    }
    if (this.operator && this.secondOperand) {
      this.calculateResult();
      this.operator = op;
      this.secondOperand = "";
    } else {
      this.operator = op;
    }
    this.updateDisplay(`${this.firstOperand} ${this.operator}`);
  }

  handleSingleOperandOperator(operator: string) {
    
    let value = parseFloat(this.firstOperand);
    let result: number | string | undefined;

    switch (operator) {
      case "√x":
      case "&radic;x":
        if (value < 0) {
          this.updateDisplay("Ошибка");
          return;
        }
        result = Math.sqrt(value);
        break;
      case "3√x":
        result = Math.cbrt(value);
        break;
      case "x2":
        result = Math.pow(value, 2);
        break;
      case "x3":
        result = Math.pow(value, 3);
        break;
      case "ln":
        if (value <= 0) {
          this.updateDisplay("Ошибка");
          return;
        }
        result = Math.log(value);
        break;
      case "log10":
        if (value <= 0) {
          this.updateDisplay("Ошибка");
          return;
        }
        result = Math.log10(value);
        break;
      case "sin":
        result = Math.sin((value * Math.PI) / 180);
        break;
      case "cos":
        result = Math.cos((value * Math.PI) / 180);
        break;
      case "tan":
        result = Math.tan((value * Math.PI) / 180);
        break;
      case "π":
        result = Math.PI;
        break;
      case "mc":
        this.memory = 0;
        break;
      case "m+":
        this.memory += value;
        break;
      case "m-":
        this.memory -= value;
        break;
      case "mr":
        result = this.memory;
        break;
      case "10x":
        result = Math.pow(10, value);
        break;
      case "x!": {  
        if (value < 0 || !Number.isInteger(value)) {
          this.updateDisplay("Ошибка");
          return;
        }
        
        function factorial(n: number): number {
          if (n === 0 || n === 1) return 1;
          return n * factorial(n - 1);
        }
        
        result = factorial(value);
        break;
      }
      case "1/x":
        if (value === 0 || isNaN(value)) {
          this.updateDisplay(`Ошибка`);
          return;
        }
        result = 1 / value;
        break;
      case 'Rad':
        result = value* Math.PI / 180;
        break;
      case 'sinh':
        result = Math.sinh(value);
        break;
      case 'cosh':
        result = Math.cosh(value);
        break;
      case 'tanh':
        result = Math.tanh(value);
        break;
      default:
        this.updateDisplay(`неизвестная команда`);
        return;
    }

    if (result !== undefined) {
      // Форматируем числовые результаты для лучшего отображения
      if (typeof result === "number" && !Number.isInteger(result)) {
        result = parseFloat(result.toFixed(4));
      }

      this.firstOperand = typeof result === "number" ? result.toString() : "";
      this.updateDisplay(this.firstOperand);
    }
  }
}
