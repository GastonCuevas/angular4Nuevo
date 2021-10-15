import { DiagnosticMovement } from './diagnostic-movement.model';
import { Bed } from "./bed.model";
import { Patient } from "./patient.model";
import { ContractProfessional } from "./contract-professional.model";
import { ClinicHistory } from './clinic-history.model';
import { HcEvolution } from './hc-evolution.model';
import { TreatingProfessional } from './treating-professional.model';

export class Internment {
    id: number = 0;
    admissionDate: string;//| Date = new Date()
    time: string;
    bedId: number;
    bedName: string;
    professionalContractId: number = 0;
    professionalId: number;
    professionalName: string;
    patientId: number;
    patientName: string;
    miContractId: number = 0;
    medicalInsuranceId: number;
    medicalInsuranceName: string;
    practiceId: number;
    practiceName: string;
    departureDate: string | Date;
    departureTime: string;
    observation: string;
    specialtyId: number;
    evolutions: Array<HcEvolution> = new Array<HcEvolution>();
    diagnostics: Array<DiagnosticMovement> = new Array<DiagnosticMovement>();
    treatingProfessionals: Array<TreatingProfessional> = new Array<TreatingProfessional>();
    authorizationCode: string;
    date: string;
}