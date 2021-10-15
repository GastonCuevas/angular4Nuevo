import { LiquidatePractice } from './liquidate-practice.model';
import { LiquidateConcept } from '../../models/liquidate-concept.model';
import { PharmacySchemeLiq } from '../../models/pharmacy-scheme.model';

export class LiquidateMedicalInsurance {
    number: number;
    dateFrom: string;
    dateTo: string;
    dateGeneration: string;
    state: string;
    balance: number;
    saldo: number;
    medicalInsuranceNumber:number;
    medicalInsuranceName:string;
    showPractices: boolean;
    liquidations = new Array<LiquidatePractice>();
    concepts = new Array<LiquidateConcept>();
    medicines = new Array<PharmacySchemeLiq>();
}