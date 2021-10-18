export class ImportDataFile {
  id: number;
  importId: number;
  file: any;
  type: number | undefined;
  name: string;
  insertMode: number;
  separator: string;

  constructor(
    id: number,
    importId: number,
    file: any,
    type: number | undefined = undefined,
    name: string,
    insertMode: number,
    separator: string
  ) {
    this.id = id;
    this.importId = importId;
    this.file = file;
    this.type = type;
    this.name = name;
    this.insertMode = insertMode;
    this.separator = separator;
  }
}
