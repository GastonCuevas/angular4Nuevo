import { BedType } from './bed-type.model';
import { Ward } from './ward.model';
import { PatientMovement } from './patient-movement.model';

export class BedCard {
  id: number;
  name: string;
  typeId: number;
  wardId: number;
  wardName: string;
  wardTypeName: string;
  wardSectorName: string;
  typeName: string;
  ward: Ward;
  patientMovement?: PatientMovement;
  bedType?: BedType;
  patientName?: string;
  patientAge?: number;
  admissionDate?: string | Date;
  hospitalizedDays?: number;

  constructor(
    id: number,
    name: string,
    typeId: number,
    wardId: number,
    wardName: string,
    wardTypeName: string,
    wardSectorName: string,
    typeName: string,
    ward: Ward,
    patientMovement?: PatientMovement,
    bedType?: BedType,
    patientName?: string,
    patientAge?: number,
    admissionDate?: string,
    hospitalizedDays?: number
  ) {
    this.id = id;
    this.name = name;
    this.typeId = typeId;
    this.wardId = wardId;
    this.wardName = wardName;
    this.wardTypeName = wardTypeName;
    this.wardSectorName = wardSectorName;
    this.typeName = typeName;
    this.ward = ward;
    this.patientMovement = patientMovement;
    this.bedType = bedType;
    this.patientName = patientName;
    this.patientAge = patientAge;
    this.admissionDate = admissionDate;
    this.hospitalizedDays = hospitalizedDays;
  }
}
