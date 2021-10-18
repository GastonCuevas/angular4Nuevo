export class Concept {
  number: number;
  code: string;
  description: string;
  price: number;
  type: number;

  constructor(
    number: number,
    code: string,
    description: string,
    price: number,
    type: number
  ) {
    this.number = number;
    this.code = code;
    this.description = description;
    this.price = price;
    this.type = type;
  }
}
