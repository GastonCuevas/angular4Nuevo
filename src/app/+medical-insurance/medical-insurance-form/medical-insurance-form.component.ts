import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';

import { MedicalInsurance } from '../../models/medical-insurance.model';
import { MedicalInsuranceService } from '../medical-insurance.service';
import { CommonService } from '../../+core/services/common.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { UtilityService } from '../../+core/services/utility.service';
import { ValidationService } from '../../+shared/forms/validation.service';
import * as jquery from 'jquery';
import { ContractOsService } from '../../+contract-os/contract-os.service';

@Component({
	selector: 'app-medical-insurance-form',
	templateUrl: './medical-insurance-form.component.html',
	styleUrls: ['./medical-insurance-form.component.scss']
})
export class MedicalInsuranceFormComponent implements OnInit {

	public medicalInsurance: MedicalInsurance = new MedicalInsurance();
	public loadingLocalityIAC: boolean = false;
	functionForProvinces = this._commonService.getProvinces();
	public localities: Array<any>;
	public provinces: Array<any>;
	public zones: Array<any>;
	public accountPl: Array<any>;
	public categories: Array<any>;
	public identifiers: Array<any>;
	public regIvas: Array<any>;
	public regIbrs: Array<any>;
	public optionSelect: string;
	public openModalSubject: Subject<any> = new Subject();
	public cuitLabel: string = 'Cuit/Cuil';
	public isLoading: boolean = false;
	public form: FormGroup;
	public intervalId: number = 0;
	id: any;
	public emailPattern = ValidationService.emailPattern;
	public auxList: Array<any> = new Array<any>();
	public nameLocality: string = "";
	public isLoadLocality: boolean = false;
	public auxListProvince: Array<any> = Array<any>();
	public isLoadProvince: boolean = false;
	public nameProvince: string = "";
	public auxListAccount: Array<any> = Array<any>();
	public isLoadAccount: boolean = false;
	public nameAccount: string = "";
	public accountSelected: string;
	loading: boolean;
	
	constructor(
		private fb: FormBuilder,
		private _medicalInsuranceService: MedicalInsuranceService,
		public contractOsService: ContractOsService,
		private _commonService: CommonService,
		private _route: ActivatedRoute,
		private router: Router,
		private _utilityService: UtilityService,
		private _toastyService: ToastyMessageService,
	) {
		this.id = this._route.snapshot.paramMap.get('id');
	}

	ngOnInit() {
		this.loadCombos();
		this.loadForm();
	}

	loadCombos() {
		if (!this.id) {
			this.getProvince();
			this.getAccountPlan();
		}
		Observable.forkJoin(
			this._commonService.getZones(),
			this._commonService.getCategories(),
			this._commonService.getIdentifiers(),
			this._commonService.getRegIva(),
			this._commonService.getRegibr()
		).subscribe((response: Array<any>) => {
			this.zones = response[0].model || [];
			this.categories = response[1].model || [];
			this.identifiers = response[2].model || [];
			this.regIvas = response[3].model || [];
			this.regIbrs = response[4].model || [];
		}, error => {
			this._toastyService.showErrorMessagge("Ocurrio un error al cargar los combos");
		});
	}

	loadForm() {
		if (this.id) this.getMedicalInsurance(this.id);
		else this.createForm();
	}

	createForm() {
		this.form = this.fb.group({
			denomination: [this.medicalInsurance.medicalInsuranceAccount.denomination, null],
			name: [this.medicalInsurance.medicalInsuranceAccount.name, Validators.required],
			repres: [this.medicalInsurance.medicalInsuranceAccount.repres, null],
			percentage: [this.medicalInsurance.percentage, ValidationService.numberValidator],
			agent1: [this.medicalInsurance.agent1, null],
			agent2: [this.medicalInsurance.agent2, null],
			agent3: [this.medicalInsurance.agent3, null],
			agentPhone1: [this.medicalInsurance.agentPhone1, null],
			agentPhone2: [this.medicalInsurance.agentPhone2, null],
			agentPhone3: [this.medicalInsurance.agentPhone3, null],
			category: [this.medicalInsurance.medicalInsuranceAccount.category, Validators.required],
			observation: [this.medicalInsurance.medicalInsuranceAccount.observation, null],
			zone: [this.medicalInsurance.medicalInsuranceAccount.zone, Validators.required],
			quarter: [this.medicalInsurance.medicalInsuranceAccount.quarter, null],
			address: [this.medicalInsurance.medicalInsuranceAccount.address, null],
			phone: [this.medicalInsurance.medicalInsuranceAccount.phone, null],
			movil: [this.medicalInsurance.medicalInsuranceAccount.movil, null],
			fax: [this.medicalInsurance.medicalInsuranceAccount.fax, null],
			mail: [this.medicalInsurance.medicalInsuranceAccount.mail, null],
			www: [this.medicalInsurance.medicalInsuranceAccount.www, null],
			identi: [this.medicalInsurance.medicalInsuranceAccount.identi, Validators.required],
			cuit: [this.medicalInsurance.medicalInsuranceAccount.cuit, null],
			ivaReg: [this.medicalInsurance.medicalInsuranceAccount.ivaReg, Validators.required],
			ibrReg: [this.medicalInsurance.medicalInsuranceAccount.ibrReg, Validators.required],
			ingbru: [this.medicalInsurance.medicalInsuranceAccount.ingbru, null],
			// enabled: [this.medicalInsurance.medicalInsuranceAccount.enabled, true],
			province: [this.medicalInsurance.medicalInsuranceAccount.province, Validators.required],
			locality: [this.medicalInsurance.medicalInsuranceAccount.locality, Validators.required],
			accountNumber: [this.medicalInsurance.medicalInsuranceAccount.accountNumber, Validators.required]
		});
		this.checkDuplicates();
	}

	checkDuplicates() {
		const identiCtrl = this.form.get('identi');
		const cuitCtrl = this.form.get('cuit');
		if (cuitCtrl && identiCtrl) {
			identiCtrl
				.valueChanges
				.switchMap(val => this._medicalInsuranceService.checkDuplicates(val, cuitCtrl.value, this.id))
				.subscribe(val => {
					cuitCtrl.setErrors(val.model ? { duplicate: val.model } : null);
				});
			cuitCtrl
				.valueChanges
				.debounceTime(500)
				.switchMap(val => this._medicalInsuranceService.checkDuplicates(identiCtrl.value, val, this.id))
				.subscribe(val => {
					cuitCtrl.setErrors(val.model ? { duplicate: val.model } : null);
				});
		}
	}

	saveMedicalInsurance() {
		this.loading = true;
		Object.assign(this.medicalInsurance.medicalInsuranceAccount, this.form.value)
		this.medicalInsurance.percentage = this.form.value.percentage;
		this.medicalInsurance.agent1 = this.form.value.agent1;
		this.medicalInsurance.agent2 = this.form.value.agent2;
		this.medicalInsurance.agent3 = this.form.value.agent3;
		this.medicalInsurance.agentPhone1 = this.form.value.agentPhone1;
		this.medicalInsurance.agentPhone2 = this.form.value.agentPhone2;
		this.medicalInsurance.agentPhone3 = this.form.value.agentPhone3;
		this.medicalInsurance.medicalInsuranceAccount.enabled = 1;

		if (!this.medicalInsurance.medicalInsuranceAccount.denomination.trim()) this.medicalInsurance.medicalInsuranceAccount.denomination = this.medicalInsurance.medicalInsuranceAccount.name;
		this._medicalInsuranceService.save(this.medicalInsurance)
		.finally(()=>{this.loading =  false;})
		.subscribe(
			resp => {
				this._toastyService.showSuccessMessagge("Se guardaron los cambios");
				this._utilityService.navigate("archivos/obraSocial");
			},
			error => {
				this._toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al guardar los datos");
			});
	}

	getMedicalInsurance(id: number) {
		this.isLoading = true;
		this._medicalInsuranceService.get(+id)
			.finally(() => this.isLoading = false)
			.subscribe(
				response => {
					this.medicalInsurance = response.model;
					this.optionSelect = response.model.medicalInsuranceAccount.loc.province;
					this.accountSelected = response.model.medicalInsuranceAccount.accountNumber;
					this.medicalInsurance.medicalInsuranceAccount.enabled = response.model.medicalInsuranceAccount.enabled;
					this.createForm();
					this.getAccountPlanEdit(this.accountSelected);
					this.getProvinceEdit(+this.optionSelect);
					this.getLocalitiesEdit(+this.optionSelect, this.medicalInsurance.medicalInsuranceAccount.locality);
					this.setCuilLabel();
					this.contractOsService.osNumber = id;
					this.contractOsService.routeList = `archivos/obraSocial/formulario/${id}`;
				},
				error => {
					this._toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al obtener los datos");
				});
	}

	getProvince() {
		this._commonService.getProvinces().subscribe(response => {
			this.provinces = response.model;
			this.auxListProvince = this.provinces.map(d => d.name);
		});
	}

	getAccountPlan() {
		this._commonService.getAccountPlan().subscribe(response => {
			this.accountPl = response.model;
			this.auxListAccount = this.accountPl.map(d => d.description);
		});
	}



	loadAccountName(account: string) {
		const acc = this.accountPl.find(d => d.account == account);
		this.nameAccount = acc.description;
		this.isLoadAccount = true;
	}

	getLocalities(provinceId: number) {
		this.loadingLocalityIAC = true;
		this._commonService.getLocalities(provinceId, 1).finally(() => { this.loadingLocalityIAC = false })
			.subscribe(
				result => {
					this.localities = result.model || [];
					this.auxList = this.localities.map(d => d.name);
				});
	}

	getLocalitiesEdit(provinceId: number, localityId: number) {
		this._commonService.getLocalities(provinceId, 1)
			.subscribe(
				result => {
					this.localities = result.model || [];
					this.auxList = this.localities.map(d => d.name);
				});
	}

	customCallback(event: any) {
		this.nameLocality = event;
		this.isLoadLocality = true;
		const locality = this.localities.find((e: any) => {
			return e.name.toLowerCase() == event.toLowerCase();
		});
		if (!!locality) {
			this.medicalInsurance.medicalInsuranceAccount.locality = locality.number;
			this.nameLocality = locality.name;
			this.isLoadLocality = true;
		}
	}

	validateName(event: any) {
		if (event == "") {
			this.nameLocality = "";
			this.medicalInsurance.medicalInsuranceAccount.locality = 0;
			this.isLoadLocality = false;
		} else {
			const locality = this.localities.find((e: any) => {
				return e.name.toLowerCase() == event.toLowerCase();
			});
			if (!locality) {
				this.nameLocality = "";
				this.medicalInsurance.medicalInsuranceAccount.locality = 0;
				this.isLoadLocality = false;
			}
		}
	}

	onProvinceChange(item: any) {
        if (item) {
            this.getLocalities(item.number);
        } else {
            this.localities = [];
        }
    }

	getProvinceEdit(provinceId: number) {
		this._commonService.getProvinces().subscribe(response => {
			this.provinces = response.model;
			this.auxListProvince = this.provinces.map(d => d.name);
			this.loadProvinceName(+this.optionSelect);
		})
	}

	loadProvinceName(provinceId: number) {
		const province = this.provinces.find(d => d.number == provinceId);
		if (!!province) {
			this.nameProvince = province.name;
			this.isLoadProvince = true;
			this.form.patchValue({ province: provinceId });
		}
	}

	getAccountPlanEdit(account: string) {
		this._commonService.getAccountPlan().subscribe(response => {
			this.accountPl = response.model;
			this.auxListAccount = this.accountPl.map(d => d.description);
			this.loadAccountName(account);
		})
	}

	customCallbackProv(event: any) {
		if (event != null) {
			this.nameProvince = event;
			this.isLoadProvince = true;
			const province = this.provinces.find((e: any) => {
				return e.name.toLowerCase() == event.toLowerCase();
			});
			if (!!province) {
				this.optionSelect = province.number;
				this.nameProvince = province.name;
				this.isLoadProvince = true;
				this.getLocalities(+this.optionSelect);
			}
		}
	}

	customCallbackAccount(event: any) {
		if (event != null) {
			this.nameAccount = event;
			this.isLoadAccount = true;
			let a = this.accountPl.find((e: any) => e.description.toLowerCase() == event.toLowerCase());
			if (a) {
				this.accountSelected = a.account;
				this.medicalInsurance.medicalInsuranceAccount.accountNumber = a.account;
				this.nameAccount = a.description;
				this.isLoadAccount = true;
			}
		}
	}

	validateNameProv(event: any) {
		if (event == "") {
			this.nameProvince = "";
			this.optionSelect = "";
			this.isLoadProvince = false;
			this.auxList = [];
		} else {
			let a = this.provinces.find((e: any) => {
				return e.name.toLowerCase() == event.toLowerCase();
			})
			if (!a) {
				this.nameProvince = "";
				this.optionSelect = "";
				this.isLoadProvince = false;
				this.auxList = [];
			}
		}
	}

	validateNameAccount(event: any) {
		if (event == "") {
			this.nameAccount = "";
			this.accountSelected = "";
			this.isLoadAccount = false;
		} else {
			let a = this.accountPl.find((e: any) => e.description.toLowerCase() == event.toLowerCase());
			if (!a) {
				this.nameAccount = "";
				this.accountSelected = "";
				this.isLoadAccount = false;
			}
		}
	}

	setCuilLabel() {
		clearInterval(this.intervalId);
		if (!this.identifiers) {
			this.intervalId = setInterval(() => this.setCuilLabel(), 500);
			return;
		}
		this.onChangeIdenti();
	}

	onChangeIdenti() {
		const value = this.identifiers.find(d => d.number == this.form.value.identi);
		this.cuitLabel = value.name;
	}

	onCancelButton(): void {
		this.openModalSubject.next();
	}

	onAgree() {
		this._utilityService.navigate("archivos/obraSocial");
	}

	onActionClick(event: any) {
		switch (event.action) {
			case 'new':
				this.router.navigate(['archivos/contratosOs/formulario']);
				break;
			case 'edit':
				this.contractOsService.isNewContract = false;
				this.router.navigate([`archivos/contratosOs/formulario/${event.item.number}`]);
				break;
			default:
				break;
		}
	}
}
