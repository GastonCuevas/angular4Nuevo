import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { ToastyMessageService, CommonService, UtilityService } from '../../+core/services';
import { TurnConsultationService } from '../turn-consultation.service';
import { ItemCombo } from '../../+shared/util';
import { Turn } from '../../+turn-management/util';

import * as moment from 'moment';
import { PatientMovement } from '../../models/patient-movement.model';

@Component({
    selector: 'app-turn-consultation-form',
    templateUrl: './turn-consultation-form.component.html',
    styleUrls: ['./turn-consultation-form.component.scss']
})
export class TurnConsultationFormComponent implements OnInit {

    turn: Turn;
    isLoading = true;
    isSaving = false;
    isDetail = false;
    form: FormGroup;
    //
    facturable: boolean;
    //
    movPac: PatientMovement;
    medicalInsurances: Array<ItemCombo>;
    practices: Array<ItemCombo>;
    loadingPracticeIAC: boolean;
    turnStates: Array<any>;
    openModalDiscardSubject = new Subject();

    private id: number;

    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private commonService: CommonService,
        private utilityService: UtilityService,
        private toastyMessageService: ToastyMessageService,
        private turnConsultationService: TurnConsultationService
    ) {
    }

    ngOnInit() {
        this.loadTurnStates();
        this.loadForm();
    }

    private loadTurnStates() {
        this.commonService.getTurnStates().subscribe(
            response => {
                this.turnStates = response.model;
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de Estados');
            });
    }

    private loadForm() {
        this.movPac = new PatientMovement();
        this.isDetail = this.turnConsultationService.isDetail;
        this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        if (this.id) this.getTurn();
    }

    private createForm() {
        this.form = this.fb.group({
            date: [this.turn.date, Validators.required],
            time: [this.turn.time, Validators.required],
            specialtyNumber: [this.turn.specialtyNumber, Validators.required],
            professionalNumber: [this.turn.professionalNumber, Validators.required],
            patientNumber: [this.turn.patientNumber, Validators.required],
            medicalInsuranceNumber: [this.turn.medicalInsuranceNumber, Validators.required],
            practiceNumber: [this.turn.practiceNumber, Validators.required],
            turnStateNumber: [this.turn.turnStateNumber, Validators.required],
            uponTurn: [this.turn.uponTurn, null],
            isFact: [this.turn.coinsuranceFac, null],
            observation: [this.turn.observation, null],
            authorizationCode: [this.turn.authorizationCode,null],
        });
        let uponTurnControl = this.form.get('uponTurn');
        if (uponTurnControl) uponTurnControl.disable();
        
    }

    private getTurn() {
        this.turnConsultationService.getTurn(this.id)
            .finally(() => this.isLoading = false)
            .subscribe(
            result => {
                this.turn = result.model;
                this.turn.date = moment(this.turn.date, 'YYYY/MM/DD').format('DD/MM/YYYY');
                this.turn.time = this.turn.time.substr(0, 5);
                if (this.turn.coinsuranceFac) {
                    this.facturable = true;
                } else
                {
                    this.facturable = false;
                }
                this.createForm();
                this.getMedicalInsurances();
                this.getPractices();
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al obtener los datos del turno');
            });
    }

    private getMedicalInsurances() {
        this.commonService.getMIByProfessionalAndPatient(this.form.value.professionalNumber, this.form.value.patientNumber)
            .subscribe(
            response => {
                this.medicalInsurances = response.model;
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de O.S.');
            });
    }

    onChangeMedicalInsurance() {
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
        const turn = Object.assign({}, this.turn, this.form.value);
        // turn.medicalInsurances = [];
        turn.date = this.utilityService.formatDateBE(<string> this.turn.date);

        this.turnConsultationService.update(this.id, turn)
            .subscribe(
            response => {
                this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
                this.utilityService.navigate('archivos/turnos-consulta');
            }, error => {
                this.isSaving = false;
                this.toastyMessageService.showToastyError(error, 'Ocurrió un error al editar');
            })
    }

    onCancelButton() {
        if (!this.isDetail) this.openModalDiscardSubject.next();
        else this.onDiscard();
    }

    onDiscard() {
        this.utilityService.navigate('archivos/turnos-consulta');
    }

}
