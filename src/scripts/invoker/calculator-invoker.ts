import { ICommand } from "../calculator-interfaces";

export class CalculatorInvoker {
  private history: ICommand[] = [];

  executeCommand(command: ICommand) {
    command.execute();
    this.history.push(command);
  }
}
