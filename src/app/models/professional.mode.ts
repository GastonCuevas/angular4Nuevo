import { Account } from './account.model';

export class Professional {
  Account: Account;
  Enrollment: number;
  Query: number;
  NumberProf: number;
  NameProf: string;

  constructor(Account: Account, Enrollment: number, Query: number, NumberProf: number, NameProf: string) {
    this.Account = Account;
    this.Enrollment = Enrollment;
    this.Query = Query;
    this.NumberProf = NumberProf;
    this.NameProf = NameProf;
  }
}
