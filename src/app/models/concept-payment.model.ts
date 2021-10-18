export class ConceptPayment {
  number: number;
  code: string;
  description: string;
  price: number;
  quantity: number;

  constructor(
    number: number,
    code: string,
    description: string,
    price: number,
    quantity: number
  ) {
    this.number = number;
    this.code = code;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
  }
}
