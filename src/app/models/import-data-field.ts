export class ImportDataField {
  id: number;
  importId: number;
  name: string;
  from: string;
  to: string;
  valid: boolean;
  formula?: string;
  key?: boolean;
  foreignKey?: boolean;
  index?: number;

  constructor(
    id: number,
    importId: number,
    name: string,
    from: string,
    to: string,
    valid: boolean,
    formula?: string,
    key?: boolean,
    foreignKey?: boolean,
    index?: number
  ) {
    this.id = id;
    this.importId = importId;
    this.name = name;
    this.from = from;
    this.to = to;
    this.valid = valid;
    this.formula = formula;
    this.key = key;
    this.foreignKey = foreignKey;
    this.index = index;
  }
}
