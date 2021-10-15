export class PatientMedicalInsurance {
    id: number;
    patientNumber: number;
    socialNumber: number;
    socialName: string;
    carnetNumber: string;
    expirationDate: Date | string;
    fDueDate: string;
    byDefault: boolean = false;
    isParticular: boolean = false;

    constructor() {}
}