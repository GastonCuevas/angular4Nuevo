import { MedicalInsurance } from './medical-insurance.model';
import { Account } from './account.model';

export class PatientMedicalInsurance {
  number: number;
  carnetNumber: string;
  byDefault: boolean = false;
  expirationDate: string;
  patientNumber: any;
  socialNumber: number;
  medicalInsurance: MedicalInsurance = new MedicalInsurance();
  patientName: string;
  medicalInsuranceName: string;
  patient: Account = new Account(
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
  yesOrNo: string;

  constructor(
    carnetNumber: string,
    byDefault: boolean,
    expirationDate: string,
    patientNumber: any,
    socialNumber: number,
    medicalInsurance: MedicalInsurance,
    patientName: string,
    medicalInsuranceName: string,
    patient: Account,
    yesOrNo: string,
    number: number
  ) {
    this.carnetNumber = carnetNumber;
    this.byDefault = byDefault;
    this.expirationDate = expirationDate;
    this.patientNumber = patientNumber;
    this.socialNumber = socialNumber;
    this.medicalInsurance = medicalInsurance;
    this.patientName = patientName;
    this.medicalInsuranceName = medicalInsuranceName;
    this.patient = patient;
    this.yesOrNo = yesOrNo;
    this.number = number;
  }
}
