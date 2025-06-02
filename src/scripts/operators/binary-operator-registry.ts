
import {
  BinaryOperatorCommand,
  AdditionOperator,
  SubtractionOperator,
  MultiplicationOperator,
  DivisionOperator,
  RootOperator,
  PowerOperator,
  ScientificNotationOperator
} from './binary-operators';

export class BinaryOperatorRegistry {
  private operators: Map<string, BinaryOperatorCommand>;

  constructor() {
    this.operators = new Map();
    
    // Инициализация реестра бинарных операторов
    this.operators.set("+", new AdditionOperator());
    this.operators.set("-", new SubtractionOperator());
    this.operators.set("×", new MultiplicationOperator());
    this.operators.set("÷", new DivisionOperator());
    this.operators.set("y√x", new RootOperator());
    this.operators.set("xy", new PowerOperator());
    this.operators.set("EE", new ScientificNotationOperator());
  }

  getOperator(operatorKey: string): BinaryOperatorCommand | undefined {
    return this.operators.get(operatorKey);
  }

  hasOperator(operatorKey: string): boolean {
    return this.operators.has(operatorKey);
  }
}
