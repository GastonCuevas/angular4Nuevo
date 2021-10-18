import { Account } from './account.model';

export class MedicalInsurance {
  public accountNumber: number;
  public medicalInsuranceAccount: Account;
  public percentage: number;
  public agent1?: string;
  public agent2?: string;
  public agent3?: string;
  public agentPhone1?: string;
  public agentPhone2?: string;
  public agentPhone3?: string;

  constructor(
    accountNumber: number = 0,
    percentage: number = 0,
    agent1?: string,
    agent2?: string,
    agent3?: string,
    agentPhone1?: string,
    agentPhone2?: string,
    agentPhone3?: string
  ) {
    this.accountNumber = accountNumber;
    this.percentage = percentage;
    this.medicalInsuranceAccount = new Account(
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
    this.medicalInsuranceAccount.type = 1;
    this.medicalInsuranceAccount.activity = 1;
    this.medicalInsuranceAccount.reggan = 1;
    this.medicalInsuranceAccount.congan = 1;
    this.medicalInsuranceAccount.vended = 1;
    this.medicalInsuranceAccount.currency = 1;
    this.medicalInsuranceAccount.enabled = 1;
    this.medicalInsuranceAccount.aliibr = 1;
  }
}
