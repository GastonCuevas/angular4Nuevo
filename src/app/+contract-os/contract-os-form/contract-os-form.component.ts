import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { ContractOs } from './../../models/contract-os.model';
import { ContractOsPractice } from './../../models/contract-os-practice.model';
import { ContractOsService } from './../contract-os.service';
import { ContractOsPracticeService } from './../../+contract-os/contract-os-practice.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { UtilityService } from '../../+core/services/utility.service';
import { CommonService } from './../../+core/services/common.service';
import * as jquery from 'jquery';
import * as moment from 'moment';
import { DynamicTableComponent } from '../../+shared/dynamic-table/dynamic-table.component';

@Component({
	selector: 'app-contract-os-form',
	templateUrl: 'contract-os-form.component.html',
	styleUrls: ['./contract-os-form.component.scss']
})

export class ContractOsFormComponent implements OnInit, AfterViewChecked {
	contractOsId: any;
	contractOsPracticeId: number = 0;
	contractOs: ContractOs = new ContractOs();
	contractOsPractice: ContractOsPractice = new ContractOsPractice();
	medicalInsurances: Array<any>;
	practicesInos: Array<any> = new Array<any>();
	form: FormGroup;
	formPractice: FormGroup;
	isClone: boolean = false;
	isLoading: boolean = false;
	showPracticeForm: boolean = false;
	isNewPractice: boolean = false;
	datePickerOptions: any;
	datePickerOptionsWhitMax: any;
	reloadingData: boolean = false;
	openModalSubject: Subject<any> = new Subject();
	deleteModalSubject: Subject<any> = new Subject();
	showDPOwhitMin = true;
//	isValidListPractice = false;

	constructor(
		public contractOsService: ContractOsService,
		public contractOsPracticeService: ContractOsPracticeService,
		private toastyMessageService: ToastyMessageService,
		private utilityService: UtilityService,
		private commonService: CommonService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
		private fbp: FormBuilder
	) {
		this.isClone = this.activatedRoute.snapshot.paramMap.get('change') == "clone";
		this.contractOsId = this.activatedRoute.snapshot.paramMap.get('id');
		if (!this.contractOsId || this.isClone) {
			this.contractOsPracticeService.newPractices = new Array<ContractOsPractice>();
			this.contractOsPracticeService.isNewPractice = true;
		} else this.contractOsPracticeService.contractNumber = parseInt(this.contractOsId);
	}

	ngOnInit() {
		this.datePickerOptions = this.utilityService.getDatePickerOptions();
		this.datePickerOptionsWhitMax = this.utilityService.getDatePickerOptions();
		/******** */
		this.datePickerOptions.max = false;
		this.datePickerOptionsWhitMax.max = false;
		this.datePickerOptions['onSet'] = (value: any) => {
            if (value.select) {
                this.datePickerOptionsWhitMax.min = moment(this.form.value.dateFrom, 'DD/MM/YYYY').toDate();
                this.showDPOwhitMin = !this.showDPOwhitMin;
                if (this.form.value.dateTo) {
                    if (moment(this.form.value.dateTo, 'DD/MM/YYYY').isBefore(moment(this.form.value.dateFrom, 'DD/MM/YYYY'), 'day')) {
                        this.form.controls.dateTo.setValue(null);

                    }
                }
            }
            else if (value.clear === null) {
                this.datePickerOptionsWhitMax.min = false;
                this.showDPOwhitMin = !this.showDPOwhitMin;
            }
        }
		/******** */
		this.loadMedicalEnsurance();
		this.loadPracticeInos();
		this.loadForm();
	}

	ngAfterViewChecked() {
        $('#description').trigger('autoresize');
        $('#observation').trigger('autoresize');
	}

	loadMedicalEnsurance() {
		this.commonService.getMedicalInsurances().subscribe(
			response => {
				this.medicalInsurances = response.model;
			});
	}

	loadPracticeInos() {
		this.commonService.getInosPractices().subscribe(
			response => {
				this.practicesInos = response.model;
			});
	}

	loadForm() {
		if (!this.contractOsId) {
			this.contractOs.medicalInsuranceNumber = this.contractOsService.osNumber;
			this.createForm();
		} 
		else this.getContractOS();
	}

	createForm() {
		this.form = this.fb.group({
			medicalInsuranceNumber: [this.contractOs.medicalInsuranceNumber, Validators.required],
			dateFrom: [this.contractOs.dateFrom, Validators.required],
			dateTo: [this.contractOs.dateTo, null],
			observation: [this.contractOs.observation, null],
			description: [this.contractOs.description, null],
		});
		setTimeout(() => $('.materialize-textarea').trigger('autoresize'));
	}

	createFormPractice() {
		this.formPractice = this.fbp.group({
			practiceNumber: [this.contractOsPractice.practiceNumber, Validators.required],
			code: [this.contractOsPractice.code, null],
			coinsurance: [this.contractOsPractice.coinsurance, null],
			price: [this.contractOsPractice.price, Validators.required],
			medicalCoverage: [this.contractOsPractice.medicalCoverage, Validators.required],
			medical: [this.contractOsPractice.medical, null],
			facturable: [this.contractOsPractice.facturable, null],
			coinsuranceFac: [this.contractOsPractice.coinsuranceFac, null]
		})
	}

	getContractOS() {
		this.isLoading = true;
		this.contractOsService.get(this.contractOsId)
			.finally(() => this.isLoading = false)
			.subscribe(
			response => {
				this.contractOs = response.model;
				this.contractOs.dateFrom = this.utilityService.formatDate(response.model.dateFrom, '', 'DD/MM/YYYY');
				this.contractOs.dateTo = this.utilityService.formatDate(response.model.dateTo, '', 'DD/MM/YYYY');
				if (this.isClone) {
					this.contractOs.number = 0;
					this.contractOs.practices.forEach(d => {
						d.contractNumber = 0;
						d.number = d.practiceNumber;
					});
					this.contractOsPracticeService.newPractices = JSON.parse(JSON.stringify(this.contractOs.practices));
				}
				this.createForm();
			},
			error => {
				this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al cargar los datos");
			});
	}

	getContractOSPractice() {
		if (!this.contractOsId || this.isClone) {
			this.contractOsPractice = Object.assign(new ContractOsPractice(), this.contractOsPracticeService.find(this.contractOsPracticeId));
			this.createFormPractice();
			return;
		}
		this.isLoading = true;
		this.contractOsPracticeService.get(this.contractOsPracticeId)
			.finally(() => this.isLoading = false)
			.subscribe(
			response => {
				this.contractOsPractice = response.model;
				this.createFormPractice();
			},
			error => {
				this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al cargar los datos");
			});
	}

	savePractice() {
		const contractOsPractice = Object.assign({}, this.contractOsPractice, this.formPractice.value);
		if (this.contractOsPracticeService.isNewPractice || this.isClone) {
			contractOsPractice.practiceName = this.practicesInos.find(d => d.number == contractOsPractice.practiceNumber).name;
			if (this.contractOsPracticeService.exists(contractOsPractice)) { this.toastyMessageService.showErrorMessagge("Ya existe una práctica para la OS"); return; }
		}
		this.contractOsPracticeService.save(contractOsPractice).subscribe(
			response => {
				this.toastyMessageService.showSuccessMessagge(`La práctica ha sido ${this.isNewPractice ? "agregada" : "modificada"}`);
				this.showPracticeForm = false;
			},
			error => {
				this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : `Ocurrio un error al ${this.isNewPractice ? "agregar" : "modificar"} la práctica`);
			});
	}

	saveContract() {
		const contractOs = Object.assign({}, this.contractOs, this.form.value);
		contractOs.dateFrom = this.utilityService.formatDate(contractOs.dateFrom, "DD/MM/YYYY");
		contractOs.dateTo = this.utilityService.formatDate(contractOs.dateTo, "DD/MM/YYYY");
		if (this.contractOsPracticeService.isNewPractice || this.isClone) {
			contractOs.practices = JSON.parse(JSON.stringify(this.contractOsPracticeService.newPractices));
			contractOs.practices.forEach((d: any) => d.number = 0);
		}
		this.contractOsService.save(contractOs).subscribe(
			response => {
				this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
				this.utilityService.navigate(this.contractOsService.routeList);
			},
			error => {
				this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al guardar los datos");
			});
	}

	onActionClick(event: any) {
		switch (event.action) {
			case 'new':
				this.showPracticeForm = true;
				this.isNewPractice = true;
				this.contractOsPractice = new ContractOsPractice();
				if (!!this.contractOsId && !this.isClone) this.contractOsPractice.contractNumber = +this.contractOsId;
				this.createFormPractice();
				break;
			case 'edit':
				this.showPracticeForm = true;
				this.isNewPractice = false;
				this.contractOsPracticeId = event.item.number;
				this.getContractOSPractice();
				break;
			case 'delete':
				this.contractOsPracticeId = event.item.number;
				if (!!this.contractOsPracticeId) this.deleteModalSubject.next();
				break;
			case 'detail':
				this.utilityService.navigate(`archivos/contratosOs/practicas/detalle/${event.item.number}`);
				break;
			default:
				break;
		}
	}

	deletePractice() {
		this.contractOsPracticeService.delete(this.contractOsPracticeId).subscribe(
			response => {
				this.contractOsPracticeId = 0;
				this.reloadingData = true;
				this.toastyMessageService.showSuccessMessagge("Se elimino la práctica correctamente");
			});
	}

	onCancel() {
		this.openModalSubject.next();
	}

	onAgree() {
		if (!this.showPracticeForm) this.utilityService.navigate(this.contractOsService.routeList);
		else this.showPracticeForm = false;
	}

	updateReloadingData(event: any) {
		this.reloadingData = event.value;
	}

	// validatePractice() {
    //     const isNotEmpty = this.dynamicTable.sourceData.length != 0;
    //     if (this.isValidListPractice != isNotEmpty) {
    //         this.isValidListPractice = isNotEmpty;
    //     }
    // }
}