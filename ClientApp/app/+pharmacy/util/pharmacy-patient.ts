import { PharmacyScheme } from "./pharmacy-scheme";

export class PharmacyPatient {
    patMovId: number;
    clinicHistoryNumber: string;
    admissionDate: string;
    time: string;
    patientName: string;
    professionalName: string;
    medicalInsuranceName: string;
    sectorId: number;
    sectorName: string;
    
    lastScheme: PharmacyScheme;
    selectedPatient = false;
}