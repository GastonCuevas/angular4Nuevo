export class Account{
    numberInt?: number;
    type: number;
    number: number;
    name: string;
    surname: string;
    denomination = '';
    address: string;
    quarter?: string;
    locality: number;
    localityName: string;
    province: number;
    provinceName: string;
    postalCode?: string;
    phone?: string;
    fax?: string;
    movil?: string;
    mail?: string;
    www?: string;
    zone: number;
    repres?: string;
    activity: number;
    identi: number;
    identiName: string;
    cuit?: string;
    ivaReg: number;
    ibrReg: number;
    reggan: number;
    ingbru?: string;
    highDate?: Date | string | null;
    observation?: string;
    category: number;
    enabled?: number;
    cause?: string;
    transp?: string;
    nropro?: number;
    congan: number;
    bank?: string;
    cbu?: string;
    responsable?: string;
    path?: string;
    birthDate?: Date | string | null;
    accountLimit?: number;
    amount1?: number;
    amount2?: number;
    vended: number;
    accountNumber: string;
    numberCai?: string;
    dateCai?: Date;
    aliibr?: number;
    text1?: string;
    text2?: string;
    number1?: number;
    number2?: number;
    date1?: Date;
    date2?: Date;
    boole1?: number;
    boole2?: number;
    currency: number;

    activityAccount:any;
    aliibrAccount:any;
    categoryAccount:any;
    conganAccount:any;
    ibrRegAccount:any;
    identiAccount:any;
    ivaRegAccount:any;
    loc = new Locality();
    regganAccount:any;
    vendedAccount:any;
    zoneAccount:any;

    constructor(){
        this.enabled = 1;
    }
}

class Locality {
    province: number;
}