import { ClinicItem } from "./clinic-item.model";
import { ClinicTable } from "./clinic-table.model";
import { PharmacyScheme, MedicationScheme } from "./pharmacy-scheme.model";

export class HcEvolution {
    id: number = 0;
    date: string;
    patientMovementId: number;
    specialtyId: number;
    specialtyName?: string;
    professionalId: number;
    professionalName: number;
    practiceId: number;
    practiceName?: string;

    hcItems: Array<ClinicItem>;
    hcTables: Array<ClinicTable>;
    pharmacySchemes?: Array<MedicationScheme>;

    public constructor() {
        // this.hcItems = new Array<ClinicItem>();
        // this.hcTables = new Array<ClinicTable>();
        // this.pharmacySchemes = new Array<PharmacyScheme>();
    }
}