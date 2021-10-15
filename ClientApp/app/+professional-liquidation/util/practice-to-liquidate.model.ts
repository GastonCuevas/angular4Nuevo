export class PracticeToLiquidate {
    practiceId: number;
    numberMovPacHC: number;
    practiceName: string;
    code: string;
    professionalName: string;
    patientName: string;
    medicalInsuranceName: string;
    date: string;
    typeInternament: boolean;
    dateFrom: string;
    dateTo: string;
    days: number;
    departureDate: string;
    price: number;
    retention: number;
    enrollment: string;
    liquidate = false;
    coinsurance: number;
    total: number;
}