import { ContractProfessionalAbsenceService } from './../contract-professional-absence.service';
import { ProfessionalContractAbsence } from './../../models/professional-contract-absence.model';
import { Component, OnInit, Output, EventEmitter, Renderer2 } from '@angular/core';
import { UtilityService } from '../../+core/services/utility.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../+core/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { ItemCombo } from '../../+shared/util';
declare var $: any;

@Component({
    selector: 'contract-professional-absence-form',
    templateUrl: './contract-professional-absence-form.component.html',
    styleUrls: ['./contract-professional-absence-form.component.scss']
})

export class ContractProfessionalAbsenceFormComponent implements OnInit {
    public form: FormGroup;
    public isLoadingAbsence: boolean = false;
    public professionalContractAbsence: ProfessionalContractAbsence = new ProfessionalContractAbsence();
    professionalAbsences: Array<ProfessionalContractAbsence>;
    public absences: Array<any>;
    public openModalSubject: Subject<any> = new Subject();
    public openModalWarning: Subject<any> = new Subject();
    isNew: boolean = true;
    itemValue: number = 0;
    public datePickerOptionsFrom: any;
    public datePickerOptionsTo: any;
    public contractNumber: number = 0;
    public professionalAccount: number = 0;
    index: number = 0;
    public functionMotives = this.commonService.getGenericCombo('MOTIVOS');


    @Output() actionClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private utilityService: UtilityService,
        private commonService: CommonService,
        private toastyService: ToastyMessageService,
        public contractProfessionalAbsenceService: ContractProfessionalAbsenceService,
        private renderer: Renderer2
    ) {
        this.contractNumber = +(this.activatedRoute.snapshot.paramMap.get('id') || 0);
        this.professionalAccount = +(this.activatedRoute.snapshot.paramMap.get('profesionalId') || 0);
    }

    createForm() {
        this.form = this.fb.group({
            dateFrom: [this.professionalContractAbsence.dateFrom, Validators.required],
            dateTo: [this.professionalContractAbsence.dateTo, Validators.required],
            motive: [this.professionalContractAbsence.motive, Validators.required],
            observation: [this.professionalContractAbsence.observation]
        });
    }

    getAbsence() {
        this.professionalContractAbsence = this.contractProfessionalAbsenceService.professionalContractAbsence;
        this.createForm();
    }

    ngOnInit() {
        this.datePickerOptionsFrom = this.utilityService.getDatePickerOptions();
        this.datePickerOptionsFrom.min = new Date();
        this.datePickerOptionsFrom.max = false;
        this.datePickerOptionsFrom.formatSubmit = 'dd/mm/yyyy';

        this.datePickerOptionsTo = this.utilityService.getDatePickerOptions();
        this.datePickerOptionsTo.min = new Date();
        this.datePickerOptionsTo.max = false;
        this.datePickerOptionsTo.formatSubmit = 'dd/mm/yyyy';

        this.isNew = true;
        this.loadForm();
    }

    loadForm() {
        if (this.contractProfessionalAbsenceService.isNewAbsence) {
            this.createForm();
        } else {
            this.getAbsence();
        }
    }

    onAgree() {
        this.actionClick.emit({ action: 'cancelar' })
    }

    onAgreeWarningAbsence() {
        const professionalContractAbsence: ProfessionalContractAbsence = Object.assign({}, this.professionalContractAbsence, this.form.value);
        professionalContractAbsence.editionDate = moment().format('DD/MM/YYYY');
        if (this.contractProfessionalAbsenceService.isNewAbsence) {
            professionalContractAbsence.contractNumber = 0;
            this.contractProfessionalAbsenceService.add(professionalContractAbsence).subscribe(response => {
                this.toastyService.showSuccessMessagge("Ausencia a guardar creado correctamente");
                this.isNew = false;
                this.actionClick.emit({ action: 'nuevo' })
            },
                error => {
                    this.toastyService.showErrorMessagge("Ocurrio un error al dar el alta");
                })
        } else {
            this.contractProfessionalAbsenceService.update(professionalContractAbsence);
            this.toastyService.showSuccessMessagge("Se guardaron los cambios");
            this.isNew = false;
            this.actionClick.emit({ action: 'edicion' })
        }
    }

    onCancelButton(): void {
        this.openModalSubject.next();
        this.contractProfessionalAbsenceService.itemIndexToEdit = -1;
    }

    onSubmitAbsence() {
        var isValidate = true;
        var dateFrom = this.utilityService.formatDate(this.form.value.dateFrom, "DD/MM/YYYY");
        var dateTo = this.utilityService.formatDate(this.form.value.dateTo, "DD/MM/YYYY");
        if (dateTo < dateFrom) {
            this.toastyService.showErrorMessagge("La fecha hasta es menor que la fecha desde");
            return
        }
        this.contractProfessionalAbsenceService.contractAbsences.forEach((absence: any, index: number) => {
            if (this.contractProfessionalAbsenceService.itemIndexToEdit != index) {
                if (absence.dateFrom <= this.form.value.dateFrom && this.form.value.dateFrom <= absence.dateTo) {
                    isValidate = false;
                }
                if (absence.dateFrom <= this.form.value.dateTo && this.form.value.dateTo <= absence.dateTo) {
                    isValidate = false;
                }
            }
        });

        if (isValidate) {

            this.contractProfessionalAbsenceService.getAllShitf(this.professionalAccount, dateFrom, dateTo).subscribe(
                resp => {
                    const shift = resp.model;
                    if (shift.length) {
                        this.openModalWarning.next();
                    } else {
                        this.onAgreeWarningAbsence();
                    }
                }
            );
        } else {
            this.toastyService.showMessageToast("Rango existente", "El rango de fechas ingresadas esta dentro de un rango de fechas que ya esta cargado", "warning", 10000);
        }
    }

    // onSubmitAbsence($event: any) {
    //     var isValidate = true;
    //     var dateFrom = moment(this.form.value.dateFrom, "DD/MM/YYYY").toDate();
    //     var dateTo = moment(this.form.value.dateTo, "DD/MM/YYYY").toDate();

    //     if (dateTo < dateFrom) {
    //         this.toastyService.showErrorMessagge("La fecha hasta es menor que la fecha desde");
    //         isValidate = false;
    //     }


    //     this.contractProfessionalAbsenceService.getAll(`contractNumber=${this.contractNumber}`)
    //         .subscribe(
    //         result => {
    //             this.absences = result.model;
    //             this.contractProfessionalAbsenceService.newAbsences.forEach((absense: any) => {
    //                 this.absences.push(absense)
    //             });

    //             var idx = -1;
    //             this.absences.forEach(function (absense: any) {
    //                 idx = idx + 1;
    //                 absense.index = idx;
    //             });

    //             this.absences.forEach(absence => {
    //                 this.contractProfessionalAbsenceService.modifiedAbsences.forEach((modifiedAbsence: any) => {
    //                     if (absence.index == modifiedAbsence.index) {
    //                         absence.dateFrom = modifiedAbsence.dateFrom;
    //                         absence.dateTo = modifiedAbsence.dateTo;
    //                     }
    //                 });
    //             });

    //             this.contractProfessionalAbsenceService.deletedAbsences.forEach((deletedAbsence: any) => {
    //                 this.absences.splice(deletedAbsence.index, 1)
    //             });

    //             this.professionalAbsences = this.absences;

    //             var dateFromNow = moment(this.form.value.dateFrom, "DD/MM/YYYY").toDate();
    //             var dateToNow = moment(this.form.value.dateTo, "DD/MM/YYYY").toDate();

    //             this.professionalAbsences.forEach(function (absence: any) {
    //                 var dateFromBase = moment(absence.dateFrom, "DD/MM/YYYY").toDate();
    //                 var dateToBase = moment(absence.dateTo, "DD/MM/YYYY").toDate();

    //                 if (dateFromBase <= dateFromNow && dateFromNow <= dateToBase) {
    //                     isValidate = false;
    //                 }

    //                 if (dateFromBase <= dateToNow && dateToNow <= dateToBase) {
    //                     isValidate = false;
    //                 }
    //             });

    //             if (isValidate) {
    //                 const professionalContractAbsence: ProfessionalContractAbsence = Object.assign({}, this.professionalContractAbsence, this.form.value);

    //                 if (this.contractProfessionalAbsenceService.isNewAbsence) {
    //                     professionalContractAbsence.contractNumber = 0;
    //                     this.contractProfessionalAbsenceService.add(professionalContractAbsence).subscribe(response => {
    //                         this.toastyService.showSuccessMessagge("Alta exitosa de la ausencia");
    //                         this.isNew = false;
    //                         this.actionClick.emit({ action: 'nuevo' })
    //                     },
    //                         error => {
    //                             this.toastyService.showErrorMessagge("Ocurrio un error al dar el alta");
    //                         })
    //                 } else {
    //                     this.contractProfessionalAbsenceService.update(professionalContractAbsence);
    //                     this.toastyService.showSuccessMessagge("Se guardaron los cambios");
    //                     this.isNew = false;
    //                     this.actionClick.emit({ action: 'edicion' })
    //                 }
    //             } else {
    //                 this.toastyService.showMessageToast("Rango existente", "El rango de fechas ingresadas esta dentro de un rango de fechas que ya esta cargado", "warning", 10000);
    //             }
    //         },
    //         error => {
    //             this.toastyService.showErrorMessagge("Ocurrio un error al obtener los datos");
    //         });
    // }

    onChangeIAC(event: ItemCombo) {
        this.professionalContractAbsence.motiveName = event.name;
    }

    changeDateFrom() {
        var dateFrom = moment(this.form.value.dateFrom, "DD/MM/YYYY").toDate();
        const dateTo: HTMLInputElement = this.renderer.selectRootElement('#dateTo');
        $(dateTo).pickadate('picker').set('min', dateFrom);
    }
}