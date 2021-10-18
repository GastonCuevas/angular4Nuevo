export class ClinicItem {
  id: number;
  hcId: number;
  itemId: number;
  value: string;

  constructor(id: number = 0, hcId: number = 0, itemId: number, value: string) {
    this.id = id;
    this.hcId = hcId;
    this.itemId = itemId;
    this.value = value;
  }
}
