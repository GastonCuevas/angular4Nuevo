import { PatientMedicalInsurance } from './patient-medical-insurance.model';
import { Account } from './account.model';

type BloodGroup = { number: number; name: string };
type Genre = { number: number; name: string };

export class Patient {
  public patientAccount: Account;
  account: Account;
  public accountNumber: number = 0;
  public birthdate: Date | string | null;
  public transplanted: number = 0;
  public genreNumber: number;
  public years: number;
  genreName: string;
  genre: Genre;
  public stature: number;
  public weight: number;
  public children: number;
  civilState: any;
  public civilStateNumber: number;
  civilStateName: string;
  bloodGroup?: BloodGroup;
  bloodGroupName: string;
  public bloodType?: number;
  public secuence?: number;
  public clinicHistoryNumber: string;
  public carnetNumber?: string;
  public medicalInsurances: Array<PatientMedicalInsurance> =
    new Array<PatientMedicalInsurance>();

  // public constructor() {

  // }
  constructor(
    patientAccount: Account = new Account(
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
    ),
    account: Account = new Account(
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
    ),
    accountNumber: number = 0,
    birthdate: Date | string = '',
    transplanted: number = 0,
    genreNumber: number,
    years: number,
    genreName: string,
    genre: Genre = { number: 0, name: '' },
    stature: number = 0,
    weight: number = 0,
    children: number = 0,
    civilState: any,
    civilStateNumber: number = 0,
    civilStateName: string,
    clinicHistoryNumber: string,
    medicalInsurances: Array<PatientMedicalInsurance>,
    bloodGroup?: BloodGroup,
    bloodGroupName: string = '',
    bloodType?: number,
    secuence?: number,
    carnetNumber?: string
  ) {
    this.patientAccount = patientAccount;
    this.account = account;
    this.accountNumber = accountNumber;
    this.birthdate = birthdate;
    this.transplanted = transplanted;
    this.genreNumber = genreNumber;
    this.years = years;
    this.genreName = genreName;
    this.genre = genre;
    this.stature = stature;
    this.weight = weight;
    this.children = children;
    this.civilState = civilState;
    this.civilStateNumber = civilStateNumber;
    this.civilStateName = civilStateName;
    this.bloodGroup = bloodGroup;
    this.bloodGroupName = bloodGroupName;
    this.bloodType = bloodType;
    this.secuence = secuence;
    this.clinicHistoryNumber = clinicHistoryNumber;
    this.carnetNumber = carnetNumber;
    this.medicalInsurances = medicalInsurances;

    this.patientAccount.type = 1;
    this.patientAccount.activity = 2;
    this.patientAccount.category = 1;
    this.patientAccount.reggan = 1;
    this.patientAccount.congan = 1;
    this.patientAccount.vended = 1;
    this.patientAccount.currency = 1;
    this.patientAccount.enabled = 1;
    this.patientAccount.aliibr = 1;
    this.patientAccount.ivaReg = 1;
    this.patientAccount.ibrReg = 1;
    this.patientAccount.accountNumber = '100000000000';
  }
}
