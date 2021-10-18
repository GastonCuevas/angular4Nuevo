import { ClinicHistory } from './';

// export class ClinicHistoryList {
//     patientName: string;
//     evolutions: Array<ClinicHistory>;
//     hiddenEvolutions: boolean = false;
// }

export class ClinicHistoryList {
    id : number;
    key: any;
    movementWithEvolutions: Array<MovementPatient>;
    hiddenMPs = false;
    hiddenDiag = false;
    diagnosticLast?: DiagnosticMovement;
    pharmacySchemeLast: Array<PharmacyScheme>;
    gettedPharmacyAndDiagnostic: boolean;
    dateIni: string;
    dateEnd: string;
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
    hiddenEvolutions = false;
}

import { ClinicItem } from './clinic-item.model';
import { ClinicTable } from './clinic-table.model';
import { PharmacyScheme } from '../models/pharmacy-scheme.model';
import { DiagnosticMovement } from './diagnostic-movement.model';

class ClinicHistoryEvolution {
    id = 0;
    date: string;
    patientId: number;
    patientName?: string;
    practiceId: number;
    practiceName?: string;
    professionalId: number;
    professionalName?: string;
    specialtyId: number;
    specialtyName?: string;
    patientMovementId: number = 0;
    medicalInsuranceName?: string;
    medicalInsuranceId?: number;
    hcItems = new Array<ClinicItem>();
    hcTables = new Array<ClinicTable>();
    macySchemes = new Array<PharmacyScheme>();
    diagnostics = new Array<DiagnosticMovement>();
}