import { PatientResponsible } from "./patient-responsible.model";
// import { Patient } from "./patient.model";

export class ResponsiblePatient {
  patientId: number;
  responsibleId: number;
  vigente: boolean = false;
  responsible: PatientResponsible;
  patientName: string;

  constructor(patientId: number, responsibleId: number, vigente: boolean = false, responsible: PatientResponsible, patientName: string) {
    this.patientId = patientId;
    this.responsibleId = responsibleId;
    this.vigente = vigente;
    this.responsible = responsible;
    this.patientId = patientId;
    this.patientName = patientName;
    this.responsible = new PatientResponsible();
  }
}
