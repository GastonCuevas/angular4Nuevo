import { Professional } from "./professional.model";

export class ProfessionalContractAbsence {
  contractNumber: number;
  dateFrom: string;
  dateTo: string;
  editionDate: string;
  motiveName: string;
  professional: Professional;
  observation?: string;
  motive?: string;
  canEdit: boolean;

  constructor(
    contractNumber: number = NaN,
    dateFrom: string = '',
    dateTo: string = '',
    editionDate: string,
    motiveName: string,
    professional: Professional,
    observation?: string,
    motive?: string,
    canEdit = false
  ) {
    this.contractNumber = contractNumber;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.editionDate = editionDate;
    this.motiveName = motiveName;
    this.professional = professional;
    this.observation = observation;
    this.motive = motive;
    this.canEdit = canEdit;
    // this.editionDate = new Date();
  }
}
