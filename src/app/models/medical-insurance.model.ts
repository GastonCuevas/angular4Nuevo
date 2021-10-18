import { Account } from "./account.model"

export class MedicalInsurance {
  public accountNumber: number = 0;
  public medicalInsuranceAccount: Account;
  public percentage: number = 0;
  public agent1?: string;
  public agent2?: string;
  public agent3?: string;
  public agentPhone1?: string;
  public agentPhone2?: string;
  public agentPhone3?: string;

  constructor() {
    this.medicalInsuranceAccount = new Account();
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
