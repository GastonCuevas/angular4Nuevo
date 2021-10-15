import { Component, OnInit, ViewChild } from '@angular/core';

import { CommonService, ToastyMessageService, LoadingGlobalService } from '../../+core/services';
import { TurnManagementService } from './../turn-management.service';

import { ProfessionalSchedulesComponent } from '../professional-schedules/professional-schedules.component';
import { FilterFormComponent } from '../filter-form/filter-form.component';
import { TMCalendarComponent } from '../calendar/tm-calendar.component';
import { TurnModelForList, SelectedFilter } from '../util';

import * as moment from 'moment';
import { IntelligentReportComponent } from '../../+shared';

@Component({
    selector: 'turn-management',
    templateUrl: './turn-management.component.html',
    styleUrls: ['./turn-management.component.scss']
})
export class TurnManagementComponent implements OnInit {

    @ViewChild(FilterFormComponent) filterFormComponent: FilterFormComponent;
    @ViewChild(ProfessionalSchedulesComponent) professionalSchedulesComponent: ProfessionalSchedulesComponent;
    @ViewChild(TMCalendarComponent) tmCalendarComponent: TMCalendarComponent;
    @ViewChild('iReport') iReport: IntelligentReportComponent;

    showCalendarSection = false;
    showCalendar = false;
    showTurnList = false;
    showTurnForm = false;

    constructor(
        private commonService: CommonService,
        private toastyMessageService: ToastyMessageService,
        private loadingGlobalService: LoadingGlobalService,
        private turnManagementService: TurnManagementService
    ) { }


    ngOnInit() {}

    resetValues() {
        this.professionalSchedulesComponent.resetProfessionalSchedules();
        this.turnManagementService.sf = new SelectedFilter();
        this.tmCalendarComponent.resetTMCalendar();
        this.showCalendarSection = false;
    }

    consult() {
        this.showCalendar = true;
        this.showTurnList = false;
        this.showTurnForm = false;
        this.showCalendarSection = true;
        this.professionalSchedulesComponent.consultSchedules();
    }

    consultDataForCalendar() {
        this.tmCalendarComponent.consultTurns();
    }

    hideLoading() {
        this.filterFormComponent.isConsulting = false;
    }

    showOrHideCalendar(show: boolean) {
        this.showCalendar = show;
        this.showTurnList = !show;
        if (show) this.tmCalendarComponent.consultTurns(true);
    }

    addOrEditTurn() {
        this.showTurnList = false;
        this.showTurnForm = true;
    }

    reloadTurnList() {
        this.showTurnForm = false;
        this.showTurnList = true;
        this.printTurnConstance();
    }

    printTurnConstance() {
        if (this.turnManagementService.idToPrint) this.iReport.generateReport(this.turnManagementService.idToPrint, 4000);
        this.turnManagementService.idToPrint = 0;
    }
}


