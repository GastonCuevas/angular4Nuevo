import { ProfessionalContractSchedule } from "./professional-contract-schedule.model";
import { ProfessionalContractMedicalInsurance } from "./professional-contract-medicalInsurance.model";
import { ProfessionalContractAbsence } from "./professional-contract-absence.model";
import { Professional } from "./professional.model";

export class ContractProfessional {
  number: number;
  professionalNumber: number;
  professionalName: string;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  observation: string;
  description: string;
  schedules: Array<ProfessionalContractSchedule>;
  medicalInsuranceContracts: Array<ProfessionalContractMedicalInsurance>;
  absences: Array<ProfessionalContractAbsence>;

  professional: Professional;
  fixedAmount: number;
  priceHs: number;

  constructor(
    number?: number,
    professionalNumber?: number,
    professionalName?: string,
    dateFrom?: Date,
    dateTo?: Date,
    observation?: string,
    description?: string,
    schedules?: Array<ProfessionalContractSchedule>,
    medicalInsuranceContracts?: Array<ProfessionalContractMedicalInsurance>,
    absences?: Array<ProfessionalContractAbsence>,
    professional: Professional = new Professional(),
    fixedAmount: number = 0,
    priceHs: number = 0
  ) {
    this.number = number || NaN;
    this.professionalNumber = professionalNumber || NaN;
    this.professionalName = professionalName || "";
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.observation = observation || "";
    this.description = description || "";
    this.schedules = schedules || new Array<ProfessionalContractSchedule>();
    this.medicalInsuranceContracts = medicalInsuranceContracts || new Array<ProfessionalContractMedicalInsurance>();
    this.absences = absences || new Array<ProfessionalContractAbsence>();
    this.professional = professional;
    this.fixedAmount = fixedAmount;
    this.priceHs = priceHs;
  }
}
