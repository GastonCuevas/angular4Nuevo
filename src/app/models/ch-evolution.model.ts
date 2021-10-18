import { ClinicItem } from './clinic-item.model';
import { ClinicTable } from './clinic-table.model';
import { PharmacyScheme } from './pharmacy-scheme.model';

export class CHEvolution {
  id = 0;
  date: string;
  patientMovementId: number;
  patientId: number;
  patientName: string;
  medicalInsuranceId: number;
  medicalInsuranceName: string;
  specialtyId: number;
  professionalId: number;
  professionalName: number;
  practiceId: number;
  practiceName: string;
  hcItems: Array<ClinicItem>;
  hcTables: Array<ClinicTable>;
  pharmacySchemes?: Array<PharmacyScheme>;
  specialtyName?: string;

  constructor(
    date: string,
    patientMovementId: number,
    patientId: number,
    patientName: string,
    medicalInsuranceId: number,
    medicalInsuranceName: string,
    specialtyId: number,
    professionalId: number,
    professionalName: number,
    practiceId: number,
    practiceName: string,
    hcItems: Array<ClinicItem>,
    hcTables: Array<ClinicTable>,
    pharmacySchemes?: Array<PharmacyScheme>,
    specialtyName?: string
  ) {
    this.date = date;
    this.patientMovementId = patientMovementId;
    this.patientId = patientId;
    this.patientName = patientName;
    this.medicalInsuranceId = medicalInsuranceId;
    this.medicalInsuranceName = medicalInsuranceName;
    this.specialtyId = specialtyId;
    this.professionalId = professionalId;
    this.professionalName = professionalName;
    this.practiceId = practiceId;
    this.practiceName = practiceName;
    this.hcItems = hcItems;
    this.hcTables = hcTables;
    this.pharmacySchemes = pharmacySchemes;
    this.specialtyName = specialtyName;
  }
}
