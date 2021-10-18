export class PatientMovement {
  numInt: number;
  date: Date;
  time: string;
  movementStateNumber: number;
  patientNumber: number;
  patientName: string;
  practiceNumber?: number;
  professionalContractNumber?: number;
  medicalInsuranceContractNumber?: number;
  authorizationCode?: string;
  coinsurancePaymented?: number;
  observation?: string;

  constructor(
    numInt: number,
    date: Date,
    time: string,
    movementStateNumber: number,
    patientNumber: number,
    patientName: string,
    practiceNumber?: number,
    professionalContractNumber?: number,
    medicalInsuranceContractNumber?: number,
    authorizationCode?: string,
    coinsurancePaymented?: number,
    observation?: string
  ) {
    this.numInt = numInt;
    this.date = date;
    this.time = time;
    this.movementStateNumber = movementStateNumber;
    this.patientNumber = patientNumber;
    this.patientName = patientName;
    this.practiceNumber = practiceNumber;
    this.professionalContractNumber = professionalContractNumber;
    this.medicalInsuranceContractNumber = medicalInsuranceContractNumber;
    this.authorizationCode = authorizationCode;
    this.coinsurancePaymented = coinsurancePaymented;
    this.observation = observation;
  }
}
