export class ExportationEntry {
  number: number;
  expedientNumber: number;
  name: string;
  key: string;
  type: string;
  tableFo?: string;
  fieldFo?: string;

  constructor(
    number: number,
    expedientNumber: number,
    name: string,
    key: string,
    type: string,
    tableFo?: string,
    fieldFo?: string
  ) {
    this.number = number;
    this.expedientNumber = expedientNumber;
    this.name = name;
    this.key = key;
    this.type = type;
    this.tableFo = tableFo;
    this.fieldFo = fieldFo;
  }
}
