import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RequestService } from "../../+core/services/request.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { Subject } from 'rxjs';
import { IService } from "../../interface/service.interface";
import { ElementFilter } from "../../+shared/dynamic-table/element-filter.model";
import { TypeFilter } from "../../+shared/constant";
import { setDOM } from "@angular/platform-browser/src/dom/dom_adapter";
import { ProfessionalContractAbsence } from "../../models/professional-contract-absence.model";
import { ContractProfessionalAbsenceService } from "./../contract-professional-absence.service";
import { UtilityService } from './../../+core/services/utility.service';
import * as moment from 'moment';


@Component({
    selector: 'contract-professional-absence-list',
    templateUrl: 'contract-professional-absence-list.component.html',
    styleUrls: ['contract-professional-absence-list.component.scss']
})

export class ContractProfessionalAbsenceListComponent implements OnInit {
    elements: Array<ElementFilter>;
    openModalSubject: Subject<any> = new Subject();
    contractProfessionalId: 0;
    reloadingData: boolean = false;
    professional: any;
    isNew: boolean = false;
    professionalContractAbsence: ProfessionalContractAbsence = new ProfessionalContractAbsence();
    deleteModalAbsenceSubject: Subject<any> = new Subject();
    public contractNumber: number = 0;
    public professionalAccount: number = 0;
    registeredAbsences: Array<any>;
    professionalAbsences: Array<ProfessionalContractAbsence>;
    professionalContractAbsenceIndex: number;
    contractProfessionalAbsenceId: number;
    @Output() actionClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public contractProfessionalAbsenceService: ContractProfessionalAbsenceService,
        private _route: ActivatedRoute,
        private _toastyService: ToastyMessageService,
        private utilityService: UtilityService,
    ) {
        this.contractNumber = +(this._route.snapshot.paramMap.get('id') || 0);
        this.professionalAccount = +(this._route.snapshot.paramMap.get('profesionalId') || 0);
    }

    ngOnInit() {
        this.contractProfessionalAbsenceService.contractProfessionalAbsenceId = this._route.snapshot.paramMap.get('id');
        this.loadList();
    }

    onActionClick(action: string, item?: any) {
        this.actionClick.emit({ action: action, item: item })
    }

    onAgree() {
        this.contractProfessionalAbsenceService.delete(this.contractProfessionalAbsenceId).subscribe(
            result => {
                this.contractProfessionalAbsenceId = 0;
                this.reloadingData = true;
                this._toastyService.showSuccessMessagge("Se elimino correctamente");
            },
            error => {
                this._toastyService.showErrorMessagge("Ocurrio un error inesperado");
            });
    }

    updateReloadingData(event: any) {
        this.reloadingData = event.value;
        this.loadList();
    }

    deleteClick(absence: any) {
        this.deleteModalAbsenceSubject.next();
        this.professionalContractAbsence = absence;
    }

    onDeleteAbsenceConfirm(event: any) {
        const itemSelected = this.professionalContractAbsence;

        // if (itemSelected) {
        //     this.contractProfessionalAbsenceService.newAbsences.push(itemSelected);
        //     this.loadList();
        // }

        if (itemSelected) {
            this.contractProfessionalAbsenceService.contractAbsences.forEach((absence: any, index: number) => {
                if (absence.dateFrom === itemSelected.dateFrom && absence.dateTo === itemSelected.dateTo) {
                    this.contractProfessionalAbsenceService.contractAbsences.splice(index, 1);
                }
            });
        }

    }

    loadList() {
        this.contractProfessionalAbsenceService.getAll(`contractNumber=${this.contractNumber}`)
            .subscribe(
                result => {
                    if (this.contractProfessionalAbsenceService.contractAbsences.length == 0) {
                        var professionalAbsences = result.model;
                        var now = moment().startOf('day');
                        professionalAbsences.forEach((absence: ProfessionalContractAbsence) => {
                            absence.canEdit = moment(absence.dateFrom).isSameOrAfter(now);
                            absence.dateFrom = this.utilityService.formatDate(absence.dateFrom, "", "DD/MM/YYYY");
                            absence.dateTo = this.utilityService.formatDate(absence.dateTo, "", "DD/MM/YYYY");
                            absence.editionDate = this.utilityService.formatDate(absence.editionDate, "", "DD/MM/YYYY");
                        });
                        this.professionalAbsences = this.contractProfessionalAbsenceService.contractAbsences = professionalAbsences;
                    } else {
                        this.professionalAbsences = this.contractProfessionalAbsenceService.contractAbsences;
                    }
                    
                    // this.contractProfessionalAbsenceService.contractAbsences.forEach((s: any) => {
                    //     this.professionalAbsences.push(s)
                    // });

                    // var idx = -1;
                    // this.registeredAbsences.forEach(function (e: any) {
                    //     idx = idx + 1;
                    //     e.index = idx;
                    // });

                    // this.registeredAbsences.forEach((absence: any) => {
                    //     var dateFrom = moment(absence.dateFrom.split(' ')[0], 'DD/MM/YYYY ').toDate();
                    //     absence.dateFrom = moment(dateFrom).format('DD/MM/YYYY');

                    //     var dateTo = moment(absence.dateTo.split(' ')[0], 'DD/MM/YYYY').toDate();
                    //     absence.dateTo = moment(dateTo).format('DD/MM/YYYY');
                    // });

                    // this.registeredAbsences.forEach(absence => {
                    //     this.contractProfessionalAbsenceService.modifiedAbsences.forEach((modifiedAbsence: any) => {
                    //         if (absence.index == modifiedAbsence.index) {
                    //             absence.dateFrom = modifiedAbsence.dateFrom;
                    //             absence.dateTo = modifiedAbsence.dateTo;
                    //         }
                    //     });
                    // });

                    // this.contractProfessionalAbsenceService.deletedAbsences.forEach(deletedAbsence => {
                    //     this.registeredAbsences.forEach((absence: any, index: number) => {
                    //         if (absence.dateFrom === deletedAbsence.dateFrom && absence.dateTo === deletedAbsence.dateTo) {
                    //             this.registeredAbsences.splice(index, 1);
                    //         }
                    //     });
                    // });



                    // this.contractProfessionalAbsenceService.deletedAbsences.forEach((deletedAbsence: any) => {
                    //     this.registeredAbsences.splice(deletedAbsence.index, 1)
                    // });

                    // this.professionalAbsences = this.registeredAbsences;

                    // this.contractProfessionalAbsenceService.contractAbsences = this.registeredAbsences;

                },
                error => {
                    this._toastyService.showErrorMessagge("Ocurrio un error al obtener los datos");
                });
    }
}