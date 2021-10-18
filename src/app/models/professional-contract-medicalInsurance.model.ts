export class ProfessionalContractMedicalInsurance {
  numint: number;
  contractNumber: number;
  medicalInsuranceNumber: number;
  medicalInsuranceName: string;
  practiceNumber: number;
  practiceName: string;
  retention: number;
  coinsurancePercentage: number;
  porcob: boolean = false;
  factor?: number;
  fixed?: number;
  index?: number;

  constructor(
    numint: number,
    contractNumber: number,
    medicalInsuranceNumber: number,
    medicalInsuranceName: string,
    practiceNumber: number,
    practiceName: string,
    retention: number,
    coinsurancePercentage: number,
    porcob: boolean,
    factor?: number,
    fixed?: number,
    index?: number
  ) {
    this.numint = numint;
    this.contractNumber = contractNumber;
    this.medicalInsuranceNumber = medicalInsuranceNumber;
    this.medicalInsuranceName = medicalInsuranceName;
    this.practiceNumber = practiceNumber;
    this.practiceName = practiceName;
    this.retention = retention;
    this.coinsurancePercentage = coinsurancePercentage;
    this.porcob = porcob;
    this.factor = factor;
    this.fixed = fixed;
    this.index = index;
  }
}
