import { WardType } from "./ward-type.model";
import { WardSector } from "./ward-sector.model";

export class Ward {
  number: number = 0;
  name: string = '';
  typeName: string = '';
  typeId: number = 0;
  sectorId: number = 0;
  sectorName: string = '';
  disabled: boolean = false;
  wardType?: WardType;
  wardSector?: WardSector;
}
