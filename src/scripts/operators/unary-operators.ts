export interface UnaryOperatorCommand {
  calculate(value: number): number | string | undefined;
  canCalculate?(value: number): boolean;
}

export class SquareRootOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.sqrt(value);
  }

  canCalculate(value: number): boolean {
    return value >= 0; // Квадратный корень определен только для неотрицательных чисел
  }
}

export class CubeRootOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.cbrt(value);
  }
}

export class SquareOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.pow(value, 2);
  }
}

export class CubeOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.pow(value, 3);
  }
}

export class NaturalLogOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.log(value);
  }

  canCalculate(value: number): boolean {
    return value > 0;
  }
}

export class Log10Operator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.log10(value);
  }

  canCalculate(value: number): boolean {
    return value > 0;
  }
}

export class SinOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.sin((value * Math.PI) / 180);
  }
}

export class CosOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.cos((value * Math.PI) / 180);
  }
}

export class TanOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.tan((value * Math.PI) / 180);
  }
}

export class PiConstantOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.PI;
  }
}

export class PowerOf10Operator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.pow(10, value);
  }

  
}

export class FactorialOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    let result = 1;
    for (let i = 2; i <= value; i++) {
      result *= i;
    }
    return result;
  }

  canCalculate(value: number): boolean {
    return value >= 0 && Number.isInteger(value);
  }
}

export class ReciprocalOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return 1 / value;
  }

  canCalculate(value: number): boolean {
    return value !== 0 && !isNaN(value);
  }
}

export class RadianConverterOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return (value * Math.PI) / 180;
  }
}

export class HyperbolicSineOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.sinh(value);
  }
}

export class HyperbolicCosineOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.cosh(value);
  }
}

export class HyperbolicTangentOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.tanh(value);
  }
}

export class EulerNumberOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.E;
  }
} 
export class EulerPowerOperator implements UnaryOperatorCommand {
  calculate(value: number): number {
    return Math.pow(Math.E, value);
  }
}

export class MemoryClearOperator implements UnaryOperatorCommand {
  private memoryReference: { memory: number };

  constructor(memoryReference: { memory: number }) {
    this.memoryReference = memoryReference;
  }

  calculate(value: number): number {
    this.memoryReference.memory = 0;
    return 0;
  }
}

export class MemoryAddOperator implements UnaryOperatorCommand {
  private memoryReference: { memory: number };

  constructor(memoryReference: { memory: number }) {
    this.memoryReference = memoryReference;
  }

  calculate(value: number): number {
    this.memoryReference.memory += value;
    return this.memoryReference.memory;
  }
}

export class MemorySubtractOperator implements UnaryOperatorCommand {
  private memoryReference: { memory: number };

  constructor(memoryReference: { memory: number }) {
    this.memoryReference = memoryReference;
  }

  calculate(value: number): number {
    this.memoryReference.memory -= value;
    return this.memoryReference.memory;
  }
}

export class MemoryRecallOperator implements UnaryOperatorCommand {
  private memoryReference: { memory: number };

  constructor(memoryReference: { memory: number }) {
    this.memoryReference = memoryReference;
  }

  calculate(value: number): number {
    return this.memoryReference.memory;
  }
}
