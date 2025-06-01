import { ICommand } from "../calculator-interfaces";
import { CalculatorReceiver } from "../calculator-receiver";

export class DeleteLastDigitCommand implements ICommand {
  constructor(private receiver: CalculatorReceiver) {}
  execute() {
    this.receiver.deleteLastDigit();
  }
}
