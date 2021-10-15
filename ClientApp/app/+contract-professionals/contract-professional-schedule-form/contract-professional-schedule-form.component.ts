import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilityService } from '../../+core/services/utility.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../+core/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfessionalContractSchedule } from '../../models/professional-contract-schedule.model';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { ContractProfessionalScheduleService } from '../contract-professional.schedule.service';
import { Schedule } from '../../models/schedule.model';
import * as moment from 'moment';

@Component({
    selector: 'contract-professional-schedule-form',
    templateUrl: './contract-professional-schedule-form.component.html',
    styleUrls: ['./contract-professional-schedule-form.component.scss']
})
export class ContractProfessionalScheduleFormComponent implements OnInit {

    functionForSpecialties = this.commonService.getSpecialties();
    public specialties: Array<any>;
    public auxListSpecialties: Array<any> = new Array<any>();
    public formContractSchedule: FormGroup;
    public specialtyName: string = '';
    public weekDays: Array<any>;
    public isLoading: boolean = false;
    public isValidHourFrom: boolean = true;
    professionalContractSchedule: ProfessionalContractSchedule = new ProfessionalContractSchedule();
    public nameSpecialty: string = '';
    schedule: Schedule = new Schedule();
    public openModalSubject: Subject<any> = new Subject();
    isNew: boolean = true;
    public contractNumber: number = 0;
    public professionalAccount: number = 0;
    public timePickerOptions: any;
    index: number = 0;
    durations: Array<any> = new Array<any>();
    duration: any = '';

    @Output() actionClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private fbs: FormBuilder,
        private commonService: CommonService,
        private activatedRoute: ActivatedRoute,
        private utilityService: UtilityService,
        private toastyService: ToastyMessageService,
        public contractProfessionalScheduleService: ContractProfessionalScheduleService
    ) {
        this.contractNumber = +(this.activatedRoute.snapshot.paramMap.get('id') || 0);
        this.professionalAccount = +(this.activatedRoute.snapshot.paramMap.get('profesionalId') || 0);
    }

    createForm() {
        this.formContractSchedule = this.fbs.group({
            specialtyName: [this.professionalContractSchedule.specialtyName, Validators.required],
            weekdayFrom: [this.professionalContractSchedule.weekdayFrom, Validators.required],
            weekdayTo: [this.professionalContractSchedule.weekdayTo, Validators.required],
            hourFrom: [this.professionalContractSchedule.hourFrom, Validators.required],
            hourTo: [this.professionalContractSchedule.hourTo, Validators.required],
            time: [this.professionalContractSchedule.time, Validators.required],
            consultingRoom: [this.professionalContractSchedule.consultingRoom, [Validators.required, Validators.min(0), Validators.max(1000000)]]
        });
    }

    loadSpecialtyName(specialtyNumber: number) {
        for (let i in this.specialties) {
            if (this.specialties[i].number == specialtyNumber) {
                this.specialtyName = this.specialties[i].name;
                //this.isLoadingMedicalEnsurance = true;
            }
        }
    }

    getSchedule() {
        this.professionalContractSchedule = this.contractProfessionalScheduleService.schedule;
        this.loadSpecialties();
        this.createForm();
    }

    ngOnInit() {
        this.timePickerOptions = this.utilityService.getTimePickerOptions();
        this.loadDurations();
        this.loadWeekDays();
        this.isNew = this.contractProfessionalScheduleService.isNewSchedule;
        this.loadForm();
    }

    loadForm() {
        if (this.contractProfessionalScheduleService.isNewSchedule) {
            this.loadSpecialties();
            this.createForm();
            //this.professionalContractSchedule.numint = this.contractProfessionalScheduleService.schedules.reduce((min, d) => d.numint < min ? d.numint : min, 0) - 1;
            const contractProfessionalId = this.activatedRoute.snapshot.paramMap.get('id');
            const cpId = contractProfessionalId ? parseInt(contractProfessionalId) : 0;
            this.professionalContractSchedule.contractNumber = cpId;
        }
        else
            this.getSchedule();
    }

    loadSpecialties() {
        this.commonService.getSpecialties().subscribe(
            response => {
                this.specialties = response.model || [];
                this.auxListSpecialties = this.specialties.map(e => e.name);
                if (!this.contractProfessionalScheduleService.isNewSchedule)
                    this.loadSpecialtyName(this.professionalContractSchedule.specialtyNumber);
            },
            error => this.toastyService.showErrorMessagge('No se pudo obtener las especialidades')
        );
    }

    loadWeekDays() {
        this.commonService.getWeekDays().subscribe(
            response => {
                this.weekDays = response || [];
            },
            error => this.toastyService.showErrorMessagge('No se pudo obtener los dias de la semana')
        );
    }

    loadDurations() {
        this.durations = [
            { time: '10', name: '10 min.' },
            { time: '15', name: '15 min.' },
            { time: '20', name: '20 min.' },
            { time: '25', name: '25 min.' },
            { time: '30', name: '30 min.' },
            { time: '45', name: '45 min.' },
            { time: '60', name: '60 min.' }
        ];
    }

    onAgree() {
        this.actionClick.emit({ action: 'cancelar' });
    }

    onCancelButton(): void {
        this.openModalSubject.next();
    }

    onSubmitSchedule($event: any) {
        const schedules = this.getSchedules(this.formContractSchedule.value.weekdayFrom, this.formContractSchedule.value.hourFrom, this.formContractSchedule.value.weekdayTo, this.formContractSchedule.value.hourTo);
        schedules.subscribe(res => {
            res.forEach((d: any) => {
                this.contractProfessionalScheduleService.save(d);
            });
            this.toastyService.showSuccessMessagge('Se actualizo la lista de horarios');
            this.actionClick.emit();
        },
            error => {
                this.toastyService.showErrorMessagge(error);
            });
    }

    getSchedules(weekdayFrom: number, hourFrom: string, weekdayTo: number, hourTo: string): Observable<any> {
        const to = weekdayFrom <= weekdayTo ? weekdayTo - weekdayFrom + 1 : 7 - weekdayFrom + weekdayTo + 1;
        return Observable.forkJoin(Array.from(new Array(to), (x, index) => {
            const tmp = index + weekdayFrom;
            const i = tmp - 7 < 0 ? tmp : tmp - 7;
            const professionalContractSchedule: ProfessionalContractSchedule = Object.assign({}, this.professionalContractSchedule, this.formContractSchedule.value);
            professionalContractSchedule.weekday = i - 7 < 0 ? i : i - 7;
            professionalContractSchedule.hourFrom = weekdayFrom === i ? hourFrom : '00:00';
            professionalContractSchedule.hourTo = weekdayTo === i ? hourTo : '23:59';
            if (!this.validateRangeHour(professionalContractSchedule)) {
                return Observable.throw('Ya existe un horario entre ese rango de dias y horas');
            }
            professionalContractSchedule.weekdayName = this.weekDays.find((d) => d.number === i).name;
            if (this.contractProfessionalScheduleService.isNewSchedule) {
                return Observable.of(professionalContractSchedule);
            } else {
                professionalContractSchedule.numint = this.professionalContractSchedule.weekday === i ? this.professionalContractSchedule.numint : 0;
                professionalContractSchedule.withTurns = this.professionalContractSchedule.weekday === i ? this.professionalContractSchedule.withTurns : false;
                if (professionalContractSchedule.withTurns) {
                    return this.contractProfessionalScheduleService.checkTurns(professionalContractSchedule)
                        .map(() => {
                            return professionalContractSchedule;
                        })
                        .catch(error => {
                            return Observable.throw(error.success
                                ? error.errorMessage
                                : 'Ocurrio un error al actualizar el horario');
                        });
                } else {
                    return Observable.of(professionalContractSchedule);
                }
            }
        }));
    }

    validateRangeHour(professionalContractSchedule: ProfessionalContractSchedule) {
        var hourFrom = moment(professionalContractSchedule.hourFrom, 'h:mm');
        var hourTo = moment(professionalContractSchedule.hourTo, 'h:mm');

        const validRange = this.contractProfessionalScheduleService.schedules.every(element => {
            if (professionalContractSchedule.numint == element.numint || professionalContractSchedule.weekday !== element.weekday) return true;
            var itemHourFrom = moment(element.hourFrom, 'h:mm');
            var itemHourTo = moment(element.hourTo, 'h:mm');
            return !(hourFrom.isSameOrAfter(itemHourFrom) && hourFrom.isBefore(itemHourTo) ||
                hourTo.isAfter(itemHourFrom) && hourTo.isSameOrBefore(itemHourTo) ||
                hourFrom.isBefore(itemHourFrom) && hourTo.isAfter(itemHourTo));
        });
        return validRange;
    }

    customCallback(event: any) {
        if (this.specialties) {
            this.nameSpecialty = event;
            const a = this.specialties.find((e: any) => {
                return e.name.toLowerCase() == event.toLowerCase();
            });
            if (a) {
                this.professionalContractSchedule.specialtyNumber = a.number;
            }
        }
    }

    public selectedSpecialties(specialty: any): void {
        if (specialty != null) {
            this.professionalContractSchedule.specialtyNumber = specialty.number;
            this.professionalContractSchedule.specialtyName = specialty.name;
        }
    }

    customCallbackHour() {
        setTimeout(() => {
            const weekdayFrom = this.formContractSchedule.value.weekdayFrom;
            const weekdayTo = this.formContractSchedule.value.weekdayTo;
            const hourFrom = this.formContractSchedule.value.hourFrom;
            const hourTo = this.formContractSchedule.value.hourTo;
            this.isValidHourFrom = !weekdayFrom || !weekdayTo || !hourFrom || !hourTo || weekdayFrom !== weekdayTo || moment(hourFrom, 'h:mm').isBefore(moment(hourTo, 'h:mm'));
        });
    }

    onChangeDuration() {
        const value = this.durations.find(d => d.time == this.formContractSchedule.value.time);
        this.duration = value;
    }
}
