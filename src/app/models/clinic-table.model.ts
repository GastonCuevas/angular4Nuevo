export class ClinicTable {
  id: number;
  hcId: number;
  itemId: number;
  itemName: string;
  tableId: number;
  tableName: string;

  constructor(
    id: number = 0,
    hcId: number = 0,
    itemId: number,
    itemName: string,
    tableId: number,
    tableName: string
  ) {
    this.id = id;
    this.hcId = hcId;
    this.itemId = itemId;
    this.itemName = itemName;
    this.tableId = tableId;
    this.tableName = tableName;
  }
}
