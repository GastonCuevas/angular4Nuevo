import { ImportDataFile } from "./import-data-file.model";
import { ImportDataField } from "./import-data-field";

export class ImportData {
    id: number = 0;
    table: string;
    modeInsert: number = 0;
    importFile: ImportDataFile;
    importFields: Array<ImportDataField>;

    constructor() {
        this.importFile = new ImportDataFile();
        this.importFields = new Array<ImportDataField>();
    }
}