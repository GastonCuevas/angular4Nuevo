export class DiagnosticMovement {
  id: number;
  idCode: number;
  patientMovementId: number;
  diagnosticId: number;
  name: string;
  hierarchy: number;
  date: Date;
  isFromInternment?: boolean;

  constructor(
    id: number,
    idCode: number,
    patientMovementId: number,
    diagnosticId: number,
    name: string,
    hierarchy: number,
    date: Date,
    isFromInternment?: boolean
  ) {
    this.id = id;
    this.idCode = idCode;
    this.patientMovementId = patientMovementId;
    this.diagnosticId = diagnosticId;
    this.name = name;
    this.hierarchy = hierarchy;
    this.date = date;
    this.isFromInternment = isFromInternment;
  }
}
