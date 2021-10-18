import { Professional } from "./professional.model";

export class ProfessionalContractAbsence {
    contractNumber: number;
    dateFrom: string;
    dateTo: string;
    observation?: string;
    motive?:string;
    editionDate: string;
    motiveName: string;
    professional: Professional;
    canEdit = false;

    constructor(
        contractNumber?: number,
        dateFrom?: string,
        dateTo?: string
    ) {
        this.contractNumber = contractNumber || NaN;
        this.dateFrom = dateFrom || '';
        this.dateTo = dateTo || '';
        // this.editionDate = new Date();
    } 
}