export class LiquidateConcept {
  number: number;
  liquidationId: number;
  conceptId: number;
  conceptCode: string;
  conceptDescription: string;
  count: number;
  total: number;
  price: number;
  orderReport: number;

  constructor(
    number = 0,
    liquidationId = 0,
    conceptId: number,
    conceptCode: string,
    conceptDescription: string,
    count: number,
    total: number,
    price: number,
    orderReport: number = 0
  ) {
    this.number = number;
    this.liquidationId = liquidationId;
    this.conceptId = conceptId;
    this.conceptCode = conceptCode;
    this.conceptDescription = conceptDescription;
    this.count = count;
    this.total = total;
    this.price = price;
    this.orderReport = orderReport;
  }
}
