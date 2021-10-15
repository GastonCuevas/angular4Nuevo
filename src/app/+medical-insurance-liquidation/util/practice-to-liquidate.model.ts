import { PharmacySchemeLiq } from "../../models/pharmacy-scheme.model";

export class PracticeToLiquidate {
    practiceId: number;
    cheId: number;
    movPacId: number;
    practiceName: string;
    alternativeCode: string;
    standarCode: string;
    professionalName: string;
    patientName: string;
    medicalInsuranceName: string;
    date: string;
    rejected: boolean;
    hospitalization: boolean;
    days: number;
    departureDate: string;

    medicines: Array<PharmacySchemeLiq>;

    liquidate = false;
    hideLiquidate = false;
    reLiquidate = false;
    hideReLiquidate = false;
}