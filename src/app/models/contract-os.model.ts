import { ContractOsPractice } from './contract-os-practice.model';

export class ContractOs {
  number: number;
  medicalInsuranceNumber: number;
  medicalInsuranceName: string;
  dateFrom: string;
  dateTo: string;
  observation: string;
  description: string;
  practices: Array<ContractOsPractice> = new Array<ContractOsPractice>();

  constructor(
    number: number = 0,
    medicalInsuranceNumber: number,
    medicalInsuranceName: string,
    dateFrom: string,
    dateTo: string,
    observation: string,
    description: string,
    practices: Array<ContractOsPractice>
  ) {
    this.number = number;
    this.medicalInsuranceNumber = medicalInsuranceNumber;
    this.medicalInsuranceName = medicalInsuranceName;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.observation = observation;
    this.description = description;
    this.practices = practices;
  }
}
