import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
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
import { ResponsiblePatient } from '../../models/responsible-patient.model';
import { ResponsiblePatientService } from '../responsible-patient.service';

@Component({
	selector: 'responsible-patient-form',
	templateUrl: './responsible-patient-form.component.html',
	styleUrls: ['./responsible-patient-form.component.css']
})
export class ResponsiblePatientFormComponent implements OnInit {

    loadingLocalityIAC: boolean = false;
	functionForProvinces = this.commonService.getProvinces();
    functionForResponsibles = this.commonService.getResponsibles();
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
	vigente: boolean = false;
	changeInputSearch: boolean = false;
    @Input() responsiblePatient: ResponsiblePatient;
    @Input() isPatientResponsibleEdit: boolean;
    @Output() closeViewClick: EventEmitter<any> = new EventEmitter<any>();

	constructor(
		private fb: FormBuilder,
		public patientResponsibleService: PatientResponsibleService,
		public responsiblePatientService: ResponsiblePatientService,
		private commonService: CommonService,
		private toastyService: ToastyMessageService,
		private utilityService: UtilityService
	) {
	}

	ngOnInit() {
		this.datePickerOptions = this.utilityService.getDatePickerOptions();
		if (this.isPatientResponsibleEdit) this.loadProvinces();
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
		if (this.isPatientResponsibleEdit) this.getPatientResponsible();
		else this.createForm();
	}

	createForm() {
		this.form = this.fb.group({
			name: [this.responsiblePatient.responsible.name, Validators.required],
			birthDate: [this.responsiblePatient.responsible.birthDate, null],
			identi: [this.responsiblePatient.responsible.identi, Validators.required],
			cuit: [this.responsiblePatient.responsible.cuit, null],
			address: [this.responsiblePatient.responsible.address, Validators.required],
			quarter: [this.responsiblePatient.responsible.quarter, null],
			zone: [this.responsiblePatient.responsible.zone, Validators.required],
			fax: [this.responsiblePatient.responsible.fax, null],
			phone: [this.responsiblePatient.responsible.phone, Validators.required],
			movil: [this.responsiblePatient.responsible.movil, null],
			mail: [this.responsiblePatient.responsible.mail, null],
			www: [this.responsiblePatient.responsible.www, null],
			observation: [this.responsiblePatient.responsible.observation, null],
			enabled: [this.responsiblePatient.responsible.enabled, null],
			province: [this.responsiblePatient.responsible.province, Validators.required],
			locality: [this.responsiblePatient.responsible.locality, Validators.required],
			responsibleId: [this.responsiblePatient.responsibleId],
			vigente: [this.responsiblePatient.vigente, Validators.required],
			isSearchResponsible: [this.changeInputSearch]
		});
	}

	getPatientResponsible() {
		this.createForm();
		this.getProvinceEdit(+this.responsiblePatient.responsible.province);
		this.getLocalitiesEdit(+this.responsiblePatient.responsible.province, this.responsiblePatient.responsible.locality);
		this.setCuilLabel();
	}

	onSubmit() {
		const patientResponsible = Object.assign({}, this.responsiblePatient.responsible, this.form.value);
		patientResponsible.birthDate = this.utilityService.formatDate(this.form.value.birthDate, "DD/MM/YYYY");
		this.responsiblePatientService.checkDuplicates(this.responsiblePatient.patientId, patientResponsible.number).subscribe(
			response => {
				if (response.model) this.toastyService.showMessageToast("Responsable existente", "El responsable ya ha sido asignado al paciente anteriormente", 'warning');
				else {
					this.patientResponsibleService.save(patientResponsible, patientResponsible.number).subscribe(
						responseResponsible => {
							let patientResp = {
								patientId: this.responsiblePatientService.patientId,
								responsibleId: responseResponsible.model.numint,
								vigente: patientResponsible.vigente ? 1 : 0
							}
							this.responsiblePatientService.save(patientResp, this.isPatientResponsibleEdit).subscribe(
								result => {
									this.toastyService.showSuccessMessagge("Se guardaron los cambios");
									this.closeViewClick.emit();
								},
								error => {
									this.toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al guardar los datos");
								});
						},
						error => {
							this.toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al guardar los datos");
						});
				}
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
			this.responsiblePatient.responsible.locality = locality.number;
			this.nameLocality = locality.name;
			this.isLoadedLocality = true;
		}
	}

	validateName(event: any) {
		if (event == "") {
			this.nameLocality = "";
			this.responsiblePatient.responsible.locality = 0;
			this.isLoadedLocality = false;
		} else {
			const locality = this.localities.find((e: any) => {
				return e.name.toLowerCase() == event.toLowerCase();
			});
			if (!locality) {
				this.nameLocality = "";
				this.responsiblePatient.responsible.locality = 0;
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
        this.closeViewClick.emit();
	}

	onChangeResponsible() {
		this.responsiblePatient.responsibleId = this.form.value.responsibleId;
		this.isLoading = true;
		this.patientResponsibleService.get(this.responsiblePatient.responsibleId)
			.finally(() => this.isLoading = false)
			.subscribe(
			response => {
				this.responsiblePatient.responsible = response.model;
				this.optionSelect = response.model.loc.province;
				this.responsiblePatient.responsible.province = response.model.loc.province;
				this.responsiblePatient.responsible.birthDate = this.utilityService.formatDate(response.model.birthDate, "", "DD/MM/YYYY");
				this.createForm();
				this.getProvinceEdit(+this.optionSelect);
				this.getLocalitiesEdit(+this.optionSelect, this.responsiblePatient.responsible.locality);
				this.setCuilLabel();
			},
			error => {
				this.toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al obtener los datos");
			});
	}

	onChangeInput() {
		this.changeInputSearch = !this.changeInputSearch;
	}
}
