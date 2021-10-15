import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';

import { PatientResponsible } from './../../models/patient-responsible.model';
import { PatientResponsibleService } from './../../+patient-responsible/patient-responsible.service';
import { CommonService } from '../../+core/services/common.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { ValidationService } from './../../+shared/forms/validation.service';
import { UtilityService } from './../../+core/services/utility.service';
import * as jquery from 'jquery';

@Component({
	selector: 'app-patient-responsible-form',
	templateUrl: './patient-responsible-form.component.html',
	styleUrls: ['./patient-responsible-form.component.css']
})
export class PatientResponsibleFormComponent implements OnInit {

	patientResponsible: PatientResponsible = new PatientResponsible();
    loadingLocalityIAC: boolean = false;
    functionForProvinces = this.commonService.getProvinces();
	provinces: Array<any>;
	localities: Array<any>;
	zones: Array<any> = new Array<any>();
	identifiers: Array<any>;
	optionSelect: string;
	openModalSubject: Subject<any> = new Subject();
	cuitLabel: any = "Cuit/Cuil";
	isLoading: boolean = false;
	id: any;
	form: FormGroup;
	intervalId: number = 0;
	datePickerOptions: any;
	emailPattern = ValidationService.emailPattern;
	auxList: Array<any> = new Array<any>();
	nameLocality: string = "";
	isLoadedLocality: boolean = false;
	auxListProvince: Array<any> = new Array<any>();
	nameProvince: string = "";
	isLoadedProvince: boolean = false;

	constructor(
		private fb: FormBuilder,
		private patientResponsibleService: PatientResponsibleService,
		private route: ActivatedRoute,
		private commonService: CommonService,
		private toastyService: ToastyMessageService,
		private utilityService: UtilityService
	) {
		this.id = this.route.snapshot.paramMap.get('id');
	}

	ngOnInit() {
		this.datePickerOptions = this.utilityService.getDatePickerOptions();
		if (!this.id) this.loadProvinces();
		this.loadZones();
		this.loadIdentifiers();
		this.loadForm();
	}

	loadZones() {
		this.commonService.getZones().subscribe(response => {
			this.zones = response.model;
		})
	}

	loadIdentifiers() {
		this.commonService.getIdentifiers().subscribe(response => {
			this.identifiers = response.model;
		})
	}

	loadForm() {
		if (!!this.id) this.getPatientResponsible(this.id);
		else this.createForm();
	}

	createForm() {
		this.form = this.fb.group({
			name: [this.patientResponsible.name, Validators.required],
			birthDate: [this.patientResponsible.birthDate, null],
			identi: [this.patientResponsible.identi, Validators.required],
			cuit: [this.patientResponsible.cuit, null],
			address: [this.patientResponsible.address, null],
			quarter: [this.patientResponsible.quarter, null],
			zone: [this.patientResponsible.zone, Validators.required],
			fax: [this.patientResponsible.fax, null],
			phone: [this.patientResponsible.phone, null],
			movil: [this.patientResponsible.movil, null],
			mail: [this.patientResponsible.mail, null],
			www: [this.patientResponsible.www, null],
			observation: [this.patientResponsible.observation, null],
			enabled: [this.patientResponsible.enabled, null],
			province: [this.patientResponsible.province, Validators.required],
            locality: [this.patientResponsible.locality, Validators.required],
		});
		this.checkDuplicates();
	}

	checkDuplicates() {
		const identiCtrl = this.form.get('identi');
		const cuitCtrl = this.form.get('cuit');
		if (cuitCtrl && identiCtrl) {
			identiCtrl
				.valueChanges
				.switchMap(val => this.patientResponsibleService.checkDuplicates(val, cuitCtrl.value, this.id))
				.subscribe(val => {
					cuitCtrl.setErrors(val.model ? { duplicate: val.model } : null);
				});
			cuitCtrl
				.valueChanges
				.debounceTime(500)
				.switchMap(val => this.patientResponsibleService.checkDuplicates(identiCtrl.value, val, this.id))
				.subscribe(val => {
					cuitCtrl.setErrors(val.model ? { duplicate: val.model } : null);
				});
		}
	}

	getPatientResponsible(id: string) {
		this.isLoading = true;
		this.patientResponsibleService.get(id)
			.finally(() => this.isLoading = false)
			.subscribe(
			response => {
				this.patientResponsible = response.model;
				this.optionSelect = response.model.loc.province;
				this.patientResponsible.province = response.model.loc.province;
				this.patientResponsible.birthDate = this.utilityService.formatDate(response.model.birthDate, "", "DD/MM/YYYY");
				this.createForm();
				this.getProvinceEdit(+this.optionSelect);
				this.getLocalitiesEdit(+this.optionSelect, this.patientResponsible.locality);
				this.setCuilLabel();
			},
			error => {
				this.toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al obtener los datos");
			});
	}

	onSubmit() {
		const patientResponsible = Object.assign({}, this.patientResponsible, this.form.value);
		patientResponsible.birthDate = this.utilityService.formatDate(this.form.value.birthDate, "DD/MM/YYYY");
		this.patientResponsibleService.save(patientResponsible, this.id).subscribe(
			response => {
				this.toastyService.showSuccessMessagge("Se guardaron los cambios");
				this.utilityService.navigate("archivos/pacientesResponsable");
			},
			error => {
				this.toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al guardar los datos");
			});
	}

	loadProvinces() {
		this.commonService.getProvinces().subscribe(response => {
			this.provinces = response.model;
			this.auxListProvince = this.provinces.map(d => d.name);
		});
	}

	loadProvinceName(provinceId: number) {
		const province = this.provinces.find(d => d.number == provinceId);
		if (!!province) {
			this.nameProvince = province.name;
			this.isLoadedProvince = true;
		}
	}

	getLocalities(provinceId: number) {
		this.loadingLocalityIAC = true;
		this.commonService.getLocalities(provinceId, 1)
		.finally(()=>{this.loadingLocalityIAC = false;})
			.subscribe(
			result => {
				this.localities = result.model || [];
				this.auxList = this.localities.map(d => d.name);
			});
	}

	getLocalitiesEdit(provinceId: number, localityId: number) {
		this.commonService.getLocalities(provinceId, 1)
			.subscribe(
			result => {
				this.localities = result.model || [];
				this.auxList = this.localities.map(d => d.name);
			});
	}

	customCallback(event: any) {
		this.nameLocality = event;
		this.isLoadedLocality = true;
		const locality = this.localities.find((e: any) => {
			return e.name.toLowerCase() == event.toLowerCase();
		});
		if (!!locality) {
			this.patientResponsible.locality = locality.number;
			this.nameLocality = locality.name;
			this.isLoadedLocality = true;
		}
	}

	validateName(event: any) {
		if (event == "") {
			this.nameLocality = "";
			this.patientResponsible.locality = 0;
			this.isLoadedLocality = false;
		} else {
			const locality = this.localities.find((e: any) => {
				return e.name.toLowerCase() == event.toLowerCase();
			});
			if (!locality) {
				this.nameLocality = "";
				this.patientResponsible.locality = 0;
				this.isLoadedLocality = false;
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
		this.commonService.getProvinces().subscribe(response => {
			this.provinces = response.model;
			this.auxListProvince = this.provinces.map(d => d.name);
			this.loadProvinceName(+this.optionSelect);
		});
	}

	customCallbackProv(event: any) {
		if (event != null) {
			this.nameProvince = event;
			this.isLoadedProvince = true;
			const province = this.provinces.find((e: any) => {
				return e.name.toLowerCase() == event.toLowerCase();
			});
			if (!!province) {
				this.optionSelect = province.number;
				this.nameProvince = province.name;
				this.isLoadedProvince = true;
				this.getLocalities(+this.optionSelect);
			}
		}
	}

	validateNameProv(event: any) {
		if (event == "") {
			this.nameProvince = "";
			this.optionSelect = "";
			this.isLoadedProvince = false;
			this.auxList = [];
		} else {
			let a = this.provinces.find((e: any) => {
				return e.name.toLowerCase() == event.toLowerCase();
			})
			if (!a) {
				this.nameProvince = "";
				this.optionSelect = "";
				this.isLoadedProvince = false;
				this.auxList = [];
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
		let value = this.identifiers.find(d => d.number == this.form.value.identi);
		this.cuitLabel = value.name;
	}

	onCancelButton(): void {
		this.openModalSubject.next();
	}

	onAgree() {
		this.utilityService.navigate("archivos/pacientesResponsable");
	}
}
