export class ImportDataFile {
  id: number;
  importId: number;
  file: any;
  name: string;
  insertMode: number;
  separator: string;
  type?: number;

  constructor(
    id: number,
    importId: number,
    file: any,
    name: string,
    insertMode: number,
    separator: string,
    type?: number
  ) {
    this.id = id;
    this.importId = importId;
    this.file = file;
    this.name = name;
    this.insertMode = insertMode;
    this.separator = separator;
    this.type = type;
  }
}
