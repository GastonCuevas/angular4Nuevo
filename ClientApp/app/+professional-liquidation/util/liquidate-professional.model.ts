import { LiquidatePractice } from './liquidate-practice.model';
import { LiquidateConcept } from '../../models/liquidate-concept.model';

export class LiquidateProfessional {
    number = 0;
    dateFrom: string;
    dateTo: string;
    dateGeneration: string;
    total = 0;
    professionalNumber: number;
    professionalName: string;
    liquidations = new Array<LiquidatePractice>();
    concepts = new Array<LiquidateConcept>();
}