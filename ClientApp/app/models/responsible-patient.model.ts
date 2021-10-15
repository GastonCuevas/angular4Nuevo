import { PatientResponsible } from "./patient-responsible.model";
import { Patient } from "./patient.model";

export class ResponsiblePatient {
    patientId: number;
    responsibleId: number;
    vigente: boolean = false;
    responsible: PatientResponsible;
    patientName: string;

    constructor() {
        this.responsible = new PatientResponsible();
    }
}