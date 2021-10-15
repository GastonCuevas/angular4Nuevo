export class PharmacySchemeDetail {
    id: number;
    hcSchemeId: number;
    articleCode: string;
    articleName: string;
    quantity = 0;
    quantityWithOutChanges = 0;
    date: Date;
    time: string;
    observation: string;
    typeText: string;
    type: number;
    detailId: number;
    depos: number;

    selected = false;
}