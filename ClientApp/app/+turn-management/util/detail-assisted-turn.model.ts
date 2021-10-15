export class DetailAssistedTurn {
    patientNumber: number;
    clinicHistoryNumber: string;
    patientName: string;
    medicalInsuranceContractNumber: number;
    medicalInsuranceNumber: number;
    medicalInsuranceName: string;
    specialtyNumber: number;
    specialtyName: string;
    practiceNumber: number;
    practiceTypeNumber: number;
    practiceTypeName: string;
    practiceDescription: string;
    coinsurance = 0;
    price = 0;
    medicalCoverage = 0;
    total = 0;
    authorizationCode: string;
}
