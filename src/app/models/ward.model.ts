import { WardType } from "./ward-type.model";
import { WardSector } from "./ward-sector.model";

export class Ward {
    number: number = 0;
    name: string;
    typeName: string;
    typeId: number;
    sectorId: number;
    sectorName: string;
    disabled: boolean = false;
    wardType?: WardType;
    wardSector?: WardSector;
}