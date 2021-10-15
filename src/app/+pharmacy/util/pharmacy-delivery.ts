import { PharmacyScheme } from "./models";

export class PharmacyDelivery {
    checkedDate: string;
    date: string;
    time: string;
    days: number;
    pharmacySchemes: Array<PharmacyScheme>;
    patmovIds: Array<number>;
    printDate: string;
    dateFrom: string;
    dateTo: string;
    type: string;
    enableStock:boolean;
    constructor() {
        this.pharmacySchemes = new Array<PharmacyScheme>();
    }
}