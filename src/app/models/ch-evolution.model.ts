import { ClinicItem } from "./clinic-item.model";
import { ClinicTable } from "./clinic-table.model";
import { PharmacyScheme } from "./pharmacy-scheme.model";

export class CHEvolution {
    id = 0;
    date: string;
    patientMovementId: number;
    patientId: number;
    patientName: string;
    medicalInsuranceId: number;
    medicalInsuranceName: string;
    specialtyId: number;
    specialtyName?: string;
    professionalId: number;
    professionalName: number;
    practiceId: number;
    practiceName: string;

    hcItems: Array<ClinicItem>;
    hcTables: Array<ClinicTable>;
    pharmacySchemes?: Array<PharmacyScheme>;
}