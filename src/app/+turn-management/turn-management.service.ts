import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService } from './../+core/services';
import { ISort } from '../interface';
import { Schedule, SelectedFilter, PatientMedicalInsurance, ConsultationModelForList } from './util';
import { ProfessionalContractSchedule } from '../models/professional-contract-schedule.model';
import { ItemCombo } from '../+shared/util';

import * as moment from 'moment';

@Injectable()
export class TurnManagementService {

    sf: SelectedFilter = new SelectedFilter();

    professionalSchedules: Array<Schedule> = new Array<Schedule>();
    private listPMIs: Array<PatientMedicalInsurance> = new Array<PatientMedicalInsurance>();
    private auxlistPMIs: Array<PatientMedicalInsurance> = new Array<PatientMedicalInsurance>();
    private index: number = 0;
    idToPrint: number;
    professionalContractId: number;

    private baseUrl: string = 'api/turnmanagement';

    constructor(
        private requestService: RequestService
    ) { }

    getConsultingRooms(professional: number, specialty: number): Observable<any> {
        return this.requestService.get(`api/Professional/${professional}/specialty/${specialty}/consultingroom`);
    }

    getAllConsultingRooms(professional: number): Observable<any> {
        return this.requestService.get(`api/Professional/${professional}/consultingroom`);
    }

    getProfessionalContractSchedule(): Observable<any> {
        const now = moment().format("MM/DD/YYYY");
        
        // let url = `api/ProfessionalContractSchedule?filterBy=ProfessionalContract.ProfessionalNumber = ${this.sf.professional} and (Convert.ToDateTime(ProfessionalContract.DateTo) == DateTime.MinValue or Convert.ToDateTime(ProfessionalContract.DateTo)>= DateTime.Now) and SpecialtyNumber = ${this.sf.specialty}`;
        let url = !this.sf.specialty 
                ? `api/ProfessionalContractSchedule?filterBy=ProfessionalContract.ProfessionalNumber = ${this.sf.professional} and (Convert.ToDateTime(ProfessionalContract.DateTo) == DateTime.MinValue or Convert.ToDateTime(ProfessionalContract.DateTo)>= DateTime.Now)`
                : `api/ProfessionalContractSchedule?filterBy=ProfessionalContract.ProfessionalNumber = ${this.sf.professional} and (Convert.ToDateTime(ProfessionalContract.DateTo) == DateTime.MinValue or Convert.ToDateTime(ProfessionalContract.DateTo)>= DateTime.Now) and SpecialtyNumber = ${this.sf.specialty}` ;
        if (!!this.sf.medicalOffice) url += ` and ConsultingRoom = ${this.sf.medicalOffice}`;
        return this.requestService.get(url);
    }

    getProfessionalContractAbsence(dateFrom: any, dateTo: any): Observable<any> {
        return this.requestService.get(`api/ProfessionalContractAbsence/professional/${this.sf.professional}?dateFrom=${dateFrom}&dateTo=${dateTo}`)
    }

    getAllTurns(dateFrom: string, dateTo: string): Observable<any> {
        // let url = `${this.baseUrl}?specialty=${this.sf.specialty}&professional=${this.sf.professional}&dateFrom=${this.sf.dateFrom}&dateTo=${this.sf.dateTo}`;
        //let url = `${this.baseUrl}?specialty=${this.sf.specialty}&professionalContractId=${this.professionalContractId}&professional=${this.sf.professional}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        let url = `${this.baseUrl}?professionalContractId=${this.professionalContractId}&professional=${this.sf.professional}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        if (this.sf.type) url += `&uponTurn=${this.sf.type == 'uponTurn'}`;
        return this.requestService.get(url);
    }

    getTurn(numInt: number): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/${numInt}`);
    }

    update(id: number, turn: any): Observable<any> {
       return this.requestService.put(`${this.baseUrl}/${id}`, turn);
    }

    add(turn: any): Observable<any> {
       return this.requestService.post(`${this.baseUrl}`, turn);
    }

    delete(id: number): Observable<any> {
       return this.requestService.delete(`${this.baseUrl}/${id}`);
    }

    getSchedulesPerDay(): Array<ProfessionalContractSchedule> {
        let schedulesPerDay: Array<ProfessionalContractSchedule> = new Array<ProfessionalContractSchedule>();
        for (const schedule of this.professionalSchedules) {
            if (schedule.weekday === this.sf.weekday) schedulesPerDay = schedule.schedules;
        }
        return schedulesPerDay;
    }

    getAllPMI(): Array<PatientMedicalInsurance> {
        return this.listPMIs;
    }

    addPMI(pmi: PatientMedicalInsurance) {
        if (pmi.byDefault) this.listPMIs.forEach(item => item.byDefault = false);
        pmi.id = this.index;
        this.listPMIs.push(pmi);
        this.index++;
    }

    updatePMI(pmi: PatientMedicalInsurance) {

        if (pmi.byDefault) this.listPMIs.forEach(item => item.byDefault = false);
        for(let i = 0; i < this.listPMIs.length; i++) {
            if (this.listPMIs[i].id == pmi.id) this.listPMIs[i] = pmi;
        }
    }

    deletePMI(id: number) {
        let auxList: Array<PatientMedicalInsurance> = this.listPMIs;
        this.listPMIs = [];
        for (const pmi of auxList) {
            if(pmi.id != id ) this.listPMIs.push(pmi);
        }
    }

    resetListPMIs() {
        this.listPMIs = [];
        this.index = 0;
    }

    getHolidaysByFilter(filterBy: string): Observable<any> {
        return this.requestService.get(`api/Holiday/all?filterBy=${filterBy}`);
    }

    checkAvailability(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        if (!filterBy) return Observable.of({model:[]});
        let filterDefault = 'filter=(ProfessionalContract.DateTo == null or Convert.ToDateTime(ProfessionalContract.DateTo) >= new DateTime())';
        let url = `${this.baseUrl}/fast?${filterDefault}`;
        let filter: string = '' + filterBy;
        if (filter[0] != '&') url += ` and ${filterBy}`;
        else url += `${filterBy}`;
        return this.requestService.get(url);
    }

    getAllMedicalOffices(): Observable<any> {
        let url = `${this.baseUrl}/consultingrooms`;
        return this.requestService.get(url).map(response => {
            let aux: number[] = response.model;
            let combo: ItemCombo[] = [];
            aux.forEach(i => combo.push({number: i, name: ''+ i}));
            response.model = combo;
            return response;
        });
    }

    getProfessionalsWithContract(): Observable<any> {
        let url = `api/professional/combo/withcontract`;
        return this.requestService.get(url);
    }
    getHistoryByPatient(patientId: number, dateFrom: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/patient?patientId=${patientId}&dateFrom=${dateFrom}`)
    }

}
