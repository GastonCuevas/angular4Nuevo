export class TreatingProfessional {
  id: number;
  professionalId: number;
  professionalName: string;
  bedmovementId: number;

  constructor(
    id: number,
    professionalId: number,
    professionalName: string,
    bedmovementId: number
  ) {
    this.id = id;
    this.professionalId = professionalId;
    this.professionalName = professionalName;
    this.bedmovementId = bedmovementId;
  }
}
