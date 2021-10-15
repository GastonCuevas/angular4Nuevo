import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService } from './../+core/services/request.service';
import { ISort } from '../interface';

@Injectable()
export class MedicalInsuranceService {

    public baseUrl: string = "api/medicalInsurance";

    constructor(
        private requestService: RequestService
    ) { }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    public get(id: number): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/${id}`);
    }

    public getDefault(): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/default`);
    }

    public save(medicalIsurance: any): Observable<any> {
        return !!medicalIsurance.accountNumber ? this.update(medicalIsurance) : this.insert(medicalIsurance);
    }

    public update(medicalIsurance: any): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${medicalIsurance.accountNumber}`, medicalIsurance);
    }

    public insert(medicalIsurance: any): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, medicalIsurance);
    }

    public delete(medicalIsuranceId: number): Observable<any> {
        return this.requestService.delete(`${this.baseUrl}/${medicalIsuranceId}`);
	}

	public checkDuplicates(type: any, value: string, id: any): Observable<any> {
		if (typeof (type) == 'number') type = type.toString();
		if (!!type && !!value)
			return this.requestService.get(`${this.baseUrl}/check-duplicates?type=${type}&value=${value}&account=${id}`);
		return Observable.empty();
	}
}
