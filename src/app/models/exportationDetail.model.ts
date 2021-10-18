export class ExportationDetail {
  number?: number;
  expedientNumber?: number;
  name?: string;
  fileName?: string;
  type?: string;
  sql?: string;
  separa?: string;
  docHtml?: string;

  constructor(number?: number, expedientNumber?: number, name?: string, fileName?: string, type?: string, sql?: string, separa?: string, docHtml?: string) {
    this.number = number;
    this.expedientNumber = expedientNumber;
    this.name = name;
    this.fileName = fileName;
    this.type = type;
    this.sql = sql;
    this.separa = separa;
    this.docHtml = docHtml;
  }
}
