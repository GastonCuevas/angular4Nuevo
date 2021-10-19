export class PharmacyScheme {
  id: number;
  hcId: number;
  idCode: string;
  articleCode: string;
  articleName: string;
  quantity: number;
  date: Date;
  time: string;
  type: number;
  observation: string;
  quantityWithOutChanges: number;
  typeText: string;

  constructor(
    id: number = 0,
    hcId: number = 0,
    idCode: string,
    articleCode: string,
    articleName: string,
    quantity: number = 0,
    date: Date,
    time: string,
    type: number,
    observation: string,
    quantityWithOutChanges: number = 0,
    typeText: string
  ) {
    this.id = id;
    this.hcId = hcId;
    this.idCode = idCode;
    this.articleCode = articleCode;
    this.articleName = articleName;
    this.quantity = quantity;
    this.date = date;
    this.time = time;
    this.type = type;
    this.observation = observation;
    this.quantityWithOutChanges = quantityWithOutChanges;
    this.typeText = typeText;
  }
}

export class PharmacySchemeLiq {
  id: number;
  code: string;
  description: string;
  depos: number;
  observation: string;
  quantity: number;
  type: number;
  typeText: string;
  price: number;
  total: number;

  constructor(
    id: number = 0,
    code: string,
    description: string,
    depos: number,
    observation: string,
    quantity: number = 0,
    type: number,
    typeText: string,
    price: number,
    total: number
  ) {
    this.id = id;
    this.code = code;
    this.description = description;
    this.depos = depos;
    this.observation = observation;
    this.quantity = quantity;
    this.type = type;
    this.typeText = typeText;
    this.price = price;
    this.total = total;
  }
}

export class MedicationScheme {
  id: number;
  hcId: number;
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

  constructor(
    id: number = 0,
    hcId: number = 0,
    dateIni: Date,
    dateEnd: Date,
    observation: string,
    medicines: Array<Medicine>
  ) {
    this.id = id;
    this.hcId = hcId;
    this.dateIni = dateIni;
    this.dateEnd = dateEnd;
    this.observation = observation;
    this.medicines = medicines;
  }
}

export class Medicine {
  id: number;
  hcSchemeId: number;
  articleCode: string;
  articleName: string;
  quantity: number;
  quantityWithOutChanges: number;
  time: string;
  type: number;

  constructor(
    id: number = 0,
    hcSchemeId: number = 0,
    articleCode: string,
    articleName: string,
    quantity: number = 0,
    quantityWithOutChanges: number = 0,
    time: string,
    type: number = 0
  ) {
    this.id = id;
    this.hcSchemeId = hcSchemeId;
    this.articleCode = articleCode;
    this.articleName = articleName;
    this.quantity = quantity;
    this.quantityWithOutChanges = quantityWithOutChanges;
    this.time = time;
    this.type = type;
  }
}
