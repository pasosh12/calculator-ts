import { ICommand } from "../calculator-interfaces";
import { CalculatorReceiver } from "../calculator-receiver";

export class ResultCommand implements ICommand {
  constructor(private receiver: CalculatorReceiver) {}
  execute() {
    this.receiver.executeOperation();
  }
}
