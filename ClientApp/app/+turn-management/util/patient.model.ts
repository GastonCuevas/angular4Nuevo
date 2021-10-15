import { PatientMedicalInsurance } from './patient-mi.model';

export class Patient {
    patientNumber: number;
    patientName: string;
    patientIdentifierType: number;
    patientIdentifier: string;
    locality: number;
    zone: number;
    medicalInsurances: Array<PatientMedicalInsurance> = new Array<PatientMedicalInsurance>();;

    public constructor() {}

}