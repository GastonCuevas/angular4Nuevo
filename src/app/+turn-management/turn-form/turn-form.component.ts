import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { CommonService, UtilityService, ToastyMessageService } from '../../+core/services';
import { TurnManagementService } from '../turn-management.service';

import { Turn, SelectedFilter, Patient, PatientMedicalInsurance } from '../util';
import { InputSearchComponent, IntelligentReportComponent } from '../../+shared';
import { ItemCombo } from '../../+shared/util';

import * as moment from 'moment';
import { MovementPatient } from '../../models';
import { PatientMovement } from '../../models/patient-movement.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractOsService } from '../../+contract-os/contract-os.service';
import { CONTENT_ATTR } from '@angular/platform-browser/src/dom/dom_renderer';
import { window } from 'rxjs/operators';
import { MaterializeAction } from 'angular2-materialize';
import { IColumn } from '../../+shared/util';

@Component({
    selector: 'turn-form',
    templateUrl: './turn-form.component.html',
    styleUrls: ['./turn-form.component.scss'],
})

export class TurnFormComponent implements OnInit {

    isLoading = false;
    isNew = true;
    isSaving = false;
    // assistedTurn = false;
    form: FormGroup;
    turn: Turn;
    formattedDate = '';

    selectedPatient: number;
    patientTurns: Array<any>;
    medicalInsurances: Array<any>;
    loadingMInsuranceIAC: boolean;
    selectedMedicalInsurance: number;
    practices: Array<any>;
    loadingPracticeIAC: boolean;
    turnStates = new Array<any>();
    showPatientForm = false;

    statusPatientForm = true;
    listMIsByProfessional = new Array<ItemCombo>();
    listPMI = new Array<PatientMedicalInsurance>();
    listPMIValid = true;
    url = '';
    private idTurn: number;

    openModalDiscardSubject = new Subject();
    modalActions: EventEmitter<string | MaterializeAction> = new EventEmitter<string | MaterializeAction>();

    private filtro: SelectedFilter;

    @Output() clickReturn = new EventEmitter<any>();

    @ViewChild('patientIS') patientIS: InputSearchComponent;

    constructor(
        private fb: FormBuilder,
        private commonService: CommonService,
        private utilityService: UtilityService,
        private toastyMessageService: ToastyMessageService,
        public turnManagementService: TurnManagementService,
        private _router: Router,
        public contractService: ContractOsService,
    ) {
        console.log("turnManagementService:", this.turnManagementService);
    }

    ngOnInit() {
        this.filtro = this.turnManagementService.sf;
        this.idTurn = this.filtro.idTurn;
        this.loadCombos();
        this.loadForm();
    }

    private loadCombos() {
       this.loadTurnStates();
       this.loadMInsurancesByProfessional();
    }

    private loadTurnStates() {
        this.commonService.getTurnStates().subscribe(
            response => {
                this.turnStates = response.model;
            },
            error => {
                this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : 'Error al cargar el combo de Estados');
            });
    }

    private loadMInsurancesByProfessional() {
        this.commonService.getMIByProfessional(this.filtro.professional).subscribe(
            response => {
                this.listMIsByProfessional = response.model;
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Error al cargar las O.S. del profesional');
            });
    }

    private loadForm() {
        if (this.idTurn) {
            this.isNew = false;
            this.getTurn(this.idTurn);
        } else {
            this.practices = new Array<any>();
            this.medicalInsurances = new Array<any>();
            this.initializeTurn();
            this.createForm();
        }
    }

    private initializeTurn() {
        this.turn = new Turn();
        this.turn.date = this.filtro.date.format();
        this.formattedDate = this.filtro.date.format("DD/MM/YYYY");
        this.turn.time = this.filtro.time;
        this.turn.specialtyNumber = this.filtro.specialty;
        this.turn.specialtyName = this.filtro.specialtyName;
        this.turn.professionalNumber = this.filtro.professional;
        this.turn.professionalName = this.filtro.professionalName;
        if(this.filtro.medicalOffice) {
            this.turn.medicalOffice = this.filtro.medicalOffice;
        } else {
            this.turn.medicalOffice = "Sin definir";
        }
        const date  = moment().format("YYYY-MM-DD");
        this.turn.turnStateNumber =  moment(this.turn.date).isBefore(date) ? 4 : 1;
        this.turn.uponTurn = Number(this.turnManagementService.sf.uponTurn || false);
    }

    private createForm() {
        this.form = this.fb.group({
            date: [this.turn.date, Validators.required],
            time: [this.turn.time, Validators.required],
            specialtyNumber: [this.turn.specialtyNumber, null],
            professionalNumber: [this.turn.professionalNumber, Validators.required],
            patientNumber: [this.turn.patientNumber, Validators.required],
            medicalInsuranceNumber: [this.turn.medicalInsuranceNumber, Validators.required],
            practiceNumber: [this.turn.practiceNumber, Validators.required],
            turnStateNumber: [{ value: this.turn.turnStateNumber, disabled: moment(this.filtro.date).isBefore(moment()) }, null],
            //turnStateNumber: [this.turn.turnStateNumber, null],
            uponTurn: [this.turn.uponTurn, null],
            observation: [this.turn.observation, null],
            coinsurancePaymented: [this.turn.coinsurancePaymented, 0],
            //coinsuranceFac: [this.turn.coinsuranceFac, null],
            authorizationCode: [this.turn.authorizationCode,null],
        });
        this.url = `gestionProfesionales/contratos/${this.turn.professionalNumber}/formulario/${this.turnManagementService.professionalContractId}`;
        let turnStateControl = this.form.get('turnStateNumber');
        let uponTurnControl = this.form.get('uponTurn');
        let medicalInsuranceControl = this.form.get('medicalInsuranceNumber');
        let practiceControl = this.form.get('practiceNumber');
        let observationControl = this.form.get('observation');
        if (uponTurnControl) uponTurnControl.disable();
        if (turnStateControl) {
            if (this.isNew) {
                // turnStateControl.disable();
            } else {
                // turnStateControl.enable();
                if(turnStateControl.value != 1) {
                    // this.assistedTurn = true;
                    if(medicalInsuranceControl) medicalInsuranceControl.disable();
                    if(observationControl) observationControl.disable();
                }
            }
        }
    }

    onChangePatient() {
        this.selectedPatient = this.form.value.patientNumber;
        // this.resetMedicalInsuranceCombo();
        this.practices = [];
        this.getMedicalInsurances();
    }

    private getMedicalInsurances() {
        this.loadingMInsuranceIAC = true;
        this.commonService.getMIByProfessionalAndPatient(this.form.value.professionalNumber, this.form.value.patientNumber)
            .finally(() => this.loadingMInsuranceIAC = false)
            .subscribe(
            response => {
                this.medicalInsurances = response.model;
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de O.S.');
            });
    }

    private resetMedicalInsuranceCombo() {
        this.form.patchValue({ medicalInsuranceNumber: null });
        this.selectedMedicalInsurance = 0;
        this.medicalInsurances = [];
    }

    onChangeMedicalInsurance() {
        this.selectedMedicalInsurance = this.form.value.medicalInsuranceNumber;
        this.getPractices();
    }

    private getPractices() {
        const practiceType = 1;
        this.loadingPracticeIAC = true;
        this.commonService.getInosPracticesByProfessionalOsAndPracticeType(
            this.form.value.professionalNumber, this.form.value.medicalInsuranceNumber, practiceType)
            .finally(() => this.loadingPracticeIAC = false)
            .subscribe(
            response => {
                this.practices = response.model;
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de Prácticas');
            });
    }

    saveTurn() {
        this.isSaving = true;
        this.turn.medicalInsurances = this.turnManagementService.getAllPMI();
        const turn = Object.assign({}, this.turn, this.form.value);
        turn.time += ':00';
        if(!this.idTurn) {
            this.turnManagementService.add(turn).subscribe(response => {
                this.toastyMessageService.showSuccessMessagge("Alta exitosa de turno");
                this.turnManagementService.sf.uponTurn = false;
                this.turnManagementService.idToPrint = response.model.numInt;
                this.clickReturn.emit();
            },
                error => {
                    this.isSaving = false;
                    this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrió un error al dar el alta');
            })
        } else {
            this.turnManagementService.update(this.idTurn, turn).subscribe(response => {
                this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
                this.turnManagementService.sf.idTurn = null;
                this.turnManagementService.sf.uponTurn = false;
                this.turnManagementService.idToPrint = response.model.numInt;
                this.clickReturn.emit();
            },
                error => {
                    this.isSaving = false;
                    this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrió un error al editar');
            })
        }
    }

    getTurn(id: number) {
        this.isLoading = true;
        this.turnManagementService.getTurn(id)
            .finally(() => this.isLoading = false)
            .subscribe(
            result => {
                this.turn = result.model;
                var date = moment(result.model.date, 'YYYY/MM/DD').toDate();
                this.formattedDate = moment(date).format('DD/MM/YYYY');
                this.turn.time = this.turn.time.toString().substring(0,5);
                this.turn.medicalOffice = this.filtro.medicalOffice || 'Sin definir';
                this.selectedPatient = this.turn.patientNumber;
                this.selectedMedicalInsurance = this.turn.medicalInsuranceNumber;
                this.createForm();
                this.getMedicalInsurances();
                this.getPractices();
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al obtener los datos del turno');
            });
    }

    onCancelButton(): void {
        this.openModalDiscardSubject.next();
    }

    discardChanges() {
        this.turnManagementService.sf.idTurn = null;
        this.turnManagementService.sf.uponTurn = false;
        this.clickReturn.emit();
    }

    cancelPatient(){
        this.turnManagementService.resetListPMIs();
        this.patientIS.clearInput();
        this.selectedPatient = 0;
        this.resetMedicalInsuranceCombo();
        this.practices = [];
        this.showPatientForm = false;
        this.statusPatientForm = true;
        this.listPMIValid = true;
    }

    openPatientForm() {
        this.form.patchValue({medicalInsuranceNumber: null, practiceNumber: null});
        this.practices = [];
        this.statusPatientForm = false;
        this.listPMIValid = false;
        this.showPatientForm = true;
    }

    validatePatientForm(patientForm: FormGroup) {
        this.statusPatientForm = patientForm.valid;
        if (patientForm.valid) {
            this.turn.patientName = patientForm.value.patientName;
            this.turn.patientNumber = 0;
            this.turn.patientIdentifierType = patientForm.value.patientIdentifierType;
            this.turn.patientIdentifier = patientForm.value.patientIdentifier;
            this.turn.zone = patientForm.value.zone;
            this.turn.locality = patientForm.value.locality;
            this.form.patchValue({patientNumber: 0});
        } else {
            this.turn.patientName = '';
            this.turn.patientNumber = 0;
            this.turn.patientIdentifierType = 0;
            this.turn.patientIdentifier = '';
            this.turn.zone = 0;
            this.turn.locality = 0;
        }
    }

    reloadPMICombo() {
        let listAux = new Array<PatientMedicalInsurance>();
        this.listMIsByProfessional.forEach(miProfessional => {
            this.turnManagementService.getAllPMI().forEach(miPatient => {
                if (miProfessional.number == miPatient.socialNumber)
                    listAux.push(miPatient);
            });
        });
        this.listPMI = listAux.slice();
        this.listPMIValid = this.listPMI.length > 0 ? true : false;
    }

    showContract() {
        //this.contractService.
        //Window.open
        this._router.navigate([`gestionProfesionales/contratos/${this.turn.professionalNumber}/formulario/${this.turnManagementService.professionalContractId}`]);
        
    }

    openModal() {
        let startdate = moment();
        startdate = startdate.subtract(2, "months");
        if (!!this.selectedPatient) {
            this.turnManagementService.getHistoryByPatient(this.selectedPatient, moment(startdate).format('YYYY/MM/DD'))
                .subscribe(
                    response => {
                        this.patientTurns = response.model;
                    },
                    error => {
                        this.toastyMessageService.showToastyError(error, 'Error al cargar la lista de turnos del paciente.');
                    });
            this.modalActions.emit({ action: "modal", params: ['open'] });
        }
    }

    closeModal() {
        this.modalActions.emit({ action: "modal", params: ['close'] });
    }
}
