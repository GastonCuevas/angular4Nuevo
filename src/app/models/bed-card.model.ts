import { BedType } from "./bed-type.model";
import { Ward } from "./ward.model";
import { PatientMovement } from "./patient-movement.model";

export class BedCard {
    id: number;
    name: string;
    typeId: number;
    wardId: number;
    wardName: string;
    wardTypeName: string;
    wardSectorName: string;
    typeName: string;
    patientName?: string;
    patientAge?: number;
    admissionDate?: string | Date;
    hospitalizedDays?: number;

    patientMovement?: PatientMovement;
    bedType?: BedType;
    ward: Ward;
}