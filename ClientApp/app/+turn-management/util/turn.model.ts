import { PatientMedicalInsurance } from './patient-mi.model';

export class Turn {
    numInt: number;
    movementNumber: number;
    medicalOffice: any;

    date: Date | string;
    time: string;
    specialtyNumber: number;
    specialtyName: string;
    professionalNumber: number;
    professionalName: string;

    medicalInsuranceNumber: number;
    medicalInsuranceName: string;
    practiceNumber: number;
    practiceName: string;
    turnStateNumber: number;
    turnStateName: string;
    uponTurn: number;
    observation: string;
    coinsurancePaymented: number;
    //coinsuranceFac: boolean;
    coinsuranceFac: boolean;
    authorizationCode: string;


    
    // patient
    patientNumber: number;
    clinicHistoryNumber: string;
    patientName: string;
    patientIdentifierType: number;
    patientIdentifier: string;
    locality: number;
    zone: number;
    medicalInsurances: Array<PatientMedicalInsurance> = new Array<PatientMedicalInsurance>();;

    public constructor() {
        this.coinsuranceFac = true;
        //this.coinsurancePaymented = 0;
    }

}