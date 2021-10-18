import { DiagnosticMovement } from './diagnostic-movement.model';
import { HcEvolution } from './hc-evolution.model';
import { TreatingProfessional } from './treating-professional.model';

export class Internment {
  id: number;
  admissionDate: string;//| Date = new Date()
  time: string;
  bedId: number;
  bedName: string;
  professionalContractId: number;
  professionalId: number;
  professionalName: string;
  patientId: number;
  patientName: string;
  miContractId: number;
  medicalInsuranceId: number;
  medicalInsuranceName: string;
  practiceId: number;
  practiceName: string;
  departureDate: string | Date;
  departureTime: string;
  observation: string;
  specialtyId: number;
  evolutions: Array<HcEvolution>;
  diagnostics: Array<DiagnosticMovement>;
  treatingProfessionals: Array<TreatingProfessional>;
  authorizationCode: string;
  date: string;

  constructor(
    id: number = 0,
    admissionDate: string,
    time: string,
    bedId: number,
    bedName: string,
    professionalContractId: number = 0,
    professionalId: number,
    professionalName: string,
    patientId: number,
    patientName: string,
    miContractId: number = 0,
    medicalInsuranceId: number,
    medicalInsuranceName: string,
    practiceId: number,
    practiceName: string,
    departureDate: string,
    departureTime: string,
    observation: string,
    specialtyId: number,
    evolutions: Array<HcEvolution> = new Array<HcEvolution>(),
    diagnostics: Array<DiagnosticMovement> = new Array<DiagnosticMovement>(),
    treatingProfessionals: Array<TreatingProfessional> = new Array<TreatingProfessional>(),
    authorizationCode: string,
    date: string
  ) {
    this.id = id;
    this.admissionDate = admissionDate;
    this.time = time;
    this.bedId = bedId;
    this.bedName = bedName;
    this.professionalContractId = professionalContractId;
    this.professionalId = professionalId;
    this.professionalName = professionalName;
    this.patientId = patientId;
    this.patientName = patientName;
    this.miContractId = miContractId;
    this.medicalInsuranceId = medicalInsuranceId;
    this.medicalInsuranceName = medicalInsuranceName;
    this.practiceId = practiceId;
    this.practiceName = practiceName;
    this.departureDate = departureDate;
    this.departureTime = departureTime;
    this.observation = observation;
    this.specialtyId = specialtyId;
    this.evolutions = evolutions;
    this.diagnostics = diagnostics;
    this.treatingProfessionals = treatingProfessionals;
    this.authorizationCode = authorizationCode;
    this.date = date;
  }
}
