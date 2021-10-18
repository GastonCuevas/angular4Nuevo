export class ProfessionalContractMedicalInsurance {
  numint: number;
  contractNumber: number;
  medicalInsuranceNumber: number;
  medicalInsuranceName: string;
  practiceNumber: number;
  practiceName: string;
  retention: number;
  coinsurancePercentage: number;
  factor?: number;
  porcob: boolean;
  fixed?: number;
  index?: number;

  constructor(
    numint: number,
    contractNumber: number,
    medicalInsuranceNumber: number,
    medicalInsuranceName: string,
    practiceNumber: number,
    practiceName: string,
    coinsurancePercentage: number,
    retention: number,
    factor?: number,
    porcob: boolean = false,
    fixed?: number,
    index?: number
  ) {
    this.numint = numint;
    this.contractNumber = contractNumber;
    this.medicalInsuranceNumber = medicalInsuranceNumber;
    this.medicalInsuranceName = medicalInsuranceName;
    this.practiceNumber = practiceNumber;
    this.practiceName = practiceName;
    this.factor = factor;
    this.porcob = porcob;
    this.fixed = fixed;
    this.index = index;
    this.retention = retention;
    this.coinsurancePercentage = coinsurancePercentage;
  }
}
