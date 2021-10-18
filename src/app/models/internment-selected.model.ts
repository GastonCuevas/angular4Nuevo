export class InternmentSelected {
  id: number = 0;
  admissionDate: string | Date;
  time: string;
  bedName: string;
  professionalName: string;
  patientName: string;
  sectorName: string;
  selected: boolean;
  hcId: number;

  constructor(
    id: number,
    admissionDate: string | Date = new Date(),
    time: string,
    bedName: string,
    professionalName: string,
    patientName: string,
    sectorName: string,
    selected: boolean = false,
    hcId: number
  ) {
    this.id = id;
    this.admissionDate = admissionDate;
    this.time = time;
    this.bedName = bedName;
    this.professionalName = professionalName;
    this.patientName = patientName;
    this.sectorName = sectorName;
    this.selected = selected;
    this.hcId = hcId;
  }
}
