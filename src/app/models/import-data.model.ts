import { ImportDataFile } from "./import-data-file.model";
import { ImportDataField } from "./import-data-field";

export class ImportData {
  id: number;
  table: string;
  modeInsert: number;
  importFile: ImportDataFile;
  importFields: Array<ImportDataField>;


  constructor(
    id: number = 0,
    table: string,
    modeInsert: number = 0,
    importFile: ImportDataFile = new ImportDataFile(),
    importFields: Array<ImportDataField> = new Array<ImportDataField>()
  ) {
    this.id = id;
    this.table = table;
    this.modeInsert = modeInsert;
    this.importFile = importFile;
    this.importFields = importFields;
  }
}
