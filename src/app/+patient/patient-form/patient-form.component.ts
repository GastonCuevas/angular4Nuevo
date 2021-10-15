import { Account } from './../../models/account.model';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Patient } from '../../models/patient.model';
import { PatientService } from './../patient.service';
import { CommonService } from '../../+core/services/common.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { ValidationService } from './../../+shared/forms/validation.service';
import { UtilityService } from './../../+core/services/utility.service';
import { Options, ImageResult } from 'ngx-image2dataurl';
import * as jquery from 'jquery';
import { Subject } from 'rxjs';
import { forEach } from '@angular/router/src/utils/collection';
import { MaterializeDirective, MaterializeAction } from "angular2-materialize";
import { PatientMedicalInsuranceService } from '../patient-medical-insurance.service';
import { PatientMedicalInsurance } from '../../models/patient-medical-insurance.model';
import { MedicalInsuranceService } from '../../+medical-insurance/medical-insurance.service';
import { MedicalInsurance } from '../../models/medical-insurance.model';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { TypeFilter } from '../../+shared/constant';
import { ClinicHistoryService } from '../../+clinic-history/clinic-history.service';
import { IColumn } from '../../+shared/util';
import { ResponsiblePatient } from '../../models/responsible-patient.model';
import { ResponsiblePatientService } from '../responsible-patient.service';

@Component({
	selector: 'his-patient-form',
	templateUrl: './patient-form.component.html',
	styleUrls: ['./patient-form.component.css'],
})
export class PatientFormComponent implements OnInit {

	id: any;
	isEdit: boolean;
	isLoading: boolean = false;
	loading: boolean= false;
	form: FormGroup;
	patient: Patient = new Patient();
	functionForProvinces = this.commonService.getProvinces();
	public loadingLocalityIAC: boolean = false;
	documentTypes: Array<any>;
	provinces: Array<any>;
	zones: Array<any>;
	localities: Array<any>;
	genres: Array<any>;
	civilStates: Array<any>;
	bloodTypes: Array<any>;
	cuitLabel: any = "Cuit/Cuil";
	intervalId: number = 0;
	fileImage: Blob;
	src: any = require("../../images/default-image-profile.jpg");
    isLoadingImage = false;
    years: string = '';
	options: Options = {
		resize: {
			maxHeight: 128,
			maxWidth: 128
		},
		allowedExtensions: ['JPG', 'PnG']
	};
	datePickerOptions: any;
	
	deleteModalSubject: Subject<any> = new Subject();
	openModalSubject: Subject<any> = new Subject();
	deleteModaResponsiblelSubject: Subject<any> = new Subject();

	isNew: boolean = false;
	showPatientOsView: boolean = false;
	isMedicalEnsuranceLoaded: boolean = false;
	showPatientResponsibleView: boolean = false;

	itemValue: number = 1;
	defaultMedicalInsurance: MedicalInsurance;
	patientMedicalInsuranceId: 0;
	responsibleId: 0;

	columns = [
		{ header: "Obra social", property: "medicalInsuranceName", searchProperty: 'medicalInsurance.medicalInsuranceAccount.name' },
		{ header: "Nro de carnet", property: "carnetNumber" },
		{ header: "Fecha de Vencimiento", property: "expirationDate" },
        { header: "Por Defecto", property: "yesOrNo" },
	];

	patientMedicalInsurance: PatientMedicalInsurance = new PatientMedicalInsurance();
	responsiblePatient: ResponsiblePatient = new ResponsiblePatient();

	medicalInsuranceSelected: boolean = false;
	reloadingData: boolean = false;
	reloadingDataResponsible: boolean = false;

    public regIvas: Array<any>;
    public regIbrs: Array<any>;
    public grossinAliquots: Array<any>;
    public categories: Array<any>;
    functionForAccountPl: Observable<any> = this.commonService.getAccountPlan();
	isEditResponsible: boolean;

	constructor(
		private fb: FormBuilder,
		public patientService: PatientService,
		private route: ActivatedRoute,
		private router: Router,
		private commonService: CommonService,
		private toastyService: ToastyMessageService,
		private utilityService: UtilityService,
		public patientMedicalInsuranceService: PatientMedicalInsuranceService,
		public medicalInsuranceService: MedicalInsuranceService,
		private clinicHistoryService: ClinicHistoryService,
		public responsiblePatientService: ResponsiblePatientService
	) {
		this.id = this.route.snapshot.paramMap.get('id');
		patientService.account = this.id;
		this.isEdit = !!this.id;
	}

	ngOnInit() {
        this.datePickerOptions = this.utilityService.getDatePickerOptions();
		this.loadCombos();
		this.loadForm();
		this.patientMedicalInsuranceService.isNewPatient = !this.isEdit;
		this.patientMedicalInsuranceService.newPatientMedicalInsurances = new Array<PatientMedicalInsurance>();
		if(!this.isEdit) this.loadDefaultMedicalInsurance();
	}

	loadDefaultMedicalInsurance() {
		this.medicalInsuranceService.getDefault().subscribe(response => {
			this.defaultMedicalInsurance = response.model;

			if (!this.isEdit) {
				var patientMedicalInsurance = new PatientMedicalInsurance();
				patientMedicalInsurance.number = 0;
				patientMedicalInsurance.medicalInsurance = this.defaultMedicalInsurance;
				patientMedicalInsurance.carnetNumber = "";
				patientMedicalInsurance.byDefault = true;
				patientMedicalInsurance.patient = new Account();
				patientMedicalInsurance.socialNumber = this.defaultMedicalInsurance.accountNumber;
				patientMedicalInsurance.medicalInsuranceName = this.defaultMedicalInsurance.medicalInsuranceAccount.name;
				patientMedicalInsurance.patientNumber = 0;
                patientMedicalInsurance.patientName = "";
                patientMedicalInsurance.yesOrNo = "Si";
				this.insertPatientMedicalInsurance(patientMedicalInsurance);
				this.reloadingData = true;
			};
		});
	}

	insertPatientMedicalInsurance(patientMedicalInsurance: PatientMedicalInsurance) {
		this.patientMedicalInsuranceService.addArray(patientMedicalInsurance).subscribe(
			response => {
				this.isMedicalEnsuranceLoaded = true;
			},
			error => {
				this.isMedicalEnsuranceLoaded = false;
			});
	}

	loadCombos() {
		Observable.forkJoin(
			this.commonService.getIdentifiers(),
			this.commonService.getGenres(),
			this.commonService.getCivilStates(),
			this.commonService.getBloodTypes(),
			this.commonService.getZones(),
			this.commonService.getCategories(),
			this.commonService.getRegIva(),
			this.commonService.getRegibr(),
            this.commonService.getGrossinAliquot(),
		).subscribe((response: Array<any>) => {
			this.documentTypes = response[0].model || [];
			this.genres = response[1].model || [];
			this.civilStates = response[2].model || [];
			this.bloodTypes = response[3].model || [];
			this.zones = response[4].model || [];
			this.categories = response[5].model || [];
            this.regIvas = response[6].model || [];
			this.regIbrs = response[7].model || [];
			this.grossinAliquots = response[8].model || [];
			this.form.patchValue({identi: 0});
		},
			error => {
				this.toastyService.showErrorMessagge("Ocurrio un error al cargar los combos");
			});
	}

	loadForm() {
		if (this.isEdit) this.getPatient(this.id);
		else {
			this.createForm();
			this.patientMedicalInsuranceService.index = 0;
			this.patientMedicalInsuranceService.newPatientMedicalInsurances = Array<PatientMedicalInsurance>();
		}
	}

	createForm() {
		this.form = this.fb.group({
			surname: [this.patient.patientAccount.surname, Validators.required],
			name: [this.patient.patientAccount.name, Validators.required],
			address: [this.patient.patientAccount.address, null],
			quarter: [this.patient.patientAccount.quarter, null],
			phone: [this.patient.patientAccount.phone, null],
			movil: [this.patient.patientAccount.movil, null],
			identi: [this.patient.patientAccount.identi, Validators.required],
			cuit: [this.patient.patientAccount.cuit, null],
			zone: [this.patient.patientAccount.zone, Validators.required],
			birthdate: [this.patient.birthdate, null],
			transplanted: [this.patient.transplanted, null],
			genreNumber: [this.patient.genreNumber, Validators.required],
			stature: [this.patient.stature, ValidationService.numberValidator],
			weight: [this.patient.weight, ValidationService.numberValidator],
			children: [this.patient.children, ValidationService.numberValidator],
			civilStateNumber: [this.patient.civilStateNumber, null],
			bloodType: [this.patient.bloodType, null],
			clinicHistoryNumber: [this.patient.clinicHistoryNumber, null],
			province: [this.patient.patientAccount.province, Validators.required],
			locality: [this.patient.patientAccount.locality, Validators.required],
			ivaReg: [this.patient.patientAccount.ivaReg, Validators.required],
            ibrReg: [this.patient.patientAccount.ibrReg, Validators.required],
            ingbru: [this.patient.patientAccount.ingbru, null],
            aliibr: [this.patient.patientAccount.aliibr, Validators.required],
            category: [this.patient.patientAccount.category, Validators.required],
            bank: [this.patient.patientAccount.bank, null],
			cbu: [this.patient.patientAccount.cbu, null]
		});
        this.checkDuplicates();
	    this.updateYears();
	   
	}

	checkDuplicates() {
		const identiCtrl = this.form.get('identi');
		const cuitCtrl = this.form.get('cuit');
		if (cuitCtrl && identiCtrl) {
			identiCtrl
				.valueChanges
				.switchMap(val => this.patientService.checkDuplicates(val, cuitCtrl.value, this.id))
				.subscribe(val => {
					cuitCtrl.setErrors(val.model ? { duplicate: val.model } : null);
				});
			cuitCtrl
				.valueChanges
				.debounceTime(500)
				.switchMap(val => this.patientService.checkDuplicates(identiCtrl.value, val, this.id))
				.subscribe(val => {
					cuitCtrl.setErrors(val.model ? { duplicate: val.model } : null);
				});
		}
	}

	onSubmit() {
		this.loading = true;
		const patient = Object.assign({}, this.patient, this.form.value);
		patient.account = Object.assign({}, this.patient.patientAccount, this.form.value);
		if (!!patient.birthdate) {
			patient.birthdate = this.utilityService.formatDate(this.form.value.birthdate, "DD/MM/YYYY");
			patient.account.birthDate = patient.birthdate;
			patient.account.birthdate = patient.birthdate;
		}
		if (!this.isEdit) {
			this.patientMedicalInsuranceService.newPatientMedicalInsurances.forEach(e => {
				e.number = 0;
			});
			patient.medicalInsurances = this.patientMedicalInsuranceService.newPatientMedicalInsurances;
		}
		
		patient.account.name = patient.account.surname +', '+patient.account.name;

		this.patientService.save(patient)
			.subscribe(
				response => {
					if (this.fileImage) {
						this.commonService.uploadImage(response.model.accountNumber, this.fileImage)
							.finally(() => { this.loading = false; })
							.subscribe(
								result => {
									this.toastyService.showSuccessMessagge("Se guardaron los cambios");
									this.utilityService.navigate("archivos/pacientes");
								},
								error => {
									this.toastyService.showSuccessMessagge("Se guardaron los cambios del formulario");
									this.toastyService.showErrorMessagge(error.success ? error.errorMessage : "Error al subir la imagen");
								});
					} else {
						this.toastyService.showSuccessMessagge("Se guardaron los cambios");
						this.utilityService.navigate("archivos/pacientes");
						this.loading = false;
					}
				},
				error => {
					this.loading = false;
					this.toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al guardar los datos");
				});
	}

	getPatient(id: string) {
		this.isLoading = true;
		this.patientService.get(+id)
			.finally(() => this.isLoading = false)
			.subscribe(response => {
				this.patient = response.model;
				this.patient.patientAccount = this.patient.account;
                this.patient.birthdate = this.utilityService.formatDate(response.model.birthdate, "", "DD/MM/YYYY");
                this.years = this.patient.birthdate ? this.utilityService.getYearOld(response.model.birthdate, "DD/MM/YYYY") + ' Años' : 'Sin Datos';
				this.createForm();
				this.getLocalities(this.patient.patientAccount.province);
				this.setCuilLabel();
				this.patientMedicalInsuranceService.patientNumber = this.id;
				this.responsiblePatientService.patientId = this.id;
			},error => {
				this.toastyService.showToastyError(error, 'Ocurrio un error al obtener los datos del paciente');
			});
			this.loadImage();
	}

	private loadImage() {
		this.isLoadingImage = true;
		this.commonService.getImageAccount(this.id)
			.finally(() => this.isLoadingImage = false)
			.subscribe(response => {
				if (!!response.model.file) this.src = `data:image/jpeg;base64,${response.model.file}`;
			},
			error => {
				this.toastyService.showToastyError(error, 'Ocurrio un error al cargar la imagen');
			});
	}

	onProvinceChange(item: {number: number, name: string}) {
		if (item.number) this.getLocalities(item.number);
		else this.localities = [];
	}

	private getLocalities(province: number) {
		this.loadingLocalityIAC = true;
		this.commonService.getLocalities(province, 1)
			.finally(() => this.loadingLocalityIAC = false)
			.subscribe(
			result => {
				this.localities = result.model || [];
			}, error => {
				this.toastyService.showToastyError(error, 'No se pudo cargar el combo de Localidades.');
			});
	}

	onActionCloseResponsibleView(event: any) {
		this.showPatientResponsibleView = false;
	}

	onActionCancel(event: any) {
		this.patientMedicalInsuranceService.isNewPatientMedicalInsurance = false;
		this.showPatientOsView = false;
	}

	onActionSave(event: any) {
		this.patientMedicalInsuranceService.isNewPatientMedicalInsurance = false;
		this.showPatientOsView = false;
		this.isMedicalEnsuranceLoaded = true;
	}

	onActionClick(event: any) {
		switch (event.action) {
			case 'new':
				this.itemValue = 0;
				this.patientMedicalInsurance = new PatientMedicalInsurance();
				this.patientMedicalInsuranceService.isNewPatientMedicalInsurance = true;
				this.showPatientOsView = true;
				//this.isNew = true;
				break;
			case 'edit':
				this.itemValue = parseInt(`${event.item.number}`);
				if (this.isEdit) {
					this.patientMedicalInsuranceService.checkContractMedicalInsurance(this.itemValue).subscribe(response => {
						if (!response.model) {
							this.toastyService.showMessageToast("Contrato Vencido", "no se puede editar la obra social", "warning");
							this.showPatientOsView = response.model;
						} else {
							this.patientMedicalInsuranceService.number = this.itemValue;
							this.patientMedicalInsurance = event.item;
							this.patientMedicalInsuranceService.isNewPatientMedicalInsurance = false;
							this.showPatientOsView = true;
							this.isLoading = false;
							this.isNew = true;
						}
					}, error => {
						this.toastyService.showErrorMessagge("Ocurrio un error inesperado");
					})
				} else {
					this.patientMedicalInsuranceService.number = this.itemValue;
					this.patientMedicalInsurance = event.item;
					this.patientMedicalInsuranceService.isNewPatientMedicalInsurance = false;
					this.showPatientOsView = true;
					this.isLoading = false;
					this.isNew = true;
				}

				break;
			case 'delete':
				if (this.defaultMedicalInsurance.medicalInsuranceAccount.name == event.item.medicalInsuranceName) {
					this.toastyService.showMessageToast("Obra social Particular", "no se puede eliminar la obra social particular", "warning");
					break;
				}
				this.patientMedicalInsuranceId = event.item.number;
				if (this.patientMedicalInsuranceId != null) this.deleteModalSubject.next();
				break;
			default:
				break;
		}
	}

	onDeleteConfirm(event: any) {
		if (!this.isEdit) {
			if (this.patientMedicalInsuranceId != null) {
				for (let i = 0; i < this.patientMedicalInsuranceService.newPatientMedicalInsurances.length; i++) {
					if (this.patientMedicalInsuranceId == this.patientMedicalInsuranceService.newPatientMedicalInsurances[i].number) {
						if (this.patientMedicalInsuranceService.newPatientMedicalInsurances[i].byDefault == true) {
							this.toastyService.showMessageToast("Obra social por defecto", "No puede eliminar obra social por defecto", "warning");
						} else {
							this.patientMedicalInsuranceService.newPatientMedicalInsurances.splice(i, 1);
							this.patientMedicalInsuranceService.index = this.patientMedicalInsuranceService.index - 1;
							this.reloadingData = true;
							this.toastyService.showSuccessMessagge("Se elimino correctamente");
						}
					}
				}

			} else {
				this.toastyService.showErrorMessagge("Ocurrio un error inesperado");
			}
		} else {
			this.onDeleteConfirmBase(event);
		}
	}

	onDeleteConfirmBase(event: any) {
		this.patientMedicalInsuranceService.delete(this.patientMedicalInsuranceId)
			.subscribe((resp: any) => {
				this.reloadingData = true;
				this.toastyService.showMessageToast("Exito", "Se elimino correctamente", "success");
			},
				(error: any) => {
					if (error.success && error.didError) {
						this.toastyService.showMessageToast("Obra social por defecto", error.errorMessage, "warning");
					} else {
						this.toastyService.showErrorMessagge("Ocurrió un error al guardar los cambios");
					}
				});
	}

	onDeleteConfirmResponsible(event: any) {
		this.responsiblePatientService.delete(this.responsibleId)
			.subscribe((resp: any) => {
				this.reloadingDataResponsible = true;
				this.toastyService.showMessageToast("Exito", "Se elimino correctamente", "success");
			},
				(error: any) => {
					this.toastyService.showErrorMessagge("Ocurrió un error al guardar los cambios");
				});
	}

	updateReloadingData(event: any) {
		this.reloadingData = event.value;
	}

	setCuilLabel() {
		clearInterval(this.intervalId);
		if (!this.documentTypes) {
			this.intervalId = setInterval(() => this.setCuilLabel(), 500);
			return;
		}
		this.onChangeIdenti();
	}

	clickFile() {
		(document.getElementById('file-input') as HTMLInputElement).click();
	}

	selected(event: any) {
		const image = <HTMLInputElement>document.getElementById('imgSRC');
		image.src = URL.createObjectURL(event.target.files[0]);
		this.fileImage = event.target.files[0];
	}

	onChangeIdenti() {
		const value = this.documentTypes.find(d => d.number == this.form.value.identi);
		this.cuitLabel = value.name;
	}

	onCancelButton(): void {
		this.openModalSubject.next();
	}

	onAgree() {
		this.utilityService.navigate("archivos/pacientes");
	}

	onClickViewMedicalInsurance() {
		const id = this.route.snapshot.paramMap.get('id');
		this.patientMedicalInsuranceService.patientNumber = id;
		this.utilityService.navigate("pacienteObraSocial/obraSocial/" + id);
	}

	validateMedicalInsuranceByDefault() {
		var medicalInsuranceDefect = this.patientMedicalInsuranceService.newPatientMedicalInsurances.filter(
			m => m.byDefault == true);

		if (medicalInsuranceDefect.length <= 0) {
			//this.setMedicalInsuranceDefect.emit({ value: false });
			this.toastyService.showMessageToast("Ingrese Obra social por defecto", "Debe seleccionar obra social por defecto", "warning");
		} else if (medicalInsuranceDefect.length > 1) {
			//this.setMedicalInsuranceDefect.emit({ value: false });
			this.toastyService.showMessageToast("Seleccione solo una obra social por defecto", "Debe seleccionar solo una obra social por defecto", "warning");
		}
	}

	showClinicHistory() {
		this.clinicHistoryService.patientName = this.patient.account.name;
		this.clinicHistoryService.setCustomFilters();
		this.utilityService.navigate(`historiaclinica/listado/${this.id}`);
	}

	onActionClickResponsible(event: any) {
		switch (event.action) {
			case 'new':
				this.responsiblePatient = new ResponsiblePatient();
				this.showPatientResponsibleView = true;
				this.isEditResponsible = false;
				this.responsiblePatient.patientId = +this.id;
				this.responsiblePatientService.patientId = +this.id;
				break;
			case 'edit':
				this.isEditResponsible = true;
				this.showPatientResponsibleView = true;
				this.responsiblePatient = event.item;
				this.responsiblePatientService.patientId = +this.id;
				break;
			case 'delete':
				this.responsiblePatientService.patientId = +this.id;
				this.responsibleId = event.item.responsibleId;
				if (this.responsibleId != null) this.deleteModaResponsiblelSubject.next();
				break;
			default:
				break;
		}
	}

	updateReloadingDataResponsibles(event: any) {
		this.reloadingDataResponsible = event.value;
    }

    updateYears() {
        const birthdate = this.form.get('birthdate');
        if (!birthdate) return;
        birthdate.valueChanges.subscribe(date => {
            this.years = date ? this.utilityService.getYearOld(date, "DD/MM/YYYY") + ' Años' : 'Sin Datos';
        });
        
    }
}
