export class HcTableItem {
  numInt: number;
  name: string;
  hcTableNumber: number;
  description: string;

  constructor(
    numInt: number,
    name: string,
    hcTableNumber: number,
    description: string
  ) {
    this.numInt = numInt;
    this.name = name;
    this.hcTableNumber = hcTableNumber;
    this.description = description;
  }
}
