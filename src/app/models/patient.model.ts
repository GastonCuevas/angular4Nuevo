import { PatientMedicalInsurance } from './patient-medical-insurance.model';
import { Account } from './account.model';

type BloodGroup = {number: number; name: string};
type Genre = {number: number; name: string};

export class Patient {
    public patientAccount: Account;
    account: Account;
    public accountNumber: number = 0;
    public birthdate?: Date | string | null;
    public transplanted: number = 0;
    public genreNumber: number;
    public years: number;
    genreName: string;
    genre?: Genre;
    public stature?: number;
    public weight?: number = 0;
    public children?: number = 0;
    civilState: any;
    public civilStateNumber?: number;
    civilStateName: string;
    bloodGroup?:  BloodGroup;
    bloodGroupName: string;
    public bloodType?: number;
    public secuence?: number;
    public clinicHistoryNumber: string;
    public carnetNumber?: string;
    public medicalInsurances: Array<PatientMedicalInsurance> = new Array<PatientMedicalInsurance>();;

    public constructor() {
        this.patientAccount = new Account;
        this.account = new Account;
        this.patientAccount.type = 1;
        this.patientAccount.activity = 2;
        this.patientAccount.category = 1;
        this.patientAccount.reggan = 1;
        this.patientAccount.congan = 1;
        this.patientAccount.vended = 1;
        this.patientAccount.currency = 1;
        this.patientAccount.enabled = 1;
        this.patientAccount.aliibr = 1;
        this.patientAccount.ivaReg = 1;
        this.patientAccount.ibrReg = 1;
        this.patientAccount.accountNumber = '100000000000';
    }
}
