import { Injectable } from '@angular/core';
import { RequestService } from './../+core/services';
import { Observable } from 'rxjs/Observable';
import { Paginator, Sort, ActionTable } from '../+shared/util';

import * as moment from 'moment';
import { TurnModelForList, Patient } from '../+turn-management/util/index';
import { PatientMovement } from '../models/patient-movement.model';

@Injectable()
export class TurnConsultationService {
    turnConsultations: Array<any> = new Array<any>();
    isDetail: boolean;
    private baseUrl = 'api/turnmanagement';

    constructor(
        private requestService: RequestService
    ) {}

    getAll(paginator: Paginator, filterBy?: any, sort?: Sort): Observable<any> {
        let url = `${this.baseUrl}/query?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;

        return this.requestService.get(url)
        .map(response => {
            const dataSource: Array<TurnModelForList> = response.model;
            dataSource.forEach(item => {
                item.time = item.time.substr(0,5);
                item.action = new ActionTable();
                item.action.detail = true;
                if (item.turnState == 'Otorgado' && !moment(item.date).isBefore(moment(), 'day')) item.action.edit = true;
                else item.hideBtns = true;

                item.disableBtnAssist = !moment(item.date).isBefore(moment());

                item.action.observation = !!item.observation;
                // item.action.observation = true;
                item.uponTurnText = item.uponTurn ? 'Sobreturno': '-';
			});
            response.model = dataSource;
            this.turnConsultations = dataSource;
            return response;
        });
    }

    getTurn(id: number): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/${id}`);
    }

    update(id: number, turn: any): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${id}`, turn);
    }

    updateState(id: number, state: number): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/updateState/${id}`, state);
    }

    assistTurn(id: number): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/attendTurn/${id}`);
    }

    updatePatienMov(turnId: number, patientMov: PatientMovement)
    {
        return this.requestService.put(`api/patient/updatePatMov/${turnId}`, patientMov);
    }
}
