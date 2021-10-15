import { MedicalInsurance } from "./medical-insurance.model";
import { Account } from "./account.model";

export class PatientMedicalInsurance {
    number?: number;
    carnetNumber: string;
    byDefault: boolean = false;
    expirationDate: string;
    patientNumber: any;
    socialNumber: number;
    medicalInsurance: MedicalInsurance = new MedicalInsurance();
    patientName: string;
    medicalInsuranceName: string;
    patient: Account = new Account();
    yesOrNo: string;
    
    constructor(){
    }
}