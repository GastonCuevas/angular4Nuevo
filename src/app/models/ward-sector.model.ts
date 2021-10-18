import { Deposit } from "./deposit.model";

export class WardSector{
    number: number;
    name: string;
    depositId: number;
    depositName: string;
    deposit: Deposit = new Deposit();
}