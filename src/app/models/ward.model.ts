import { WardType } from './ward-type.model';
import { WardSector } from './ward-sector.model';

export class Ward {
  number: number;
  name: string;
  typeName: string;
  typeId: number;
  sectorId: number;
  sectorName: string;
  disabled: boolean;
  wardType?: WardType;
  wardSector?: WardSector;

  constructor(
    number: number = 0,
    name: string,
    typeName: string,
    typeId: number,
    sectorId: number,
    sectorName: string,
    disabled: boolean = false,
    wardType?: WardType,
    wardSector?: WardSector
  ) {
    this.number = number;
    this.name = name;
    this.typeName = typeName;
    this.typeId = typeId;
    this.sectorId = sectorId;
    this.sectorName = sectorName;
    this.disabled = disabled;
    this.wardType = wardType;
    this.wardSector = wardSector;
  }
}
