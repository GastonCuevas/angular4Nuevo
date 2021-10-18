export class ContractOsPractice {
  number: number;
  contractNumber: number;
  practiceNumber: number;
  practiceName: string;
  code?: string;
  coinsurance?: number;
  price: number;
  medicalCoverage: number;
  medical: number;
  facturable: boolean;
  coinsuranceFac: boolean;

  constructor(
    number: number = 0,
    contractNumber: number = 0,
    practiceNumber: number,
    practiceName: string,
    code?: string,
    coinsurance?: number,
    price: number = 0,
    medicalCoverage: number = 100,
    medical: number = 0,
    facturable: boolean = true,
    coinsuranceFac: boolean = true
  ) {
    this.number = number
    this.contractNumber = contractNumber
    this.practiceNumber = practiceNumber
    this.practiceName = practiceName
    this.code = code
    this.coinsurance = coinsurance
    this.price = price
    this.medicalCoverage = medicalCoverage
    this.medical = medical
    this.facturable = facturable
    this.coinsuranceFac = coinsuranceFac
  }
}
