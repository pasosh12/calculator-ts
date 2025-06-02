
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
    expect(display.textContent).toBe("Ошибка");
  });

  test("ln числа", () => {
    receiver.firstOperand = "10";
    receiver.handleSingleOperandOperator('ln'); 
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
    
    receiver.calculateResult();
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
  // test("m+",()=>{
  //   receiver.firstOperand = "10";
  //   receiver.setMemory();
  //   expect(receiver.memory).toBe(10);
  //   expect(display.textContent).toBe("10");
  // })
});
