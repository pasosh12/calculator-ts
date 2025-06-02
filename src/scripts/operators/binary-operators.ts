export interface BinaryOperatorCommand {
  calculate(a: number, b: number): number | string;
  canCalculate?(a: number, b: number): boolean;
}

export class AdditionOperator implements BinaryOperatorCommand {
  calculate(a: number, b: number): number {
    return a + b;
  }
}

export class SubtractionOperator implements BinaryOperatorCommand {
  calculate(a: number, b: number): number {
    return a - b;
  }
}

export class MultiplicationOperator implements BinaryOperatorCommand {
  calculate(a: number, b: number): number {
    return a * b;
  }

}

export class DivisionOperator implements BinaryOperatorCommand {
  calculate(a: number, b: number): number | string {
    return b !== 0 ? a / b : "Ошибка";
  }
  
  canCalculate(a: number, b: number): boolean {
    return b !== 0; // Деление возможно, только если делитель не ноль
  }
}

export class RootOperator implements BinaryOperatorCommand {
  calculate(a: number, b: number): number {
    return a ** (1 / b);
  }

  canCalculate(a: number, b: number): boolean {
    // Корень определен, когда a >= 0 для четных b
    if (b % 2 === 0) {
      return a >= 0;
    }
    return true; // Для нечетных b корень определен для всех a
  }
}

export class PowerOperator implements BinaryOperatorCommand {
  calculate(a: number, b: number): number {
    return Math.pow(a, b);
  }

  canCalculate(a: number, b: number): boolean {
    // Степень может быть не определена в некоторых случаях (например, 0^0 или отрицательное основание с дробным показателем)
    if (a === 0 && b === 0) {
      return false;
    }
    if (a < 0 && !Number.isInteger(b)) {
      return false;
    }
    return true;
  }
}

export class EulerNumberOperator implements BinaryOperatorCommand {
  calculate(a: number, b: number): number {
    return Math.E;
  }
}
