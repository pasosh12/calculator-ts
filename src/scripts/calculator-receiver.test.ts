
import { CalculatorReceiver } from "./calculator-receiver";

 
class MockDisplay {
  textContent: string |null = null;
}

describe("CalculatorReceiver", () => {
  let receiver: CalculatorReceiver; 
  let display: MockDisplay;

  beforeEach(() => { 
    display= new MockDisplay();
    receiver = new CalculatorReceiver( display as any);
  });

  test("сложение двух чисел", () => {
    receiver.firstOperand = "2";
    receiver.operator = "+";
    receiver.secondOperand = "3";
    receiver.calculateResult();
    expect(receiver.firstOperand).toBe("5"); 
    expect(display.textContent).toBe("5");
  });

  test("деление на ноль", () => {
    receiver.firstOperand = "10";
    receiver.operator = "÷";
    receiver.secondOperand = "0";
    receiver.calculateResult();
    // expect(receiver.firstOperand).toBe("Ошибка"); 
    expect(display.textContent).toBe("Ошибка");
  });

  test("ln числа", () => {
    receiver.firstOperand = "10";
    receiver.handleSingleOperandOperator('ln'); 
    const displayValue = parseFloat(display.textContent || "0").toFixed(4);
    expect(displayValue).toBe("2.3026");
  });

  

  
});
