import { PharmacySchemeDetail } from "./pharmacy-scheme-detail";

export class PharmacySchemeView {
    id = 0;
    EvolutionId = 0;
    dateIni: string;
    dateEnd: string;
    dateCheked: string;
    observation: string;
    professionalId: string;
    professionalName: string;
    sectorId: number;
    sectorName: string;
    username: string;

    checked = false;
    schemeDetail: Array<PharmacySchemeDetail>;
}