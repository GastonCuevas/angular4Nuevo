import { Account } from './account.model';

export class Professional{
    public enrollment: number;
    public matesp: string;
    public clinic: string;
    public account: number;
    public nameProf: string;
    public numberProf?: number;
    public professionalAccount: Account;

    constructor() {
        this.professionalAccount = new Account();
        this.professionalAccount.type = 2;
        this.professionalAccount.activity = 7;
        this.professionalAccount.reggan = 1;
        this.professionalAccount.congan = 1;
        this.professionalAccount.vended = 1;
        this.professionalAccount.currency = 1;
        this.professionalAccount.enabled = 1;
    }
}