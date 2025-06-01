import { ICommand } from "../calculator-interfaces";
import { CalculatorReceiver } from "../calculator-receiver";

export class SingleOperandCommand implements ICommand {
  constructor(
    private operator: string,
    private receiver: CalculatorReceiver,
  ) {}
  execute() {
    this.receiver.handleSingleOperandOperator(this.operator);
  }
}
