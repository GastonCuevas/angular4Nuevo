export class Turn {
  numInt: number;
  movementNumber: number = 0;
  medicalOffice: any;

  date: Date | string;
  time: string;
  specialtyNumber: number = 0;
  specialtyName: string;
  professionalNumber: number = 0;
  professionalName: string;
  patientNumber: number = 0;
  patientName: string;
  medicalInsuranceNumber: number = 0;
  medicalInsuranceName: string;
  practiceNumber: number = 0;
  practiceName: string;
  turnStateNumber: number = 0;
  turnStateName: string;
  uponTurn: number = 0;
  observation: string;

  constructor(
    numInt: number,
    movementNumber: number = 0,
    medicalOffice: any,
    date: Date | string,
    time: string,
    specialtyNumber: number = 0,
    specialtyName: string,
    professionalNumber: number = 0,
    professionalName: string,
    patientNumber: number = 0,
    patientName: string,
    medicalInsuranceNumber: number = 0,
    medicalInsuranceName: string,
    practiceNumber: number = 0,
    practiceName: string,
    turnStateNumber: number = 0,
    turnStateName: string,
    uponTurn: number = 0,
    observation: string
  ) {
    this.numInt = numInt;
    this.movementNumber = movementNumber;
    this.medicalOffice = medicalOffice;
    this.date = date;
    this.time = time;
    this.specialtyNumber = specialtyNumber;
    this.specialtyName = specialtyName;
    this.professionalNumber = professionalNumber;
    this.professionalName = professionalName;
    this.patientNumber = patientNumber;
    this.patientName = patientName;
    this.medicalInsuranceNumber = medicalInsuranceNumber;
    this.medicalInsuranceName = medicalInsuranceName;
    this.practiceNumber = practiceNumber;
    this.practiceName = practiceName;
    this.turnStateNumber = turnStateNumber;
    this.turnStateName = turnStateName;
    this.uponTurn = uponTurn;
    this.observation = observation;
  }
}
