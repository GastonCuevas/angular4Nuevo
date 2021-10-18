import { BedType } from './bed-type.model';
import { Ward } from './ward.model';

export class Bed {
  number: number;
  typeId: number;
  wardId: number;
  wardName: string;
  typeName: string;
  name?: string;
  bedType?: BedType;
  ward?: Ward;

  constructor(
    number: number,
    typeId: number,
    wardId: number,
    wardName: string,
    typeName: string,
    name?: string,
    bedType?: BedType,
    ward?: Ward
  ) {
    this.number = number;
    this.name = name;
    this.typeName = typeName;
    this.typeId = typeId;
    this.wardId = wardId;
    this.wardName = wardName;
  }
}
