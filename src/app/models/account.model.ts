export class Account {
  type: number;
  number: number;
  name: string;
  surname: string;
  denomination: string;
  address: string;
  locality: number;
  localityName: string;
  province: number;
  provinceName: string;
  zone: number;
  activity: number;
  identi: number;
  identiName: string;
  ivaReg: number;
  ibrReg: number;
  reggan: number;
  category: number;
  congan: number;
  vended: number;
  accountNumber: string;
  currency: number;
  activityAccount: any;
  aliibrAccount: any;
  categoryAccount: any;
  conganAccount: any;
  ibrRegAccount: any;
  identiAccount: any;
  ivaRegAccount: any;
  loc: Locality;
  regganAccount: any;
  vendedAccount: any;
  zoneAccount: any;
  numberInt?: number;
  quarter?: string;
  postalCode?: string;
  phone?: string;
  fax?: string;
  movil?: string;
  mail?: string;
  www?: string;
  repres?: string;
  cuit?: string;
  ingbru?: string;
  highDate?: Date | string | null;
  observation?: string;
  enabled: number;
  cause?: string;
  transp?: string;
  nropro?: number;
  bank?: string;
  cbu?: string;
  responsable?: string;
  path?: string;
  birthDate?: Date | string | null;
  accountLimit?: number;
  amount1?: number;
  amount2?: number;
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

  constructor(
    type: number = 0,
    denomination: string = '',
    number: number = 0,
    name: string = '',
    surname: string = '',
    address: string = '',
    locality: number = 0,
    localityName: string = '',
    province: number = 0,
    provinceName: string = '',
    zone: number = 0,
    activity: number = 0,
    identi: number = 0,
    identiName: string = '',
    ivaReg: number = 0,
    ibrReg: number = 0,
    reggan: number = 0,
    category: number = 0,
    congan: number = 0,
    vended: number = 0,
    accountNumber: string = '',
    currency: number = 0,
    activityAccount: any,
    aliibrAccount: any,
    categoryAccount: any,
    conganAccount: any,
    ibrRegAccount: any,
    identiAccount: any,
    ivaRegAccount: any,
    regganAccount: any,
    vendedAccount: any,
    zoneAccount: any,
    numberInt: number = 0,
    quarter: string = '',
    postalCode: string = '',
    phone: string = '',
    fax: string = '',
    movil: string = '',
    mail: string = '',
    www: string = '',
    repres: string = '',
    cuit: string = '',
    ingbru: string = '',
    highDate?: Date,
    observation: string = '',
    enabled: number = 1,
    cause: string = '',
    transp: string = '',
    nropro: number = 0,
    bank: string = '',
    cbu: string = '',
    responsable: string = '',
    path: string = '',
    birthDate?: Date,
    accountLimit: number = 0,
    amount1: number = 0,
    amount2: number = 0,
    numberCai: string = '',
    dateCai?: Date,
    aliibr: number = 0,
    text1: string = '',
    text2: string = '',
    number1: number = 0,
    number2: number = 0,
    date1?: Date,
    date2?: Date,
    boole1: number = 0,
    boole2: number = 0
  ) {
    this.denomination = denomination;
    this.type = type;
    this.number = number;
    this.name = name;
    this.surname = surname;
    this.address = address;
    this.locality = locality;
    this.localityName = localityName;
    this.province = province;
    this.provinceName = provinceName;
    this.zone = zone;
    this.activity = activity;
    this.identi = identi;
    this.identiName = identiName;
    this.ivaReg = ivaReg;
    this.ibrReg = ibrReg;
    this.reggan = reggan;
    this.category = category;
    this.congan = congan;
    this.vended = vended;
    this.accountNumber = accountNumber;
    this.currency = currency;
    this.activityAccount = activityAccount;
    this.aliibrAccount = aliibrAccount;
    this.categoryAccount = categoryAccount;
    this.conganAccount = conganAccount;
    this.ibrRegAccount = ibrRegAccount;
    this.identiAccount = identiAccount;
    this.ivaRegAccount = ivaRegAccount;
    this.loc = new Locality(this.province);
    this.regganAccount = regganAccount;
    this.vendedAccount = vendedAccount;
    this.zoneAccount = zoneAccount;
    this.numberInt = numberInt;
    this.quarter = quarter;
    this.postalCode = postalCode;
    this.phone = phone;
    this.fax = fax;
    this.movil = movil;
    this.mail = mail;
    this.www = www;
    this.repres = repres;
    this.cuit = cuit;
    this.ingbru = ingbru;
    this.highDate = highDate;
    this.observation = observation;
    this.enabled = enabled;
    this.cause = cause;
    this.transp = transp;
    this.nropro = nropro;
    this.bank = bank;
    this.cbu = cbu;
    this.responsable = responsable;
    this.path = path;
    this.birthDate = birthDate;
    this.accountLimit = accountLimit;
    this.amount1 = amount1;
    this.amount2 = amount2;
    this.numberCai = numberCai;
    this.dateCai = dateCai;
    this.aliibr = aliibr;
    this.text1 = text1;
    this.text2 = text2;
    this.number1 = number1;
    this.number2 = number2;
    this.date1 = date1;
    this.date2 = date2;
    this.boole1 = boole1;
    this.boole2 = boole2;
  }
}

class Locality {
  province: number;
  constructor(province: number) {
    this.province = province;
  }
}
