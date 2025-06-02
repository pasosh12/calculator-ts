import { UnaryOperatorRegistry } from './operators/operator-registry';
import { BinaryOperatorRegistry } from './operators/binary-operator-registry';

export class CalculatorReceiver {
  firstOperand: string = "";
  operator: string = "";
  secondOperand: string = "";
  shouldResetDisplay: boolean = false;
  memory: number = 0;
  display: HTMLElement | null;
  private unaryOperatorRegistry: UnaryOperatorRegistry;
  private binaryOperatorRegistry: BinaryOperatorRegistry;

  constructor(display: HTMLElement | null) {
    this.display = display;
    // Создаем объект с доступом к памяти для передачи в реестр
    const memoryRef = {
      get memory() { return this._calculator.memory; },
      set memory(value: number) { this._calculator.memory = value; },
      _calculator: this
    };
    this.unaryOperatorRegistry = new UnaryOperatorRegistry(memoryRef);
    this.binaryOperatorRegistry = new BinaryOperatorRegistry();
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

  handleDoubleOperandOperator(keepOperator: boolean = false) {
    if (!this.firstOperand || !this.secondOperand) return;

    const a = parseFloat(this.firstOperand);
    const b = parseFloat(this.secondOperand);
    const currentOperator = this.operator; // Сохраняем текущий оператор
    const command = this.binaryOperatorRegistry.getOperator(this.operator);
    
    if (!command) {
      this.updateDisplay(`неизвестная операция`);
      return;
    }
    
    // Проверяем метод canCalculate только если он существует
    if (command.canCalculate && !command.canCalculate(a, b)) {
      this.updateDisplay("Ошибка");
      return;
    }
    
    const result = command.calculate(a, b);
    
    if (result !== undefined && result !== null) {
      // Форматируем числовые результаты для лучшего отображения
      let formattedResult = result;
      let resultStr = "";
      
      if (typeof formattedResult === "number") {
        if (!Number.isInteger(formattedResult)) {
          formattedResult = parseFloat(formattedResult.toFixed(4));
        }
        resultStr = formattedResult.toString();
      } else if (typeof formattedResult === "string") {
        resultStr = formattedResult;
      } else {
        // Если результат другого типа, конвертируем в строку
        resultStr = String(formattedResult);
      }

      this.firstOperand = resultStr;
      this.secondOperand = "";
      
      // Если keepOperator=true, сохраняем оператор, иначе сбрасываем
      if (!keepOperator) {
        this.operator = "";
        this.updateDisplay(resultStr);
      } else {
        // Сохраняем оператор и отображаем с ним
        this.updateDisplay(`${resultStr} ${this.operator}`);
      }
    }
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
    
    // Если есть оператор, но нет второго операнда - просто меняем оператор
    if (this.operator && !this.secondOperand) {
      this.operator = op;
      this.updateDisplay(`${this.firstOperand} ${this.operator}`);
      return;
    }
    
    // Если есть оператор и второй операнд - вычисляем результат, затем устанавливаем новый оператор
    if (this.operator && this.secondOperand) {
      // Сначала устанавливаем новый оператор (иначе handleDoubleOperandOperator использует старый)
      this.operator = op;
      // Выполняем вычисление, сохраняя оператор
      this.handleDoubleOperandOperator(true);
      // this.firstOperand уже содержит результат, secondOperand сброшен
      // В handleDoubleOperandOperator уже вызван updateDisplay с правильным результатом и оператором
      return;
    } else {
      // Первый ввод оператора
      this.operator = op;
    }
    
    // Показываем результат с новым оператором
    this.updateDisplay(`${this.firstOperand} ${this.operator}`);
  }

  handleSingleOperandOperator(operator: string) {
    const value = parseFloat(this.firstOperand);
    const command = this.unaryOperatorRegistry.getOperator(operator);
    
    if (!command) {
      this.updateDisplay(`неизвестная команда`);
      return;
    }
    
    // Проверяем метод canCalculate только если он существует
    if (command.canCalculate && !command.canCalculate(value)) {
      this.updateDisplay("Ошибка");
      return;
    }
    
    const result = command.calculate(value);
    
    if (result !== undefined && result !== null) {
      // Форматируем числовые результаты для лучшего отображения
      let formattedResult = result;
      let resultStr = "";
      
      if (typeof formattedResult === "number") {
        if (!Number.isInteger(formattedResult)) {
          formattedResult = parseFloat(formattedResult.toFixed(4));
        }
        resultStr = formattedResult.toString();
      } else if (typeof formattedResult === "string") {
        resultStr = formattedResult;
      } else {
        // Если результат другого типа, конвертируем в строку
        resultStr = String(formattedResult);
      }

      this.firstOperand = typeof formattedResult === "number" ? formattedResult.toString() : "";
      this.updateDisplay(this.firstOperand);
    }
  }

  // Метод для обработки нажатия кнопки "=" или клавиши Enter
  calculateResult() {
    if (this.operator && this.secondOperand) {
      // Вызываем handleDoubleOperandOperator с параметром keepOperator=false,
      // чтобы сбросить оператор после вычисления
      this.handleDoubleOperandOperator(false);
      // Устанавливаем флаг, что следующий ввод цифры должен заменить текущее значение
      this.shouldResetDisplay = false;
    }
  }
}
