import { Injectable } from '@angular/core';
import { RequestService } from '../+core/services/request.service';
import { Observable } from 'rxjs/Rx';
import { ISort } from '../interface';

@Injectable()
export class PatientMedicalInsuranceService {
    baseUrl = "api/patientMedicalInsurance";
    patientNumber: any;
    patientName: string = "";

    constructor(
        public requestService: RequestService
    ) { }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) {
            url += `&filterBy=${filterBy} and patientNumber=${this.patientNumber}`;
        } else {
            url += `&filterBy=patientNumber=${this.patientNumber}`;
        }
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    public get(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/`+id);
    }

    public update(id: any, patientMedicalInsurance: any): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${id}`, patientMedicalInsurance);
    }

    public add(patientMedicalInsurance: any): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, patientMedicalInsurance);
    }

    public delete(id: number): Observable<any> {
        return this.requestService.delete(`${this.baseUrl}/${id}`);
    }
}