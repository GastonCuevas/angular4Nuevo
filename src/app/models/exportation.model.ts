import { ExportationDetail } from './../models/exportationDetail.model';
import { ExportationEntry } from './exportationEntry.model';

export class Exportation {
  number?: number;
  name?: string;
  description?: string;
  exportationDetails?: Array<ExportationDetail> = new Array<ExportationDetail>();
  exportEntries?: Array<ExportationEntry> = new Array<ExportationEntry>();

  constructor(number?: number, name?: string, description?: string) {
    this.number = number;
    this.name = name;
    this.description = description;
  }
}
