export class ProfessionalContractConcept {
  number: number;
  conceptId: number;
  description: string;
  code: string;
  type: number;
  fullDescription: string;
  contractNumber: number;
  price: number;
  quantity: number;

  constructor(
    number: number,
    conceptId: number,
    description: string,
    code: string,
    type: number,
    fullDescription: string,
    contractNumber: number,
    price: number,
    quantity: number
  ) {
    this.number = number;
    this.conceptId = conceptId;
    this.description = description;
    this.code = code;
    this.type = type;
    this.fullDescription = fullDescription;
    this.contractNumber = contractNumber;
    this.price = price;
    this.quantity = quantity;
  }
}
