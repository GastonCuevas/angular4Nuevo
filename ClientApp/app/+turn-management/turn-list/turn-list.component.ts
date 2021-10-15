import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { ToastyMessageService } from '../../+core/services';
import { TurnManagementService } from '../turn-management.service';
import { TurnModelForList } from '../util';
import { ProfessionalContractSchedule, Turn } from '../../models';

import * as moment from 'moment';

@Component({
    selector: 'turn-list',
    templateUrl: 'turn-list.component.html',
    styleUrls: ['turn-list.component.scss']
})
export class TurnListComponent implements OnInit {

    isLoading = true;
    dataSource = new Array<TurnModelForList>();
    turnList = new Array<TurnModelForList>();
    currenDate: string;
    openModalDeleteSubject = new Subject();

    private idTurnToRemove: number;
    private schedulesPerDay = new Array<ProfessionalContractSchedule>();

    @Output() clickReturn = new EventEmitter<any>();
    @Output() newOrEditOutput = new EventEmitter<any>();

    constructor(
        private toastyMessageService: ToastyMessageService,
        private turnManagementService: TurnManagementService,
    ) {
    }

    ngOnInit() {
        this.loadDataSource();
    }

    private loadDataSource() {
        const momentVar = this.turnManagementService.sf.date;
        this.currenDate = momentVar.format('DD/MM/YYYY');
        const dateFrom = momentVar.format("YYYY-MM-DD");
        const dateTo = momentVar.format("YYYY-MM-DD");
        this.turnList = [];
        this.turnManagementService.getAllTurns(dateFrom, dateTo)
        .finally(() => this.isLoading = false)
        .subscribe(
        res => {
			this.getSchedulesPerDay();
			var turnsInfoList = res.model;
			let turnListAux = turnsInfoList.reduce((arr: any, el: any) => arr.concat(el.turns), []);

            // cargo primero los turnos normales
            for (const savedTurn of turnListAux) {
                savedTurn.time = savedTurn.time.substr(0,5);
                for (let i = 0; i < this.turnList.length; i++) {
                    if ((savedTurn.time === this.turnList[i].time) && !savedTurn.uponTurn && !this.turnList[i].uponTurn) {
                        this.turnList[i] = savedTurn;
                        this.turnList[i].allowUponTurn = true;
                        this.turnList[i].chargedTurn = true;
                    }
                }
            }

            // cargo los sobreturnos
            for (const savedTurn of turnListAux) {
                savedTurn.time = savedTurn.time.substr(0,5);
                for (let i = 0; i < this.turnList.length; i++) {
                    if ((savedTurn.time === this.turnList[i].time) && savedTurn.uponTurn && this.turnList[i].uponTurn) {
                        this.turnList[i] = savedTurn;
                        this.turnList[i].allowUponTurn = false;
                        this.turnList[i].chargedTurn = true;
                        this.turnList.forEach(normalTurn => {
                            if ((savedTurn.time === normalTurn.time) && savedTurn.uponTurn && !normalTurn.uponTurn) {
                                normalTurn.allowUponTurn = false;
                            }
                        });
                    }
                }
            }
            this.dataSource = this.turnList;
        },
        error => {
            this.toastyMessageService.showToastyError(error, 'Error al cargar los datos');
        });
    }

    private getSchedulesPerDay() {
        this.schedulesPerDay = this.turnManagementService.getSchedulesPerDay();
        if (this.schedulesPerDay.length > 0) {
            for (const schedule of this.schedulesPerDay) {
                let duration = schedule.time;
                let hourFromMoment = moment(`2018-07-23 ${schedule.hourFrom.substr(0,5)}`);
                let hourToMoment = moment(`2018-07-23 ${schedule.hourTo.substr(0,5)}`);
                let lastTurn = hourFromMoment;
                let turn = new TurnModelForList();
                turn.initialRowText = 'Turnos desde ' + hourFromMoment.format('HH:mm') + ' a ' + hourToMoment.format('HH:mm');
                turn.specialtyId = schedule.specialtyNumber;
                turn.specialty = schedule.specialtyName;
                this.turnList.push(turn);
                while (lastTurn.isBefore(hourToMoment, 'm')) {
                    if (hourFromMoment.isSame(lastTurn, 'm')) {
                        this.loadTurnToList(hourFromMoment, false, schedule.specialtyNumber, schedule.specialtyName);
                        this.loadTurnToList(hourFromMoment, true, schedule.specialtyNumber, schedule.specialtyName);
                    } else {
                        this.loadTurnToList(lastTurn, false, schedule.specialtyNumber, schedule.specialtyName);
                        this.loadTurnToList(lastTurn, true, schedule.specialtyNumber, schedule.specialtyName);
                    }
                    lastTurn =  lastTurn.add(duration, 'm');
                }
            }
        }
    }

    private loadTurnToList(time: moment.Moment, uponTurn: boolean, specialty: number, specialtyName: string) {
        let turn = new TurnModelForList();
        turn.time = time.format('HH:mm');
        turn.chargedTurn = false;
        turn.uponTurn = uponTurn;
        turn.specialtyId = specialty;
        turn.specialty = specialtyName;
        this.turnList.push(turn);
    }

    onActionClick(action: string, item: TurnModelForList) {
        switch (action) {
            case 'new':
                this.turnManagementService.sf.time = item.time;
                this.turnManagementService.sf.specialtyName = item.specialty;
                this.turnManagementService.sf.specialty = item.specialtyId;
                this.newOrEditOutput.emit();
                break;
            case 'newUponTurn':
                this.turnManagementService.sf.time = item.time;
                this.turnManagementService.sf.specialtyName = item.specialty;
                this.turnManagementService.sf.specialty = item.specialtyId;
                this.turnManagementService.sf.uponTurn = true;
                this.newOrEditOutput.emit();
                break;
            case 'edit':
                this.turnManagementService.sf.idTurn = item.numInt;
                // this.turnManagementService.sf.specialty = item.specialtyId;
                this.newOrEditOutput.emit();
                break;
            case 'delete':
                this.idTurnToRemove = item.numInt;
                this.openModalDeleteSubject.next();
                break;
            case 'detail':
                break;
            default:
                break;
        }
    }

    deleteItem() {
        this.turnManagementService.delete(this.idTurnToRemove).subscribe(
            result => {
                this.toastyMessageService.showSuccessMessagge("Se elimino exitosamente.");
                this.loadDataSource();
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al eliminar');
            });
    }

    return() {
        this.clickReturn.emit(true);
    }

}
