export class PharmacyScheme {
    id = 0;
    hcId = 0;
    idCode: string;
    articleCode: string;
    articleName: string;
    quantity = 0;
    date: Date;
    time: string;
    type: number;
    observation: string;
    quantityWithOutChanges = 0;
    typeText: string;
}

export class PharmacySchemeLiq {
    id = 0;
    code: string;
    description: string;
    depos: number;
    observation: string;
    quantity = 0;
    type: number;
    typeText: string;
    price: number;
    total: number;
}

export class MedicationScheme {
    id = 0;
    hcId = 0;
    dateIni: Date;
	dateEnd: Date;
    //idCode: string;
    //articleCode: string;
    //articleName: string;
    //quantity = 0;
    //date: Date;
    //time: string;
    //posology: number = 0;
    observation: string;
    //quantityWithOutChanges = 0;
    medicines: Array<Medicine>;
}

export class Medicine {
    id = 0;
    hcSchemeId = 0;
    articleCode: string;
    articleName: string;
    quantity = 0;
    quantityWithOutChanges = 0;
    time: string;
    type: 0
}