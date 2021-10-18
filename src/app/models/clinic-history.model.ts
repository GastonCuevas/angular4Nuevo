import { ClinicItem } from './clinic-item.model';
import { ClinicTable } from './clinic-table.model';
import {
  PharmacyScheme,
  MedicationScheme,
} from '../models/pharmacy-scheme.model';
import { DiagnosticMovement } from './diagnostic-movement.model';

export class ClinicHistory {
  id: number;
  date: string;
  patientId: number;
  practiceId: number;
  professionalId: number;
  patientMovementId: number;
  hcItems: Array<ClinicItem>;
  hcTables: Array<ClinicTable>;
  pharmacySchemes: Array<MedicationScheme>;
  diagnostics: Array<DiagnosticMovement>;
  patientName?: string;
  practiceName?: string;
  professionalName?: string;
  specialtyId?: number;
  specialtyName?: string;
  medicalInsuranceName?: string;
  medicalInsuranceId?: number;

  public constructor(
    id: number = 0,
    date: string,
    patientId: number,
    practiceId: number,
    professionalId: number,
    patientMovementId: number = 0,
    hcItems: Array<ClinicItem> = new Array<ClinicItem>(),
    hcTables: Array<ClinicTable> = new Array<ClinicTable>(),
    pharmacySchemes: Array<MedicationScheme> = new Array<MedicationScheme>(),
    diagnostics: Array<DiagnosticMovement> = new Array<DiagnosticMovement>(),
    patientName?: string,
    practiceName?: string,
    professionalName?: string,
    specialtyId?: number,
    specialtyName?: string,
    medicalInsuranceName?: string,
    medicalInsuranceId?: number
  ) {
    this.id = id;
    this.hcItems = hcItems;
    this.hcTables = hcTables;
    this.date = date;
    this.patientId = patientId;
    this.practiceName = practiceName;
    this.practiceId = practiceId;
    this.professionalId = professionalId;
    this.patientMovementId = patientMovementId;
    this.pharmacySchemes = pharmacySchemes;
    this.diagnostics = diagnostics;
    this.patientName = patientName;
    this.professionalName = professionalName;
    this.specialtyId = specialtyId;
    this.specialtyName = specialtyName;
    this.medicalInsuranceId = medicalInsuranceId;
    this.medicalInsuranceName = medicalInsuranceName;
  }
}
