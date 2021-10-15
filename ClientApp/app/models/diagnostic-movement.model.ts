export class DiagnosticMovement {
    id: number;
    idCode: number;
    patientMovementId: number;
    diagnosticId: number;
    name: string;
    hierarchy: number;
    date: Date;
    isFromInternment?: boolean;
}