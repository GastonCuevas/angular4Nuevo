export class ImportDataField {
  id: number;
  importId: number;
  name: string;
  from: string;
  to: string;
  formula: string | undefined;
  key: boolean | undefined;
  foreignKey: boolean | undefined;
  index: number | undefined;
  valid: boolean;

  constructor(
    id: number,
    importId: number,
    name: string,
    from: string,
    to: string,
    formula: string | undefined = undefined,
    key: boolean | undefined = undefined,
    foreignKey: boolean | undefined = undefined,
    index: number | undefined = undefined,
    valid: boolean
  ) {
    this.id = id;
    this.importId = importId;
    this.name = name;
    this.from = from;
    this.to = to;
    this.formula = formula;
    this.key = key;
    this.foreignKey = foreignKey;
    this.index = index;
    this.valid = valid;
  }
}
