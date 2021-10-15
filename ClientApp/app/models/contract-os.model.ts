import { ContractOsPractice } from './contract-os-practice.model';

export class ContractOs {
    number: number = 0;
    medicalInsuranceNumber: number;
    medicalInsuranceName: string;
    dateFrom: string;
    dateTo: string;
    observation: string;
    description: string;
    practices: Array<ContractOsPractice> = new Array<ContractOsPractice>();

    constructor(){
    }
}