export class PharmacyReport {
    id: number;
    date: string;
    days: number;
    username: string;
    checkedDate: string;
    observation: string;
    printDate: string;
    dateFrom: string;
    dateTo: string;
    type: string;
    pharmacyGroups: Array<PharmacyGroupReport>;
}

export class PharmacyGroupReport{
    sectorName: string;
    articleCode: string;
    patientName: string;
    detail: Array<PharmacySchemeReport>;
}

class PharmacySchemeReport{
    id: number;
    creationDate: string;
    days: number;
    username: string;
    patientName: string;
    sectorName: string;
    schemeId: number;
    consumitionId: number;
    detailId: number;
    typeName: string;
    quantity: number;
    articleCode: string;
    articleName: string;
    consumitionDate: string;
}