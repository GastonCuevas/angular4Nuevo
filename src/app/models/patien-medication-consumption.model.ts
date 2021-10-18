export class PatientMedicationConsumption {
  id: number;
  patientMovementId: number;
  articleCode: string;
  quantity: number;
  observation: string;

  constructor(
    id: number,
    patientMovementId: number,
    articleCode: string,
    quantity: number,
    observation: string
  ) {
    this.id = id
    this.patientMovementId = patientMovementId
    this.articleCode = articleCode
    this.quantity = quantity
    this.observation = observation
  }
}
