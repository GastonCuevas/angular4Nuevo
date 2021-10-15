import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { RequestService } from './../+core/services/request.service';
import { ISort } from '../interface';
import { ProfessionalContractSchedule } from '../models/professional-contract-schedule.model';

@Injectable()
export class ContractProfessionalScheduleService {
    public baseUrl: string = "/api/ProfessionalContractSchedule";
    public contractProfessionalScheduleId: any = 0;
    isNewSchedule: boolean = false;
    schedules: Array<any> = new Array<any>();
    newSchedules: Array<ProfessionalContractSchedule> = new Array<ProfessionalContractSchedule>();
    deletedSchedules: Array<ProfessionalContractSchedule> = new Array<ProfessionalContractSchedule>();
    modifiedSchedules: Array<ProfessionalContractSchedule> = new Array<ProfessionalContractSchedule>();
    registeredSchedules: Array<ProfessionalContractSchedule> = new Array<ProfessionalContractSchedule>();
    scheduleIndex: number = -1;
    schedule: ProfessionalContractSchedule = new ProfessionalContractSchedule();
    isCloned: boolean = false;
    itemIndexToEdit: number = -1;
    onEditOrAdd = false;

    constructor(
        private requestService: RequestService
    ) {
    }

    public delete(id: any) {
        return this.requestService.delete(`${this.baseUrl}/${id}`);
    }

    public update(contractProfessionalSchedule: any) {
        this.schedules.forEach((item: any, index: number) => {
            if (index === this.itemIndexToEdit) {
                this.schedules[index] = contractProfessionalSchedule;
                this.itemIndexToEdit = -1;
            }
        });
    }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    public get(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/${id}`);
    }

    public getSchedules(contractNumber: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/schedule/${contractNumber}`);
    }

  
    public add(contractProfessionalSchedule: any): Observable<any> {
        this.schedules.push(contractProfessionalSchedule);
        return Observable.of(this.schedule);
    }

    itemToEdit(item: any) {
        if (item) {
            this.schedule = item;
            this.schedule.weekdayFrom = this.schedule.weekdayTo = this.schedule.weekday;
            this.itemIndexToEdit = this.schedules.findIndex(x => x === item);
        }
    }

    checkTurns(contractProfessionalSchedule: any): Observable<any> {
        return this.requestService.post(`/api/ProfessionalContract/validate-schedule`, contractProfessionalSchedule);
    }

    save(contractProfessionalSchedule: ProfessionalContractSchedule) {
        const i = this.schedules.findIndex(d => d.numint === contractProfessionalSchedule.numint);
        if (i !== -1) {
            this.schedules[i] = contractProfessionalSchedule;
            this.itemIndexToEdit = -1;
        } else {
            contractProfessionalSchedule.numint = this.schedules.reduce((min, d) => d.numint < min ? d.numint : min, 0) - 1;
            this.schedules.push(contractProfessionalSchedule);
        }
    }
}