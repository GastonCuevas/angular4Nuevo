import { Schedule } from './../../models/schedule.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { Subject } from 'rxjs';
import { ElementFilter } from "../../+shared/dynamic-table/element-filter.model";
import { ProfessionalContractSchedule } from "../../models/professional-contract-schedule.model";
import { ContractProfessionalScheduleService } from "./../contract-professional.schedule.service";


@Component({
    selector: 'contract-professional-schedule-list',
    templateUrl: 'contract-professional-schedule-list.component.html',
    styleUrls: ['contract-professional-schedule-list.component.scss']
})

export class ContractProfessionalScheduleListComponent implements OnInit {
    elements: Array<ElementFilter>;
    openModalSubject: Subject<any> = new Subject();
    contractProfessionalSchedules: Array<ProfessionalContractSchedule>;
    contractProfessionalScheduleId: number;
    contractProfessionalId: 0;
    reloadingData: boolean = false;
    professional: any;
    isNew: boolean = false;
    professionalContractSchedule: ProfessionalContractSchedule = new ProfessionalContractSchedule();
    titleSchedule: string = "";
    deleteModalScheduleSubject: Subject<any> = new Subject();

    registeredSchedules: Array<any> = new Array<any>();
    professionalSchedules: Array<Schedule>;
    professionalContractScheduleIndex: number;

    @Input() sourceData: Array<any> = new Array<any>();
    @Output() actionClick: EventEmitter<any> = new EventEmitter<any>();
    @Input() isClone: boolean = false;

    constructor(
        public contractProfessionalScheduleService: ContractProfessionalScheduleService,
        private _route: ActivatedRoute,
        private _toastyService: ToastyMessageService,

    ) {
    }

    ngOnInit() {
        this.contractProfessionalScheduleService.contractProfessionalScheduleId = this._route.snapshot.paramMap.get('id');
        this.isClone = this.contractProfessionalScheduleService.isCloned;
        this.loadList();
    }

    // Actions Events
    onActionClick(action: string, item?: any) {
        this.actionClick.emit({ action: action, item: item })
    }

    onAgree() {
        this.contractProfessionalScheduleService.delete(this.contractProfessionalScheduleId).subscribe(
            result => {
                this.contractProfessionalScheduleId = 0;
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

    deleteClick(schedule: any) {
        this.deleteModalScheduleSubject.next();
        this.professionalContractSchedule = schedule;
    }

    onDeleteScheduleConfirm(event: any) {
        const itemSelected = this.professionalContractSchedule;
        if (itemSelected) {
            const index = this.contractProfessionalScheduleService.schedules.indexOf(itemSelected);
            this.contractProfessionalScheduleService.schedules.splice(index, 1);
            //this.contractProfessionalScheduleService.schedules.forEach((absence: any, index: number) => {
            //    if (absence === itemSelected) {
            //        this.contractProfessionalScheduleService.schedules.splice(index, 1);
            //    }
            //});
            this.loadList();
            }
    }

    getWeekConfig() {
        return [
            { weekdayName: 'Domingo', schedules: Array<any>() },
            { weekdayName: 'Lunes', schedules: Array<any>() },
            { weekdayName: 'Martes', schedules: Array<any>() },
            { weekdayName: 'Miercoles', schedules: Array<any>() },
            { weekdayName: 'Jueves', schedules: Array<any>() },
            { weekdayName: 'Viernes', schedules: Array<any>() },
            { weekdayName: 'Sabado', schedules: Array<any>() }
        ];
    }

    loadList() {
        this.professionalSchedules = this.getWeekConfig();
        this.contractProfessionalScheduleService.onEditOrAdd = true;
        this.professionalSchedules.forEach(schedule => {
            var existentGroup = this.contractProfessionalScheduleService.schedules.filter((item) => item.weekdayName === schedule.weekdayName);
            existentGroup.forEach(element => {
                schedule.schedules.push(element);
            });
        });

        //var contractNumber = +(this._route.snapshot.paramMap.get('id') || 0);

        //this.contractProfessionalScheduleService.getSchedules(contractNumber)
        //    .subscribe(
        //        result => {
        //            if (!this.contractProfessionalScheduleService.onEditOrAdd) {
        //                this.contractProfessionalScheduleService.schedules = result.model;
        //                this.contractProfessionalScheduleService.onEditOrAdd = true;
        //            }

        //            this.professionalSchedules.forEach(schedule => {
        //                var existentGroup = this.contractProfessionalScheduleService.schedules.filter(function (item) {
        //                    return item.weekdayName === schedule.weekdayName;
        //                });
        //                if (existentGroup) {
        //                    existentGroup.forEach(element => {
        //                        schedule.schedules.push(element)
        //                    });
        //                }
        //            });
        //        },
        //        error => {
        //            this._toastyService.showErrorMessagge("Ocurrio un error al obtener los datos");
        //        });
    }
}