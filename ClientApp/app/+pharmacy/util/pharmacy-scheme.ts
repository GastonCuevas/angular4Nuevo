import { PharmacySchemeDetail } from "./pharmacy-scheme-detail";

export class PharmacyScheme {
    id = 0;
    evolutionId = 0;
    dateIni: Date;
    dateEnd: Date;
    sectorId: number;
    sectorName: string;
    patientName: string;
    observation: string;
    schemeDetail: Array<PharmacySchemeDetail>;

    hcId: number;
    medicines: Array<PharmacySchemeDetail>;
    selected = false;

    constructor(m?:Array<PharmacySchemeDetail>) {
        this.medicines = m || new Array<PharmacySchemeDetail>();
        this.schemeDetail = new Array<PharmacySchemeDetail>();
    }
}