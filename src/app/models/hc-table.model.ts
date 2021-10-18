import { HcTableItem } from './hc-table-item.model';

export class HcTable {
  number: number;
  name: string;
  description: string;
  hcTableItems: Array<HcTableItem>;

  constructor(
    number: number,
    name: string,
    description: string,
    hcTableItems: Array<HcTableItem> = new Array<HcTableItem>()
  ) {
    this.number = number;
    this.name = name;
    this.description = description;
    this.hcTableItems = hcTableItems;
  }
}
