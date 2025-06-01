import { ICommand } from "../calculator-interfaces";
import { CalculatorReceiver } from "../calculator-receiver";

export class ToggleSignCommand implements ICommand {
  constructor(private receiver: CalculatorReceiver) {}
  execute() {
    this.receiver.toggleSign();
  }
}
