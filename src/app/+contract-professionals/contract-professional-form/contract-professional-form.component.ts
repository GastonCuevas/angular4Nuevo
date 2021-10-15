import { ContractProfessionalAbsenceService } from './../contract-professional-absence.service';
import { ContractProfessionalMedicalInsuranceService } from './../contract-professional-medical-insurance.service';
import { ContractProfessionalService } from '../contract-professional.service';
import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { ContractProfessional } from '../../models/contract-professional.model';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService, ToastyMessageService, UtilityService } from '../../+core/services';
import { ActivatedRoute, Router } from '@angular/router';

import * as $ from 'jquery';
import { ProfessionalContractSchedule } from '../../models/professional-contract-schedule.model';
import { ContractProfessionalScheduleService } from '../contract-professional.schedule.service';
import * as moment from 'moment';
import { ProfessionalContractAbsence } from '../../models/professional-contract-absence.model';
import { ProfessionalService } from '../../+professional/professional.service';
import { ContractProfessionalConceptService } from '../contract-professional-concept.service';

import { Options } from 'ngx-image2dataurl';

@Component({
    selector: 'app-contract-professional-form',
    templateUrl: './contract-professional-form.component.html',
    styleUrls: ['./contract-professional-form.component.scss']
})

export class ContractProfessionalFormComponent implements OnInit, AfterViewChecked, OnDestroy {

    contractProfessional = new ContractProfessional();
    auxListProfessionals = new Array<any>();
    isEdit = false;
    openModalDiscardSubject = new Subject();
    isLoading = false;
    public isLoadingSubmit: boolean = false;
    public form: FormGroup;
    public datePickerOptions: any;
    public datePickerOptionsWhitMax: any;
    public select: string = '';
    isClone = false;
    public professionals: Array<any>;
    public professionalName: string = '';
    public isNew: boolean = false;
    public isValidDateFrom: boolean = true;
    public isValidDateTo: boolean = true;
    functionForProfessionals = this._commonService.getProfessionals();
    professionalContractSchedule: ProfessionalContractSchedule;
    professionalContractAbsence: ProfessionalContractAbsence;
    isNewSchedule: boolean = false;
    isNewMedicalInsurance: boolean = false;
    isNewPracticesMedicalInsurance: boolean = false;
    isNewAbsence: boolean = false;
/****concepts */
    isNewConcept = false;
    deleteModalConceptSubject: Subject<any> = new Subject();
    itemConceptSelected: any;
/** */
    private professionalId: number;
    private contractId: number;
    deleteModalScheduleSubject: Subject<any> = new Subject();
    itemScheduleSelected: any;

    deleteModalAbsenceSubject: Subject<any> = new Subject();
    itemAbsenceSelected: any;


    title: string = '';
    isActive: string = 'HORARIOS';
    showDPOwhitMin = true;

    public fileImage: Blob;
    src: any = require('../../images/default-image-profile.jpg');
    isLoadingImage = false;
    options: Options = {
        resize: {
            maxHeight: 128,
            maxWidth: 128
        },
        allowedExtensions: ['JPG', 'PnG']
    };

    constructor(
        private fb: FormBuilder,
        public contractProfessionalService: ContractProfessionalService,
        public contractProfessionalScheduleService: ContractProfessionalScheduleService,
        public contractProfessionalMedicalInsuranceService: ContractProfessionalMedicalInsuranceService,
        public contractProfessionalAbsenceService: ContractProfessionalAbsenceService,
        public contractProfessionalConceptService: ContractProfessionalConceptService,
        public professionalService: ProfessionalService,
        private _commonService: CommonService,
        private _route: ActivatedRoute,
        private _utilityService: UtilityService,
        private _toastyService: ToastyMessageService
    ) {
        this.professionalId = Number(this._route.snapshot.paramMap.get('profesionalId'));
        this.contractId = Number(this._route.snapshot.paramMap.get('id'));
        this.isEdit = !!this.contractId;
    }

    ngOnInit() {
        this.datePickerOptions = this._utilityService.getDatePickerOptions();
        this.datePickerOptionsWhitMax = this._utilityService.getDatePickerOptions();
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
        this.isNewSchedule = false;
        this.loadForm();
    }

    ngAfterViewChecked() {
        $('#description').trigger('autoresize');
        $('#observation').trigger('autoresize');
    }

    isCloned() {
        var urlSegments = this._route.snapshot.url;
        var foundClone = urlSegments.find((e: any) => {
            return e.path.toLowerCase() == 'clone';
        })
        return foundClone ? true : false;
    }

    loadForm() {
        this.isClone = this.isCloned();

        if (!this.professionalId)
            this.isNew = true;
        else {
            this.isNew = false;
            this.isEdit = true;
            this.getProfessionalName(this.professionalId);
        }

        this.title = (!this.isEdit ? 'NUEVO ' : this.isClone ? 'CLONACION DE ' : 'EDICION DE ') + 'CONTRATO';
        this.contractProfessionalScheduleService.isCloned = this.isClone;

        if (this.contractId) this.getContractProfessional(this.contractId);
        else this.createForm();
    }

    cancelSchedule() {
        this.isNewSchedule = false;
        this.deleteModalScheduleSubject = new Subject();
    }

    cancelMedicalInsurance() {
        this.isNewMedicalInsurance = false;
        this.deleteModalScheduleSubject = new Subject();
    }

    hidePracticesMedicalInsuranceView() {
        this.isNewPracticesMedicalInsurance = false;
        this.deleteModalScheduleSubject = new Subject();
    }

    createForm() {
        this.form = this.fb.group({
            professionalName: [this.contractProfessional.professionalName, Validators.required],
            dateFrom: [this.contractProfessional.dateFrom, Validators.required],
            dateTo: [this.contractProfessional.dateTo, null],
            observation: [this.contractProfessional.observation],
            description: [this.contractProfessional.description],
            fixedAmount: [this.contractProfessional.fixedAmount, null],
            priceHs: [this.contractProfessional.priceHs, Validators.required]
        });
    }

    selectedProfessional(professional: any): void {
        if (professional != null) {
            this.contractProfessional.professionalNumber = professional.number;
        }
    }

    customCallbackDateFrom(event: any) {
        this.isValidDateFrom = true;
        let compareDate = this.compare(event, this.form.value.dateTo);
        if (compareDate == 1) {
            this.isValidDateFrom = false;
            this.isValidDateTo = true;
        } else if (compareDate == -1) {
            this.isValidDateFrom = true;
            this.isValidDateTo = true;
        }

    }

    customCallbackDateTo(event: any) {
        this.isValidDateTo = true;
        let compareDate = this.compare(event, this.form.value.dateFrom);
        if (compareDate == -1) {
            this.isValidDateFrom = true;
            this.isValidDateTo = false;
        } else if (compareDate == 1) {
            this.isValidDateFrom = true;
            this.isValidDateTo = true;
        }
    }

    compare(dateTimeA: string, dateTimeB: string) {
        var momentA = moment(dateTimeA, 'DD/MM/YYYY');
        var momentB = moment(dateTimeB, 'DD/MM/YYYY');
        if (momentA > momentB) return 1;
        else if (momentA < momentB) return -1;
        else return 0;
    }

    saveContractProfessional($event: any) {
        this.isLoadingSubmit = true;
         const contractProfessional = Object.assign({}, this.contractProfessional, this.form.value);
        contractProfessional.dateFrom = this._utilityService.formatDate(contractProfessional.dateFrom, 'DD/MM/YYYY');
        contractProfessional.dateTo = this._utilityService.formatDate(contractProfessional.dateTo, 'DD/MM/YYYY');
        const id = this._route.snapshot.paramMap.get('id');
        contractProfessional.schedules = this.contractProfessionalScheduleService.schedules;
        contractProfessional.medicalInsuranceContracts = this.contractProfessionalMedicalInsuranceService.contractMedicalInsurances;
        contractProfessional.absences = this.contractProfessionalAbsenceService.contractAbsences.map((item: ProfessionalContractAbsence) => {
            var absence: ProfessionalContractAbsence = Object.assign({}, item);
            absence.dateFrom = this._utilityService.formatDate(absence.dateFrom,'DD/MM/YYYY');
            absence.dateTo = this._utilityService.formatDate(absence.dateTo, 'DD/MM/YYYY');
            absence.editionDate = this._utilityService.formatDate(absence.editionDate, 'DD/MM/YYYY');
            return absence;
        });
        contractProfessional.numint = !this.isClone ? contractProfessional.numint : 0;

        if (!id || this.isClone) {
            contractProfessional.number = 0;
            this.contractProfessionalScheduleService.isCloned = false;
        }
        this.contractProfessionalService.save(contractProfessional)
            .subscribe(
            response => {
                if (this.fileImage) {
                    this.contractProfessionalService.uploadImage(response.model.number, this.fileImage)
                        .finally(() => { this.isLoadingSubmit = false; })
                        .subscribe(
                        result => {
                            this.resetListSchedules();
                            this.resetListMedicalInsurances();
                            this.resetListAbsences();
                            this._toastyService.showSuccessMessagge('Se guardaron los cambios');
                            
                            this._utilityService.navigateToBack();
                        },
                        error => {
                            this._toastyService.showSuccessMessagge('Se guardaron los cambios del formulario');
                            this._toastyService.showToastyError(error, 'Error al subir la imagen');
                        });
                } else {
                    this.resetListSchedules();
                    this.resetListMedicalInsurances();
                    this.resetListAbsences();
                    this.isLoadingSubmit = false;
                    this._toastyService.showSuccessMessagge('Se guardaron los cambios');
                    this._utilityService.navigateToBack();
                }
            },
            error => {
                this._toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al guardar los datos');
                this.isLoadingSubmit = false;
            });
    }

    getContractProfessional(id: number) {
        this.isEdit = true;
        this.isLoading = true;
        this.contractProfessionalMedicalInsuranceService.contractId = id;
        this.contractProfessionalService.get(id)
            .finally(() => this.isLoading = false)
            .subscribe(
                response => {
                    this.contractProfessional = response.model;
                    this.contractProfessionalScheduleService.schedules = JSON.parse(JSON.stringify(response.model.schedules));
                    this.contractProfessional.dateFrom = !this.isClone ? this._utilityService.formatDateFE(response.model.dateFrom) : '';
                    this.contractProfessional.dateTo = !this.isClone ? this._utilityService.formatDateFE(response.model.dateTo): '';
                    this.contractProfessionalConceptService.professionalContractId = this.contractId;
                    this.createForm();
                },
                error => {
                    this._toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al obtener los datos del contrato');
            });
        if (!this.isClone) this.loadImage();
    }

	getProfessionalName(professionalId: any) {
        if (professionalId) {
            this.professionalService.getProfessional(professionalId)
                .subscribe(
                    response => {
                        var professional = response.model;
						this.contractProfessional.professionalName = professional.professionalAccount.fullname;
                        if (!!this.form) this.form.controls['professionalName'].setValue(this.contractProfessional.professionalName);
                    },
                    error => {
                        this._toastyService.showToastyError(error, 'Ocurrio un error al obtener los datos del contrato');
                    });
        }
        else {
			this.contractProfessional.professionalName = '';
        }
    }

    onCancelButton() {
        this.openModalDiscardSubject.next();
    }

    onActionClick(event: any) {
        switch (event.action) {
            case 'new':
                this.isNewSchedule = true;
                this.contractProfessionalScheduleService.isNewSchedule = true;
                break;
            case 'edit':
                this.isNewSchedule = true;
                this.contractProfessionalScheduleService.isNewSchedule = false;
                this.contractProfessionalScheduleService.itemToEdit(event.item);
                break;
            case 'delete':
                this.itemScheduleSelected = event.item;
                this.deleteModalScheduleSubject.next();
                break;
            case 'detail':
                break;
            default:
                break;
        }
    }

    onActionClickMedicalInsurance(event: any) {
        switch (event.action) {
            case 'new':
                this.isNewPracticesMedicalInsurance = true;
                this.contractProfessionalMedicalInsuranceService.isNewMedicalInsurance = true;
                break;
            case 'edit':
                this.isNewMedicalInsurance = true;
                this.contractProfessionalMedicalInsuranceService.isNewMedicalInsurance = false;
                this.contractProfessionalMedicalInsuranceService.itemToEdit(event.item);
                break;
            case 'delete':
                this.itemScheduleSelected = event.item;
                this.deleteModalScheduleSubject.next();
                break;
            case 'detail':
                break;
            default:
                break;
        }
    }

    discardChanges() {
        let routeList = this.contractProfessionalService.routeList ? this.contractProfessionalService.routeList : 'gestionProfesionales/contratos';
        this.resetListSchedules();
        this.resetListMedicalInsurances();
        this.resetListAbsences();
		this._utilityService.navigate(routeList);
    }

    resetListSchedules() {
        this.contractProfessionalScheduleService.newSchedules = new Array<ProfessionalContractSchedule>();
        this.contractProfessionalScheduleService.deletedSchedules = new Array<ProfessionalContractSchedule>();
        this.contractProfessionalScheduleService.modifiedSchedules = new Array<ProfessionalContractSchedule>();
    }

    resetListMedicalInsurances() {
        this.contractProfessionalMedicalInsuranceService.contractMedicalInsurances = [];
        this.contractProfessionalMedicalInsuranceService.onEditOrAdd = false;
    }

    resetListAbsences() {
        this.contractProfessionalAbsenceService.newAbsences = new Array<ProfessionalContractAbsence>();
        this.contractProfessionalAbsenceService.deletedAbsences = new Array<ProfessionalContractAbsence>();
        this.contractProfessionalAbsenceService.modifiedAbsences = new Array<ProfessionalContractAbsence>();
        this.contractProfessionalAbsenceService.contractAbsences = [];
    }

    seleccionar(valor: string) {
        this.select = valor;
    }


    onActionClickAbsence(event: any) {
        switch (event.action) {
            case 'new':
                this.isNewAbsence = true;
                this.contractProfessionalAbsenceService.isNewAbsence = true;
                break;
            case 'edit':
                this.isNewAbsence = true;
                this.contractProfessionalAbsenceService.isNewAbsence = false;
                this.contractProfessionalAbsenceService.itemToEdit(event.item);
                break;
            case 'delete':
                this.itemAbsenceSelected = event.item;
                this.deleteModalAbsenceSubject.next();
                break;
            case 'detail':
                break;
            default:
                break;
        }
    }

    cancelAbsence() {
        this.isNewAbsence = false;
        this.deleteModalAbsenceSubject = new Subject();
    }

// ********* conceptos contrato

    cancelConcept() {
        this.isNewConcept = false;
        this.deleteModalConceptSubject = new Subject();
    }

    onActionClickConcept(event: any) {
        switch (event.action) {
            case 'new':
                this.isNewConcept = true;
                this.contractProfessionalConceptService.isNewConcept = true;
                break;
            case 'edit':
                this.isNewConcept = true;
                this.contractProfessionalConceptService.isNewConcept = false;
                break;
            case 'delete':
                this.contractProfessionalConceptService.professionalContractConcept = event.item;
                
                break;
            case 'detail':
                break;
            default:
                break;
        }
    }

    

// ************* 

    changeActiveTab(tab: string) {
        this.isActive = tab;
    }

    ngOnDestroy(): void {
        this.contractProfessionalMedicalInsuranceService.contractMedicalInsurances = [];
        this.contractProfessionalScheduleService.schedules = [];
        this.contractProfessionalMedicalInsuranceService.contractMedicalInsurances = [];
        this.contractProfessionalMedicalInsuranceService.onEditOrAdd = false;
        this.contractProfessionalMedicalInsuranceService.onEditOrAdd = false;
        this.contractProfessionalScheduleService.onEditOrAdd = false;
    }

    haveSchudelesAndMedicalInsurances(){
        return  {
           hasSchudeles :  this.contractProfessionalScheduleService.schedules.length > 0 ,
           hasMedicalInsurances: this.contractProfessionalMedicalInsuranceService.contractMedicalInsurances.length > 0
        }
    }

    selected(event: any) {
        const image = <HTMLInputElement>document.getElementById('imgSRC');
        image.src = URL.createObjectURL(event.target.files[0]);
        this.fileImage = event.target.files[0];
    }

    onClickFile() {
        (document.getElementById('file-input') as HTMLInputElement).click();
    }

    private loadImage() {
        this.isLoadingImage = true;
        this.contractProfessionalService.getImage(this.contractId)
            .finally(() => this.isLoadingImage = false)
            .subscribe(
                response => {
                    if (!!response.model.file) this.src = `data:image/jpeg;base64,${response.model.file}`;
                },
                error => {
                    this._toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al cargar la imagen');
                });
    }
}