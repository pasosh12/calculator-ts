import { CalculatorReceiver } from "../calculator-receiver";

class MockDisplay {
  textContent: string | null = null;
}

describe("CalculatorReceiver", () => {
  let receiver: CalculatorReceiver;
  let display: MockDisplay;

  beforeEach(() => {
    display = new MockDisplay();
    receiver = new CalculatorReceiver(display as any);
  });

  test("сложение двух чисел", () => {
    receiver.firstOperand = "2";
    receiver.operator = "+";
    receiver.secondOperand = "3";
    receiver.executeOperation();
    expect(receiver.firstOperand).toBe("5");
    expect(display.textContent).toBe("5");
  });

  test("деление на ноль", () => {
    receiver.firstOperand = "10";
    receiver.operator = "÷";
    receiver.secondOperand = "0";
    receiver.executeOperation();
    expect(display.textContent).toBe("Ошибка");
  });

  test("ln числа", () => {
    receiver.firstOperand = "10";
    receiver.handleSingleOperandOperator("ln");
    const displayValue = parseFloat(display.textContent || "0").toFixed(4);
    expect(displayValue).toBe("2.3026");
  });

  test("последовательные операции 7-4-1", () => {
    receiver.inputDigit("7");
    expect(receiver.firstOperand).toBe("7");
    expect(display.textContent).toBe("7");

    receiver.inputOperator("-");
    expect(receiver.operator).toBe("-");
    expect(display.textContent).toBe("7 -");

    receiver.inputDigit("4");
    expect(receiver.secondOperand).toBe("4");
    expect(display.textContent).toBe("7 - 4");

    receiver.inputOperator("-");
    expect(receiver.firstOperand).toBe("3");
    expect(receiver.operator).toBe("-");
    expect(receiver.secondOperand).toBe("");
    expect(display.textContent).toBe("3 -");

    receiver.inputDigit("1");
    expect(receiver.secondOperand).toBe("1");
    expect(display.textContent).toBe("3 - 1");

    receiver.executeOperation();
    expect(receiver.firstOperand).toBe("2");
    expect(receiver.operator).toBe("");
    expect(receiver.secondOperand).toBe("");
    expect(display.textContent).toBe("2");
  });
  test("AC", () => {
    receiver.firstOperand = "10";
    receiver.operator = "÷";
    receiver.secondOperand = "0";
    receiver.clear();
    expect(receiver.firstOperand).toBe("");
    expect(receiver.operator).toBe("");
    expect(receiver.secondOperand).toBe("");
    expect(display.textContent).toBe("0");
  });
  test("m+ добавление в память", () => {
    receiver.firstOperand = "10";
    receiver.executeOperation("m+");
    expect(receiver.memory).toBe(10);
    expect(display.textContent).toBe("10");
  });

  test("m- вычитание из памяти", () => {
    receiver.memory = 20;
    receiver.firstOperand = "5";
    receiver.executeOperation("m-");
    expect(receiver.memory).toBe(15);
    // Оператор m- возвращает новое значение памяти (15), а не исходный операнд (5)
    expect(display.textContent).toBe("15");
  });

  test("mr вызов значения из памяти", () => {
    receiver.memory = 30;
    receiver.executeOperation("mr");
    expect(receiver.firstOperand).toBe("30");
    expect(display.textContent).toBe("30");
  });

  test("mc очистка памяти", () => {
    receiver.memory = 40;
    receiver.executeOperation("mc");
    expect(receiver.memory).toBe(0);
  });

  test("последовательное использование памяти", () => {
    // Сначала сохраняем 10 в память
    receiver.firstOperand = "10";
    receiver.executeOperation("m+");
    expect(receiver.memory).toBe(10);

    // Добавляем еще 5 в память
    receiver.firstOperand = "5";
    receiver.executeOperation("m+");
    expect(receiver.memory).toBe(15);

    // Вызываем значение из памяти
    receiver.executeOperation("mr");
    expect(receiver.firstOperand).toBe("15");
    expect(display.textContent).toBe("15");

    // Очищаем память
    receiver.executeOperation("mc");
    expect(receiver.memory).toBe(0);
  });

  test("sin", () => {
    receiver.firstOperand = "30";
    receiver.executeOperation("sin");
    expect(receiver.firstOperand).toBe("0.5");
    expect(display.textContent).toBe("0.5");
  });
  test("cos", () => {
    receiver.firstOperand = "60";
    receiver.executeOperation("cos");
    expect(receiver.firstOperand).toBe("0.5");
    expect(display.textContent).toBe("0.5");
  });
  test("tan", () => {
    receiver.firstOperand = "45";
    receiver.executeOperation("tan");
    expect(receiver.firstOperand).toBe("1");
    expect(display.textContent).toBe("1");
  });
  test("cosh - гиперболический косинус", () => {
    receiver.firstOperand = "1";
    receiver.executeOperation("cosh");
    expect(parseFloat(receiver.firstOperand)).toBeCloseTo(1.5431, 4);
    expect(parseFloat(display.textContent)).toBeCloseTo(1.5431, 4);
  });

  test("sinh - гиперболический синус", () => {
    receiver.firstOperand = "1";
    receiver.executeOperation("sinh");
    expect(parseFloat(receiver.firstOperand)).toBeCloseTo(1.1752, 4);
    expect(parseFloat(display.textContent)).toBeCloseTo(1.1752, 4);
  });

  test("tanh - гиперболический тангенс", () => {
    receiver.firstOperand = "1";
    receiver.executeOperation("tanh");
    expect(parseFloat(receiver.firstOperand)).toBeCloseTo(0.7616, 4);
    expect(parseFloat(display.textContent)).toBeCloseTo(0.7616, 4);
  });
  test("3√x", () => {
    receiver.firstOperand = "8";
    receiver.executeOperation("3√x");
    expect(parseFloat(receiver.firstOperand)).toBeCloseTo(2, 4);
    expect(parseFloat(display.textContent)).toBeCloseTo(2, 4);
  });
  test("10x", () => {
    receiver.firstOperand = "3";
    receiver.executeOperation("10x");
    expect(receiver.firstOperand).toBe("1000");
    expect(display.textContent).toBe("1000");
  });

  test("EE ", () => {
    receiver.firstOperand = "5";
    receiver.inputOperator("EE");
    expect(display.textContent).toBe("5 EE");
    receiver.secondOperand = "3";
    receiver.executeOperation();
    expect(receiver.firstOperand).toBe("5000");
    expect(display.textContent).toBe("5000");
  });
  test("x!", () => {
    receiver.firstOperand = "5";
    receiver.executeOperation("x!");
    expect(receiver.firstOperand).toBe("120");
    expect(display.textContent).toBe("120");
  });
  test("1/x", () => {
    receiver.firstOperand = "5";
    receiver.executeOperation("1/x");
    expect(parseFloat(receiver.firstOperand)).toBeCloseTo(0.2, 4);
    expect(parseFloat(display.textContent)).toBeCloseTo(0.2, 4);
  });
  test("y√x корень произвольной степени", () => {
    receiver.firstOperand = "8";
    receiver.inputOperator("y√x");
    expect(display.textContent).toBe("8 y√x");
    receiver.secondOperand = "3";
    receiver.executeOperation();
    expect(parseFloat(receiver.firstOperand)).toBe(2);
    expect(parseFloat(display.textContent)).toBe(2);
  });
  test("xy", () => {
    receiver.firstOperand = "2";
    receiver.inputOperator("xy");
    expect(display.textContent).toBe("2 xy");
    receiver.secondOperand = "3";
    receiver.executeOperation();
    expect(receiver.firstOperand).toBe("8");
    expect(display.textContent).toBe("8");
  });
  test('e^x',()=>{
    receiver.firstOperand = "2";
    receiver.executeOperation("ex");
    expect(parseFloat(receiver.firstOperand)).toBeCloseTo(7.3891, 4);
    expect(parseFloat(display.textContent)).toBeCloseTo(7.3891, 4);
  })
  test('pi+pi',()=>{
    receiver.firstOperand = Math.PI.toFixed(4);
    receiver.executeOperation("π");
    receiver.inputOperator("+");
    receiver.secondOperand = Math.PI.toFixed(4);
    expect(parseFloat(receiver.secondOperand)).toBeCloseTo(parseFloat(Math.PI.toFixed(4)));
    expect(display.textContent).toBe(Math.PI.toFixed(4) + " + " + Math.PI.toFixed(4));
    receiver.executeOperation();
    expect(parseFloat(receiver.firstOperand)).toBeCloseTo(Math.PI*2, 4);
    expect(parseFloat(display.textContent)).toBeCloseTo(Math.PI*2, 4);
  })
});
