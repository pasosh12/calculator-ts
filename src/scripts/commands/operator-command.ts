import { ICommand } from "../calculator-interfaces";
import { CalculatorReceiver } from "../calculator-receiver";

export class OperatorCommand implements ICommand {
  constructor(
    private operator: string,
    private receiver: CalculatorReceiver,
  ) {}
  execute() {
    this.receiver.inputOperator(this.operator);
  }
}
