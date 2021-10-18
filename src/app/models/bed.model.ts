import { BedType } from "./bed-type.model";
import { Ward } from "./ward.model";

export class Bed {
    number: number;
    name?: string;
    typeId: number;
    wardId: number;
    bedType?: BedType;
    ward?: Ward;
    wardName: string;
    typeName: string;
    
    // constructor(number?: number, expedientNumber?: number, name?: string, fileName?: string, type?: string, sql?: string, separa?: string) {
    //     this.number = number;
    //     this.expedientNumber = expedientNumber;
    //     this.name = name;
    //     this.fileName = fileName;
    //     this.type = type;
    //     this.sql = sql;
    //     this.separa = separa;
    // }
}