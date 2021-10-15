import { ClinicItem } from './clinic-item.model';
import { ClinicTable } from './clinic-table.model';
import { PharmacyScheme, MedicationScheme } from '../models/pharmacy-scheme.model';
import { DiagnosticMovement } from './diagnostic-movement.model';

export class ClinicHistory {
    id: number = 0;
    date: string;
    patientId: number;
    patientName?: string;
    practiceId: number;
    practiceName?: string;
    professionalId: number;
    professionalName?: string;
    specialtyId?: number;
    specialtyName?: string;
    patientMovementId: number = 0;
    medicalInsuranceName?: string;
    medicalInsuranceId?: number;
    hcItems: Array<ClinicItem>;
    hcTables: Array<ClinicTable>;
    pharmacySchemes?: Array<MedicationScheme>;
    diagnostics?: Array<DiagnosticMovement>

    public constructor() {
        this.hcItems = new Array<ClinicItem>();
        this.hcTables = new Array<ClinicTable>();
        this.pharmacySchemes = new Array<MedicationScheme>();
        this.diagnostics = new Array<DiagnosticMovement>();
    }

}