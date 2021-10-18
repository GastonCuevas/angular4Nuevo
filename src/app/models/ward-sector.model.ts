import { Deposit } from "./deposit.model";

export class WardSector {
  number: number = 0;
  name: string = '';
  depositId: number = 0;
  depositName: string = '';
  deposit: Deposit = new Deposit();
}
