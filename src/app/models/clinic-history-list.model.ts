import { ClinicHistory } from './';

// export class ClinicHistoryList {
//     patientName: string;
//     evolutions: Array<ClinicHistory>;
//     hiddenEvolutions: boolean = false;
// }

export class ClinicHistoryList {
  id: number;
  key: any;
  movementWithEvolutions: Array<MovementPatient>;
  hiddenMPs: boolean;
  hiddenDiag: boolean;
  diagnosticLast?: DiagnosticMovement;
  pharmacySchemeLast: Array<PharmacyScheme>;
  gettedPharmacyAndDiagnostic: boolean;
  dateIni: string;
  dateEnd: string;

  constructor(
    id: number,
    key: any,
    movementWithEvolutions: Array<MovementPatient>,
    hiddenMPs: boolean = false,
    hiddenDiag: boolean = false,
    pharmacySchemeLast: Array<PharmacyScheme>,
    gettedPharmacyAndDiagnostic: boolean,
    dateIni: string,
    dateEnd: string,
    diagnosticLast?: DiagnosticMovement
  ) {
    this.id = id;
    this.key = key;
    this.movementWithEvolutions = movementWithEvolutions;
    this.hiddenMPs = hiddenMPs;
    this.hiddenDiag = hiddenDiag;
    this.diagnosticLast = diagnosticLast;
    this.pharmacySchemeLast = pharmacySchemeLast;
    this.gettedPharmacyAndDiagnostic = gettedPharmacyAndDiagnostic;
    this.dateIni = dateIni;
    this.dateEnd = dateEnd;
  }
}

export class MovementPatient {
  numInt: number;
  date: string;
  movementStateName: string;
  practiceName: string;
  professionalName: string;
  osName: string;
  turnDate: string;
  highDate: string;
  evolutions: Array<ClinicHistoryEvolution>;
  hiddenEvolutions: boolean;

  constructor(
    numInt: number,
    date: string,
    movementStateName: string,
    practiceName: string,
    professionalName: string,
    osName: string,
    turnDate: string,
    highDate: string,
    evolutions: Array<ClinicHistoryEvolution>,
    hiddenEvolutions: boolean = false
  ) {
    this.numInt = numInt;
    this.date = date;
    this.movementStateName = movementStateName;
    this.practiceName = practiceName;
    this.osName = osName;
    this.professionalName = professionalName;
    this.turnDate = turnDate;
    this.highDate = highDate;
    this.evolutions = evolutions;
    this.hiddenEvolutions = hiddenEvolutions;
  }
}

import { ClinicItem } from './clinic-item.model';
import { ClinicTable } from './clinic-table.model';
import { PharmacyScheme } from '../models/pharmacy-scheme.model';
import { DiagnosticMovement } from './diagnostic-movement.model';

class ClinicHistoryEvolution {
  id: number;
  date: string;
  patientId: number;
  practiceId: number;
  professionalId: number;
  specialtyId: number;
  patientMovementId: number;
  hcItems: Array<ClinicItem>;
  hcTables: Array<ClinicTable>;
  macySchemes: Array<PharmacyScheme>;
  diagnostics: Array<DiagnosticMovement>;
  patientName?: string;
  practiceName?: string;
  professionalName?: string;
  specialtyName?: string;
  medicalInsuranceName?: string;
  medicalInsuranceId?: number;

  constructor(
    id: number = 0,
    date: string,
    patientId: number,
    practiceId: number,
    professionalId: number,
    specialtyId: number,
    patientMovementId: number = 0,
    hcItems = new Array<ClinicItem>(),
    hcTables = new Array<ClinicTable>(),
    macySchemes = new Array<PharmacyScheme>(),
    diagnostics = new Array<DiagnosticMovement>(),
    patientName?: string,
    practiceName?: string,
    professionalName?: string,
    specialtyName?: string,
    medicalInsuranceName?: string,
    medicalInsuranceId?: number
  ) {
    this.id = id;
    this.date = date;
    this.patientId = patientId;
    this.practiceId = practiceId;
    this.professionalId = professionalId;
    this.specialtyId = specialtyId;
    this.patientMovementId = patientMovementId;
    this.hcItems = hcItems;
    this.hcTables = hcTables;
    this.macySchemes = macySchemes;
    this.diagnostics = diagnostics;
    this.patientName = patientName;
    this.practiceName = practiceName;
    this.professionalName = professionalName;
    this.specialtyName = specialtyName;
    this.medicalInsuranceName = medicalInsuranceName;
    this.medicalInsuranceId = medicalInsuranceId;
  }
}
