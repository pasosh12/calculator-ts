import {
  UnaryOperatorCommand,
  SquareRootOperator,
  CubeRootOperator,
  SquareOperator,
  CubeOperator,
  NaturalLogOperator,
  Log10Operator,
  SinOperator,
  CosOperator,
  TanOperator,
  PiConstantOperator,
  PowerOf10Operator,
  FactorialOperator,
  ReciprocalOperator,
  RadianConverterOperator,
  HyperbolicSineOperator,
  HyperbolicCosineOperator,
  HyperbolicTangentOperator,
  EulerNumberOperator,
  EulerPowerOperator,
  MemoryClearOperator,
  MemoryAddOperator,
  MemorySubtractOperator,
  MemoryRecallOperator,
} from "./unary-operators";

export class UnaryOperatorRegistry {
  private operators: Map<string, UnaryOperatorCommand>;

  constructor(memoryRef: { memory: number }) {
    this.operators = new Map();

    // Инициализация реестра операторов
    this.operators.set("√x", new SquareRootOperator());
    this.operators.set("3√x", new CubeRootOperator());
    this.operators.set("x2", new SquareOperator());
    this.operators.set("x3", new CubeOperator());
    this.operators.set("ln", new NaturalLogOperator());
    this.operators.set("log10", new Log10Operator());
    this.operators.set("sin", new SinOperator());
    this.operators.set("cos", new CosOperator());
    this.operators.set("tan", new TanOperator());
    this.operators.set("π", new PiConstantOperator());
    this.operators.set("10x", new PowerOf10Operator());
    this.operators.set("x!", new FactorialOperator());
    this.operators.set("1/x", new ReciprocalOperator());
    this.operators.set("Rad", new RadianConverterOperator());
    this.operators.set("sinh", new HyperbolicSineOperator());
    this.operators.set("cosh", new HyperbolicCosineOperator());
    this.operators.set("tanh", new HyperbolicTangentOperator());
    this.operators.set("e", new EulerNumberOperator()); 
    this.operators.set("e^x", new EulerPowerOperator());
    this.operators.set("mc", new MemoryClearOperator(memoryRef));
    this.operators.set("m+", new MemoryAddOperator(memoryRef));
    this.operators.set("m-", new MemorySubtractOperator(memoryRef));
    this.operators.set("mr", new MemoryRecallOperator(memoryRef));
  }

  getOperator(operatorKey: string): UnaryOperatorCommand | undefined {
    return this.operators.get(operatorKey);
  }

  hasOperator(operatorKey: string): boolean {
    return this.operators.has(operatorKey);
  }
}
