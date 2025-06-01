import { ICommand } from "../calculator-interfaces";
import { CalculatorReceiver } from "../calculator-receiver";

export class DigitCommand implements ICommand {
  constructor(
    private digit: string,
    private receiver: CalculatorReceiver,
  ) {}
  execute() {
    this.receiver.inputDigit(this.digit);
  }
}
