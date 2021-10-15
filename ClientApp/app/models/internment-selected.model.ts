export class InternmentSelected {
    id: number = 0;
    admissionDate: string | Date = new Date();
    time: string;
    bedName: string;
    professionalName: string;
    patientName: string;
    sectorName: string;
    selected: boolean = false;
    hcId: number;

    constructor() {
        this.selected = false;        
    }
}