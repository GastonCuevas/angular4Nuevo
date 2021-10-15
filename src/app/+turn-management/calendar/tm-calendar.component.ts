import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { CommonService, ToastyMessageService, LoadingGlobalService } from '../../+core/services';
import { TurnManagementService } from './../turn-management.service';

import { CalendarComponent } from 'ng-fullcalendar';
import { Options, EventObject } from 'fullcalendar';
import { CalendarOptions, TurnModelForList, SelectedFilter, Absence, Holiday} from '../util';

import * as moment from 'moment';

@Component({
    selector: 'tm-calendar',
    templateUrl: './tm-calendar.component.html',
    styleUrls: ['./tm-calendar.component.scss']
})
export class TMCalendarComponent implements OnInit {

    @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
    @Output() eventHideCalendar = new EventEmitter<boolean>();
    @Output() finishLoadEE = new EventEmitter<any>();

    showFullCalendar = false;
    calendarOptions: Options = CalendarOptions.OPTIONS;
    events = new Array<EventObject>();
    holidayColor = '#8900a0'; //'#eecbf491';
    absenceColor =  '#f6a78e';
    withoutScheduleColor = '#4fa8a0';
    withScheduleColor = '#00ab09'; //'#a1f0a5';
    assistedTurnColor = '#278c2b';
    grantedTurnColor = '#03A9F4';

    private showLoading?: boolean;
    private isLoadingTurns = false;
    private isLoadingHolidaysAndAbsences = false;
    private weekdaysWithSchedule = new Array<number>();
    private dateFrom: string;
    private dateTo: string;
    private auxListEvents = new Array<EventObject>();
    private holidays = new Array<Holiday>();
    private absences = new Array<Absence>();
    private daysWithoutTurnsAvailable: string[] = [];

    constructor(
        private commonService: CommonService,
        private toastyMessageService: ToastyMessageService,
        private loadingGlobalService: LoadingGlobalService,
        private turnManagementService: TurnManagementService
    ) { }

    ngOnInit() {
        this.dateFrom = this.firstOrLastDay(moment());
        this.dateTo = this.firstOrLastDay(moment(), true);
    }

    clickButton(model: any) {
        this.dateFrom = this.firstOrLastDay(model.data);
        this.dateTo = this.firstOrLastDay(model.data, true);
        this.loadDataForCalendar(true);
    }

    eventClick(model: any) {
    }

    dayClick(detail: any) {
        const date: moment.Moment = detail.date;
        const weekday: number =  parseInt(detail.date.format('e'));
        let allowed = false;
        for (const wd of this.weekdaysWithSchedule) {
            if (weekday === wd) allowed = true;
        }

        if (allowed) {
            // for (const h of this.holidays) {
            //     if (date.isSame(this.convertToMoment(h.date), 'days')) return;
            // }
            for (const a of this.absences) {
                if (date.isBetween(moment(a.dateFrom), moment(a.dateTo), 'days', '[]')) return;
            }
            // if (!moment(date).isBefore(moment(), 'day')) {
                this.turnManagementService.sf.weekday = weekday;
                this.turnManagementService.sf.date = date;
                this.eventHideCalendar.emit(false);
            // }
        }
    }

    updateEvent(model: any) {
    }

    consultTurns(showLoading?: boolean) {
        this.showFullCalendar = true;
        this.loadDataForCalendar(showLoading);
    }

    private navigateToToday() {
        this.dateFrom = this.firstOrLastDay(moment());
        this.dateTo = this.firstOrLastDay(moment(), true);
        $('#ucCalendar').fullCalendar('today');
    }

    private loadWeekdaysWithSchedule() {
        this.weekdaysWithSchedule = [];
        for (let schedule of this.turnManagementService.professionalSchedules) {
            if (schedule.withSchedules) this.weekdaysWithSchedule.push(schedule.weekday);
        }
    }

    private checkFullLoad() {
        if (!this.isLoadingTurns && !this.isLoadingHolidaysAndAbsences) {
            this.loadDaysWithSchedule();
            this.events = this.auxListEvents;
            if (this.showLoading) this.loadingGlobalService.hideLoading();
            else this.finishLoadEE.emit();
        }
    }

    private loadDataForCalendar(showLoading?: boolean) {
        this.showLoading = showLoading;
        if (this.showLoading) this.loadingGlobalService.showLoading();
        this.auxListEvents = [];
        this.getHolidaysAndAbsences();
        this.loadTurns();
    }

    private loadTurns() {
        this.isLoadingTurns = true;
        this.daysWithoutTurnsAvailable = [];
        let turns: TurnModelForList[];
        let turnsInfoList: {available: number, date: string, turns: TurnModelForList[]}[];
        this.turnManagementService.getAllTurns(this.dateFrom, this.dateTo)
            .finally(() => {
                this.isLoadingTurns = false;
                this.checkFullLoad();
            })
            .subscribe(
            response => {
                turnsInfoList = response.model;
                for (const turnInfo of turnsInfoList) {
                    this.auxListEvents.push({
                        title: turnInfo.available + ' turnos disponibles',
                        start: turnInfo.date.split('T')[0],
                        backgroundColor: '#009688',
                        color: 'black',
                        clickAllowed: true
                    });
                    if (!turnInfo.available) {
                        this.daysWithoutTurnsAvailable.push(turnInfo.date);
                        this.auxListEvents.push({
                            title: '',
                            start: turnInfo.date.split('T')[0],
                            overlap: false,
                            rendering: 'background',
                            color: 'red',
                            clickAllowed: true,
                        });
                    }
                    for (let turn of turnInfo.turns) {
                        this.auxListEvents.push({
                            title: turn.pacient,
                            start: turn.date.split('T')[0] + 'T' + turn.time,
                            backgroundColor: this.getColorTurn(turn.turnState),
                            color: this.getColorTurn(turn.turnState),
                            clickAllowed: true
                        });
                    }
                }
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Error al cargar los turnos');
            });
    }

    private getColorTurn(turnState: string): string {
        let color = '';
        switch (turnState) {
            case 'Otorgado': color = this.grantedTurnColor; break;
            case 'Asistido': color = this.assistedTurnColor; break;
            case 'Suspendido': color = '#7d7d7d'; break;
            case 'Anulado': color = '#f7440c'; break;
            default: color = 'green'; break;
        }
        return color;
    }

    private getHolidaysAndAbsences() {
        this.isLoadingHolidaysAndAbsences = true;
        Observable.forkJoin(
            this.turnManagementService.getHolidaysByFilter(`date>="${this.dateFrom}" and date<="${this.dateTo}"`),
            this.turnManagementService.getProfessionalContractAbsence(this.dateFrom, this.dateTo)
        )
        .finally(() => {
            this.isLoadingHolidaysAndAbsences = false;
            this.checkFullLoad();
        })
        .subscribe((response: Array<any>) => {
            this.holidays = response[0].model || [];
            this.loadHolidays();
            this.absences = response[1].model || [];
            this.loadAbsences();
            this.loadWeekdaysWithSchedule();
            // this.loadDaysWithSchedule();
        }, error => {
            this.toastyMessageService.showToastyError(error, 'Error al cargar vacaciones y ausencias.');
        });
    }

    private loadHolidays() {
        for (let h of this.holidays) {
            const dateStart = moment(h.date).format('YYYY-MM-DD');
            // this.auxListEvents.push({
            //     title: h.description || '',
            //     start: dateStart,
            //     backgroundColor: this.holidayColor,
            //     color: this.holidayColor,
            //     textColor: 'grey',
            //     clickAllowed: true
            // });
            this.auxListEvents.push({
                title: h.description || '',
                start: dateStart,
                backgroundColor: this.holidayColor,
                color: this.holidayColor,
                clickAllowed: true
            });
        }
    }

    private loadAbsences() {
        for (let a of this.absences) {
            this.auxListEvents.push({
                title: '',
                start: moment(a.dateFrom).format('YYYY-MM-DD'),
                end:  moment(a.dateTo).add(1, 'days').format("YYYY-MM-DD"),
                overlap: false,
                rendering: 'background',
                color: this.absenceColor,
                clickAllowed: false
            });
        }
    }

    private loadDaysWithSchedule() {
        const dateFrom: moment.Moment = moment(this.dateFrom, 'YYYY-MM-DD');
        const dateTo: moment.Moment = moment(this.dateTo, 'YYYY-MM-DD');
        let clickAllowed: boolean;
        let isPainted: boolean;

        for(let df = dateFrom; df.isSameOrBefore(dateTo, 'days'); df = df.add(1, 'd')) {
            const weekday: number =  parseInt(df.format('e'));
            clickAllowed = false;
            isPainted = true;
            for (const wd of this.weekdaysWithSchedule) {
                if (weekday === wd) clickAllowed = true;
            }
            if (clickAllowed) {
                // for (const h of this.holidays) {
                //     if (dt.isSame(this.convertToMoment(h.date), 'days')) isPainted = false;
                // }

                for (const a of this.absences) {
                    if (dateFrom.isBetween(moment(a.dateFrom), moment(a.dateTo), 'days', '[]')) isPainted = false;
                }

                for (const withoutAvailable of this.daysWithoutTurnsAvailable) {
                    if (df.isSame(moment(withoutAvailable), 'days')) isPainted = false;
                }

                if (isPainted) {
                    this.auxListEvents.push({
                        title: '',
                        start: dateFrom.format('YYYY-MM-DD'),
                        overlap: false,
                        rendering: 'background',
                        color: this.withScheduleColor,
                        clickAllowed: true,
                    });
                }
            }
        }
    }

    resetTMCalendar() {
        this.showFullCalendar = false;
        this.events = [];
        this.weekdaysWithSchedule = [];
        this.auxListEvents = [];
        this.holidays = [];
        this.absences = [];
        this.navigateToToday();
    }

    private firstOrLastDay(date: moment.Moment, last?: boolean): string {
        let result = '';
        if (!last) result = date.clone().startOf('month').format("YYYY-MM-DD");
        else result = date.clone().endOf('month').format("YYYY-MM-DD");
        return result;
    }

}


