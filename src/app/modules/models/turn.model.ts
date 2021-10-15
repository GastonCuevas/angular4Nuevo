export class Turn {
    numInt: number;
    movementNumber: number = 0;
    medicalOffice: any;

    date: Date | string;
    time: string;
    specialtyNumber: number = 0;
    specialtyName: string;
    professionalNumber: number = 0;
    professionalName: string;
    patientNumber: number = 0;
    patientName: string;
    medicalInsuranceNumber: number = 0;
    medicalInsuranceName: string;
    practiceNumber: number = 0;
    practiceName: string;
    turnStateNumber: number = 0;
    turnStateName: string;
    uponTurn: number = 0;
    observation: string;

    public constructor() {}

}
