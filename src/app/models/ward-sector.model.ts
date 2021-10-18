import { Deposit } from './deposit.model';

export class WardSector {
  number: number;
  name: string;
  depositId: number;
  depositName: string;
  deposit: Deposit;

  constructor(
    number: number,
    name: string,
    depositId: number,
    depositName: string,
    deposit: Deposit = new Deposit(0)
  ) {
    this.number = number;
    this.name = name;
    this.depositId = depositId;
    this.depositName = depositName;
    this.deposit = deposit;
  }
}
