import { HcEvolution } from './../../models/hc-evolution.model';
import { AssignedPracticeTypeService } from './../../+item-practice/assigned-practice-type.service';
import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { Internment, ClinicHistory } from '../../models';
import { InternmentService } from '../internment.service';
import { CommonService, ToastyMessageService, UtilityService } from '../../+core/services';
import { ItemCombo, IColumn } from '../../+shared/util';

import * as moment from 'moment';
import { DiagnosticMovement } from '../../models/diagnostic-movement.model';
import { Diagnostic } from '../../models/diagnostic.model';
import { DiagnosticMovementService } from '../../+clinic-history/diagnostic-movement';

import { ItemPractice } from '../../models/item-practice.model';
import { FormControlService } from '../../+shared/forms/form-control.service';
import { GenericControl } from '../../+shared/index';
import { HcEvolutionService } from '../hc-evolution.service';
import { ProfessionalService } from '../../+professional/professional.service';
import { TreatingProfessional } from '../../models/treating-professional.model';
import { TreatingProfessionalService } from '../treating-professional.service';

@Component({
    selector: 'app-internment-form',
    templateUrl: './internment-form.component.html',
    styleUrls: ['./internment-form.component.scss']
})
export class InternmentFormComponent implements OnInit, AfterViewChecked {

    inputDataControls: Array<GenericControl>;

    diagnostic: Diagnostic;
    diagnostics: Array<any> = new Array<any>();
    internment: Internment = new Internment();
    diagnosticMovement: DiagnosticMovement = new DiagnosticMovement();
    isLoading: boolean = false;
    isSaving: boolean = false;
    isNew: boolean = true;
    form: FormGroup;
    formControls: FormGroup;

    formattedDate: string;
    specialties: Array<ItemCombo> = new Array<ItemCombo>();
    professionals: Array<ItemCombo> = new Array<ItemCombo>();
    receptionProfessionals: Array<ItemCombo> = new Array<ItemCombo>();
    loadingProfessionalIAC: boolean;
    medicalInsurances: Array<ItemCombo> = new Array<ItemCombo>();
    loadingMInsuranceIAC: boolean;
    items: Array<ItemPractice> = new Array<ItemPractice>();
    practices: Array<ItemCombo> = new Array<ItemCombo>();
    practiceType: number = 2;
    loadingPracticeIAC: boolean;
    isLoadingDiagnostic: boolean = false;
    loadingSpecialtyIAC: boolean;
    loadingBedIAC: boolean = false;
    freeBeds: Array<ItemCombo>;
    openModalDiscardSubject: Subject<any> = new Subject();
    openModalHighHospitalizationSubject = new Subject();
    reloadingData: boolean = false;
    private selection: Selection = new Selection();
    showDiagnostics: boolean = false;
    showItems: boolean = false;
    showDiagnosticForm: boolean = false;
    showEvolutionForm: boolean = false;
    types: Array<ItemCombo>;
    hcEvolution: ClinicHistory;
    deleteModalDiagnosticSubject: Subject<any> = new Subject();
    modalDeleteEvolutionSubject: Subject<any> = new Subject();
    modalDeleteProfessionalSubject: Subject<any> = new Subject();
    diagnosticMovementId: number;
    hcEvolutionId: number;
    isPatientDischarge: boolean = false;
    isValidListDiagnostics = false;
    isValidInternmentPatient: boolean = true;
    reloadingDataEvolution: boolean = false;
    reloadingDataProfessional: boolean = false;
    treatingProfessionalId: number;
    activeTab = 'diagnostics';
    readonlyInternment: boolean;
    showTreatingProfessionalForm: boolean = false;
    isValidCancelDischargeDate = false;

    /////
    dateOptions = this.getDatePickerOptions('dateAdmission');
    timeOptions = this.getTimePickerOptions('time');
    /////

    professionalColumns: Array<IColumn> = [
        { header: 'Nombre', property: 'name', searchProperty: 'professionalAccount.name', filterType: 'name' },
        { header: 'Documento', property: 'cuit', searchProperty: 'professionalAccount.cuit', filterType: 'text' },
        { header: 'Dirección', property: 'address', searchProperty: 'professionalAccount.address', filterType: 'text', hideInMobile: true }
    ];
    patientColumns: Array<IColumn> = [
        { header: 'Nombre', property: 'name', searchProperty: 'patientAccount.name', filterType: 'name' },
        { header: 'Documento', property: 'cuit', searchProperty: 'patientAccount.cuit', filterType: 'text' },
        { header: 'Dirección', property: 'address', searchProperty: 'patientAccount.address', filterType: 'text', hideInMobile: true },
        { header: 'Estado', property: 'estado', disableSorting: true },
    ];

    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private commonService: CommonService,
        private utilityService: UtilityService,
        private toastyService: ToastyMessageService,
        private internmentService: InternmentService,
        public diagnosticMovementService: DiagnosticMovementService,
        public controlService: FormControlService,
        public hcEvolutionService: HcEvolutionService,
        public professionalService: ProfessionalService,
        public treatingProfessionalService: TreatingProfessionalService
    ) {
        this.isNew = !this.activatedRoute.snapshot.paramMap.get('id');
        this.hcEvolutionService.isEvolutionArray = this.isNew;
        this.readonlyInternment = this.internmentService.readonly;
        this.diagnosticMovementService.resetService();
        this.treatingProfessionalService.resetService();
    }

    ngOnInit() {
        this.loadForm();
    }

    ngAfterViewChecked() {
        $('#observation').trigger('autoresize');
    }

    private loadCombos() {
        this.loadBeds();
    }

    loadBeds() {
        this.loadingBedIAC = true;
        this.internmentService.getBeds()
            .finally(() => this.loadingBedIAC = false)
            .subscribe(
                result => {
                    if (!this.isNew && this.internment.bedId){
                        result.model.push({number:this.internment.bedId,name:this.internment.bedName});
                    }
                    this.freeBeds = result.model || [];
                },
                error => {
                    this.toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al cargar el combo de camas.');
                });
    }

    loadSpecialties() {
        this.loadingSpecialtyIAC = true;
        this.commonService.getSpecialtiesByProfessional(this.selection.professional)
            .finally(() => this.loadingSpecialtyIAC = false)
            .subscribe(
                result => {
                    this.specialties = result.model || [];
                },
                error => {
                    this.toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al cargar el combo de especialidad.');
                });
    }

    private loadForm() {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id) this.getInternment(+id);
        else {
            this.loadCombos();
            this.createForm();
            this.diagnosticMovementService.setDiagnosticList();
        };
    }

    private createForm() {
        this.form = this.fb.group({
            admissionDate: [this.internment.admissionDate,Validators.required],
            time: [this.internment.time,Validators.required],
            specialtyId: [0, Validators.required],
            professionalId: [this.internment.professionalId, Validators.required],
            patientId: [this.internment.patientId, Validators.required],
            medicalInsuranceId: [this.internment.medicalInsuranceId, Validators.required],
            practiceId: [this.internment.practiceId, Validators.required],
            bedId: [this.internment.bedId, Validators.required],
            observation: [this.internment.observation],
            authorizationCode: [this.internment.authorizationCode],
        });
    }

    private getInternment(id: number) {
        this.isLoading = true;
        this.internmentService.get(id)
            .finally(() => this.isLoading = false)
            .subscribe(
                result => {
                    this.internment = result.model;
                    //this.formattedDate = moment(this.internment.admissionDate, 'YYYY/MM/DD').format('dd/mm/yyyy');
                    //this.internment.admissionDate = moment(this.internment.admissionDate).format('dd/mm/yyyy');
                    this.loadCombos();
                    this.internment.admissionDate = this.utilityService.formatDateFE(this.internment.admissionDate);
                    this.internment.time = this.internment.time.substr(0, 5);
                    this.selection.patient = this.internment.patientId;
                    this.selection.medicalInsurance = this.internment.medicalInsuranceId;
                    this.medicalInsuranceChange(this.internment.medicalInsuranceId);
                    this.onChangeProfessional(this.internment.professionalId);
                    this.onChangePatient();
                    this.createForm();
                    this.enablePatientDischarge();
                    this.hcEvolutionService.patientMovementId = this.internment.id;
                    this.hcEvolutionService.setEvolutionList(this.internment.evolutions);
                    this.diagnosticMovementService.setDiagnosticList(this.internment.diagnostics);
                    this.hcEvolutionService.medicalInsuranceId = this.internment.medicalInsuranceId;
                    this.treatingProfessionalService.internmentId = this.internment.id;
                    this.treatingProfessionalService.getTreatingProfessionals(this.internment.id).subscribe(result => {
                        this.treatingProfessionalService.setTreatingProfessionalList(result.model);
                        // this.reloadingDataProfessional = true;
                    }, error => {
                        this.toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al obtener los datos de los profesionales.');
                    });
                },
                error => {
                    this.toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al obtener los datos de la internación.');
            });

    }

    getType(type: number) {
        let typeComponent: any;
        switch (type) {
            case 1:
                typeComponent = 'text';
                break;
            case 3 || 4:
                typeComponent = 'number';
                break;
            case 7:
                typeComponent = 'autocomplete';
                break;
            default:
                typeComponent = 'text';
                break;
        }
        return typeComponent;
    }

    specialtyChange() {
        this.selection.specialty = this.form.value.specialtyId;
    }

    private getProfessionals() {
        this.loadingProfessionalIAC = true;
        // this.commonService.getProfessionals(this.selection.medicalInsurance)
        this.commonService.getProfessionalsWithContract()
        .finally(() => this.loadingProfessionalIAC = false)
            .subscribe(
                response => {
                    this.professionals = response.model;
                    if (this.internment.professionalId)
                        this.form.patchValue({ professionalId: this.internment.professionalId });
                },
                error => {
                    this.toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Error al cargar el combo de Profesionales');
                });
    }

    onActionEvolutionClick(event: any) {
        switch (event.action) {
            case 'new':
                this.hcEvolutionId = 0;
                this.hcEvolutionService.hcEvolution = new HcEvolution();
                this.hcEvolutionService.isEvolutionArray = true;
                this.hcEvolutionService.isNew = true;
                this.showEvolutionForm = true;
                break;
            case 'edit':
                this.hcEvolutionId = parseInt(`${event.item.id}`);
                this.hcEvolution = event.item;
                this.hcEvolutionService.hcEvolution = event.item;
                this.hcEvolutionService.isEvolutionArray = true;
                this.hcEvolutionService.isNew = false;
                this.showEvolutionForm = true;
                this.isLoading = false;
                break;
            case 'detail':
                this.hcEvolutionId = parseInt(`${event.item.id}`);
                this.hcEvolution = event.item;
                this.hcEvolutionService.hcEvolution = event.item;
                this.hcEvolutionService.isEvolutionArray = true;
                this.hcEvolutionService.isNew = false;
                this.showEvolutionForm = true;
                this.isLoading = false;
                break;

            case 'delete':
                this.hcEvolutionId = event.item.id;
                this.modalDeleteEvolutionSubject.next();
                break;
            default:
                break;
        }
    }

    onChangePatient() {
        this.practices = [];

        if (this.form) {
            this.selection.patient = this.form.value.patientId;
            if (this.isNew) this.validPatientInternment();
            this.getMedicalInsurances(this.selection.patient);
        }
    }

    onChangeProfessional(professionalId?: number) {
        this.selection.professional = professionalId ? professionalId : this.form.value.professionalId;
        this.getPractices();
        this.loadSpecialties()
    }

    validPatientInternment() {
        this.internmentService.isValidPatientToInternment(this.selection.patient)
            .subscribe(
                response => {
                    this.isValidInternmentPatient = response.model;
                },
                error => {
                    this.toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Error al validar paciente');
                });
    }

    private getMedicalInsurances(patientId: number) {
        this.loadingMInsuranceIAC = true;
        this.commonService.getMedicalInsurancesByPatient(patientId)
            .finally(() => this.loadingMInsuranceIAC = false)
            .subscribe(
                response => {
                    this.medicalInsurances = response.model;
                },
                error => {
                    this.toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Error al cargar el combo de O.S.');
                });
    }

    medicalInsuranceChange(medicalInsuranceId?: number) {
        this.selection.medicalInsurance = medicalInsuranceId ? medicalInsuranceId : this.form.value.medicalInsuranceId;
        this.hcEvolutionService.medicalInsuranceId = medicalInsuranceId ? medicalInsuranceId : this.form.value.medicalInsuranceId;
        this.getProfessionals();
    }

    private getPractices() {
        this.loadingPracticeIAC = true;
        this.commonService.getInosPracticesByProfessionalOsAndPracticeType(this.selection.professional, this.selection.medicalInsurance, this.practiceType)
            .finally(() => this.loadingPracticeIAC = false)
            .subscribe(
                response => {
                    this.practices = response.model;
                    if (this.internment.practiceId)
                        this.form.patchValue({ practiceId: this.internment.practiceId });
                },
                error => {
                    this.toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Error al cargar el combo de Prácticas');
                });
    }

    saveInternment() {
        this.isSaving = true;
        const internment = Object.assign({}, this.internment, this.form.value);
        internment.diagnostics = this.diagnosticMovementService.diagnosticMovements;
        internment.treatingProfessionals = this.treatingProfessionalService.treatingProfessionalList;
        //
        internment.admissionDate = this.utilityService.formatDate(internment.admissionDate, 'DD/MM/YYYY');
        internment.time = internment.time.substr(0, 5);

        //

        if (this.isNew) {
            /*if (internment.diagnostics.length == 0) {
                 this.toastyService.showErrorMessagge("Debe ingresar al menos un diagnóstico");
                this.isSaving = false;
            } else { */
            this.internmentService.add(internment).subscribe(
                response => {
                    this.internmentService.idToPrint = response.model.id;
                    this.toastyService.showSuccessMessagge("Registración exitosa de Internación");
                    this.utilityService.navigate('camas/internaciones');
                },
                error => {
                    this.isSaving = false;
                    this.toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrió un error al registrar la internacion');
                });

        } else {
            internment.evolutions = this.hcEvolutionService.hcEvolutionList;
            this.internmentService.update(internment).subscribe(
                () => {
                    this.toastyService.showSuccessMessagge("Se guardaron los cambios");
                    this.utilityService.navigate('camas/internaciones');
                },
                error => {
                    this.isSaving = false;
                    this.toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrió un error al editar');
                });
        }
    }

    onDischarge() {
        // this.showHighHospitalizationForm = true;
        this.openModalHighHospitalizationSubject.next();
        // this.myModal.nativeElement.className = 'modal fade show';
        // $('.modal').modal();

        // const internment = Object.assign({}, this.internment, this.form.value);
        // this.internmentService.discharge(internment).subscribe(
        //     () => {
        //         this.toastyService.showSuccessMessagge("Alta de Internación");
        //         this.utilityService.navigate('camas/internaciones');
        //     },
        //     error => {
        //         this.toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrió un error al dar el alta');
        //     });
    }

    onCancelDischarge() {
        const internment = Object.assign({}, this.internment, this.form.value);
        this.internmentService.cancelDischarge(internment).subscribe(
            () => {
                this.toastyService.showSuccessMessagge("Se cancelo el Alta de Internación");
                this.utilityService.navigate('camas/internaciones');
            },
            error => {
                this.toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrió un error al dar el alta');
            });
    }

    updateReloadingData(event: any) {
        this.reloadingData = event.value;
    }

    onCancelButton(): void {
        this.openModalDiscardSubject.next();
    }

    discardChanges() {
        this.utilityService.navigate('camas/internaciones');
    }

    hideDiagnosticForm() {
        this.showDiagnosticForm = false;
        this.reloadingData = true;
    }

    hideEvolutionForm() {
        this.showEvolutionForm = false;
        this.reloadingDataEvolution = true;
    }

    hideTreatingProfessionalForm() {
        this.showTreatingProfessionalForm = false;
        this.reloadingDataEvolution = true;
    }

    enablePatientDischarge() {
        if (this.internment.departureDate) {
            let departureDate = moment(this.internment.departureDate).format("YYYY-MM-DD");
            let currentDate = moment(new Date()).format("YYYY-MM-DD");
            this.isValidCancelDischargeDate = moment(currentDate).isSame(departureDate);
            this.isPatientDischarge = true;
        }
    }

    deleteEvolutionConfirm() {
        const result = this.hcEvolutionService.delete(this.hcEvolutionId);
        let message: string;
        if (result) {
            message = 'Se elimino la evolucion correctamente';
            this.hcEvolutionId = 0;
            this.reloadingData = true;
        } else message = 'No se pudo eliminar la evolucion';
        this.toastyService.showSuccessMessagge(message);
    }

    deleteTreatingProfessionalConfirm() {
        const result = this.treatingProfessionalService.delete(this.treatingProfessionalId);
        let message: string;
        if (result) {
            message = 'Se elimino el professional tratante correctamente';
            this.treatingProfessionalId = 0;
            this.reloadingDataProfessional = true;
        } else message = 'No se pudo eliminar el professional';
        this.toastyService.showSuccessMessagge(message);
    }

    updateReloadingDataEvolution(event: any) {
        this.reloadingDataEvolution = event.value;
    }

    updateReloadingDataProfessional(event: any) {
        this.reloadingDataProfessional = event.value;
    }

    changeActiveTab(tab: string) {
        this.activeTab = tab;
    }

    /********************************* Diagnostic ***********************************/
    onActionDiagnostic(event: any) {
        switch (event.action) {
            case 'new':
                this.diagnosticMovementService.isNew = true;
                this.showDiagnosticForm = true;
                break;
            case 'edit':
                this.diagnosticMovementService.isNew = false;
                this.diagnosticMovementService.diagnosticMovement = event.item;
                this.showDiagnosticForm = true;
                break;
            case 'detail':
                break;
            default:
                break;
        }
    }

    closeDiagnosticForm() {
        this.showDiagnosticForm = false;
    }

    onReturnButtonOfInternment() {
        this.utilityService.navigate('camas/internaciones');
    }

    onActionTreatingProfessionaClick(event: any) {
        switch (event.action) {
            case 'new':
                this.treatingProfessionalId = 0;
                this.treatingProfessionalService.isNew = true;
                this.showTreatingProfessionalForm = true;
                this.treatingProfessionalService.medicalInsuranceId = this.internment.medicalInsuranceId;
                break;
            case 'edit':
                this.treatingProfessionalId = parseInt(`${event.item.professionalId}`);
                this.treatingProfessionalService.treatingProfessional = event.item;
                this.treatingProfessionalService.isNew = false;
                this.showTreatingProfessionalForm = true;
                this.isLoading = false;
                this.treatingProfessionalService.medicalInsuranceId = this.internment.medicalInsuranceId;
                break;

            case 'delete':
                this.treatingProfessionalId = event.item.professionalId;
                this.modalDeleteProfessionalSubject.next();
                break;
            default:
                break;
        }
    }

    closeHighHospitalizationForm() {
        //this.openModalHighHospitalizationSubject.unsubscribe();
        // this.showHighHospitalizationForm = false;
    }

    /////////
    private getDatePickerOptions(property: any) {
        return {
            format: 'dd/mm/yyyy',
            monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            weekdaysLetter: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            today: 'Hoy',
            clear: 'Borrar',
            close: 'Cerrar',
            selectYears: 100,
            selectMonths: true,
            max: false,
            labelMonthNext: 'Próximo mes',
            labelMonthPrev: 'Mes anterior',
            labelMonthSelect: 'Selecciona un mes',
            labelYearSelect: 'Selecciona un año',
            closeOnSelect: true,
            formatSubmit: 'yyyy/mm/dd',
            // hiddenPrefix: 'lowDate',
            hiddenName: true,
            onSet: (value: any) => {
                var eventDate: any = {
                    srcElement: {
                        value: ''
                    },
                };


            }
        }
    }
    private getTimePickerOptions(property: any) {
        return {
            donetext: 'Aceptar',
            canceltext: 'Cancelar',
            cleartext: 'Borrar',
            twelvehour: false,
            timeFormat: 'HH:mm',
            onSet: (value: any) => {
                var eventDate: any = {
                    srcElement: {
                        value: ''
                    },
                };


            }
        }
    }
    


}

class Selection {
    specialty: number;
    professional: number;
    patient: number;
    medicalInsurance: number;
}