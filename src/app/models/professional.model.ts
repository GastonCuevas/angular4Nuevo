import { Account } from './account.model';

export class Professional {
  public enrollment: number;
  public matesp: string;
  public clinic: string;
  public account: number;
  public nameProf: string;
  public professionalAccount: Account;
  public numberProf?: number;

  constructor(
    enrollment: number,
    matesp: string,
    clinic: string,
    account: number,
    nameProf: string,
    numberProf?: number
  ) {
    this.enrollment = enrollment;
    this.professionalAccount = new Account(
      0,
      '',
      0,
      '',
      '',
      '',
      0,
      '',
      0,
      '',
      0,
      0,
      0,
      '',
      0,
      0,
      0,
      0,
      0,
      0,
      '',
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      new Date(),
      '',
      0,
      '',
      '',
      0,
      '',
      '',
      '',
      '',
      undefined,
      0,
      0,
      0,
      '',
      undefined,
      0,
      '',
      '',
      0,
      0,
      undefined,
      undefined,
      0,
      0
    );
    this.professionalAccount.type = 2;
    this.professionalAccount.activity = 7;
    this.professionalAccount.reggan = 1;
    this.professionalAccount.congan = 1;
    this.professionalAccount.vended = 1;
    this.professionalAccount.currency = 1;
    this.professionalAccount.enabled = 1;
    this.matesp = matesp;
    this.clinic = clinic;
    this.account = account;
    this.nameProf = nameProf;
    this.numberProf = numberProf;
  }
}
