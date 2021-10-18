import { ContractOsPractice } from './contract-os-practice.model';

export class ContractOs {
<<<<<<< HEAD
  number: number;
=======
  number: number = 0;
>>>>>>> 3cdeefcb8c69834480dfd82b68f95c2ffea635c1
  medicalInsuranceNumber: number;
  medicalInsuranceName: string;
  dateFrom: string;
  dateTo: string;
  observation: string;
  description: string;
  practices: Array<ContractOsPractice> = new Array<ContractOsPractice>();

  constructor(
    number: number,
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
