import { ClinicItem } from "./clinic-item.model";
import { ClinicTable } from "./clinic-table.model";
import { MedicationScheme } from "./pharmacy-scheme.model";

export class HcEvolution {
  id: number;
  date: string;
  patientMovementId: number;
  specialtyId: number;
  specialtyName: string;
  professionalId: number;
  professionalName: number;
  practiceId: number;
  practiceName: string;

  hcItems: Array<ClinicItem>;
  hcTables: Array<ClinicTable>;
  pharmacySchemes?: Array<MedicationScheme>;

  constructor(
    id: number = 0,
    date: string,
    patientMovementId: number,
    specialtyId: number,
    specialtyName: string = '',
    professionalId: number,
    professionalName: number,
    practiceId: number,
    practiceName: string = '',
    hcItems: Array<ClinicItem>,
    hcTables: Array<ClinicTable>,
    pharmacySchemes?: Array<MedicationScheme>
  ) {
    this.id = id;
    this.date = date;
    this.patientMovementId = patientMovementId;
    this.specialtyId = specialtyId;
    this.specialtyName = specialtyName;
    this.professionalId = professionalId;
    this.professionalName = professionalName;
    this.practiceId = practiceId;
    this.practiceName = practiceName;
    this.hcItems = hcItems;
    this.hcTables = hcTables;
    this.pharmacySchemes = pharmacySchemes;
  }
}
