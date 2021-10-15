import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ToastyMessageService } from "../../+core/services";
import { ProfessionalContractSchedule } from '../../models';
import { TurnManagementService } from "./../turn-management.service";
import { Schedule } from '../util';

@Component({
    selector: 'professional-schedules',
    templateUrl: './professional-schedules.component.html',
    styleUrls: ['./professional-schedules.component.scss']
})
export class ProfessionalSchedulesComponent implements OnInit {

    @Output() finishLoadEE = new EventEmitter<any>();

    showInitialMsg = true;
    isLoading = false;
    daysWithProfessionalSchedules = new Array<Schedule>();
    registeredSchedules = new Array<ProfessionalContractSchedule>();

    private professionalSchedules: Array<Schedule>;

    constructor(
        private toastyMessageService: ToastyMessageService,
        private turnManagementService: TurnManagementService
    ) {
    }

    ngOnInit() {}

    consultSchedules() {
        this.loadProfessionalSchedules();
    }

    private loadProfessionalSchedules() {
        this.isLoading = true;
        this.showInitialMsg = false;
        this.turnManagementService.getProfessionalContractSchedule()
        .finally(() => {
            this.isLoading = false;
            this.finishLoadEE.emit();
        })
        .subscribe(
            response => {
                this.initializeListProfessionalSchedules();
                this.registeredSchedules = response.model;
                this.registeredSchedules.forEach(item => this.turnManagementService.professionalContractId = item.contractNumber); 

                this.professionalSchedules.forEach(schedule => {
                    let schedulesPerDay = this.registeredSchedules.filter(item => {
                        return item.weekday === schedule.weekday;
                    });
                    if (schedulesPerDay.length > 0) {
                        schedulesPerDay.forEach(element => {
                            schedule.schedules.push(element)
                        });
                        schedule.withSchedules = true;
                    }
                });
                this.turnManagementService.professionalSchedules = this.professionalSchedules;
                this.professionalSchedules.forEach(item => {
                    if (item.withSchedules) this.daysWithProfessionalSchedules.push(item);
                });
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Error al cargar los horarios');
            }
        );
    }

    private initializeListProfessionalSchedules() {
        this.professionalSchedules = [
            { weekday: 0, weekdayName: 'Domingo', schedules: Array<ProfessionalContractSchedule>(), withSchedules: false },
            { weekday: 1, weekdayName: 'Lunes', schedules: Array<ProfessionalContractSchedule>(), withSchedules: false },
            { weekday: 2, weekdayName: 'Martes', schedules: Array<ProfessionalContractSchedule>(), withSchedules: false },
            { weekday: 3, weekdayName: 'Miercoles', schedules: Array<ProfessionalContractSchedule>(), withSchedules: false },
            { weekday: 4, weekdayName: 'Jueves', schedules: Array<ProfessionalContractSchedule>(), withSchedules: false },
            { weekday: 5, weekdayName: 'Viernes', schedules: Array<ProfessionalContractSchedule>(), withSchedules: false },
            { weekday: 6, weekdayName: 'Sábado', schedules: Array<ProfessionalContractSchedule>(), withSchedules: false }
        ];
        this.daysWithProfessionalSchedules = [];
    }

    resetProfessionalSchedules() {
        this.professionalSchedules = [];
        this.daysWithProfessionalSchedules = [];
        this.turnManagementService.professionalSchedules = [];
        this.registeredSchedules = [];
        this.showInitialMsg = true;
    }

}
