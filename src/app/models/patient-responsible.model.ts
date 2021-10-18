import { Account } from './../models/account.model';

export class PatientResponsible extends Account {
	
	public constructor() {
		super();
		this.type = 7;
		this.activity = 2;
		this.category = 1;
		this.vended = 1;
		this.currency = 1;
		this.reggan = 1;
		this.congan = 1;
		this.aliibr = 1;
		this.ivaReg = 1;
		this.ibrReg = 1;
		this.accountNumber = '100000000000';
	}
}