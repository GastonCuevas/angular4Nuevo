import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import { RequestService } from './../+core/services/request.service';
import { ISort } from '../interface';

@Injectable()
export class PatientResponsibleService {
	baseUrl: string = "api/patientResponsible";
	patientId: number;
	
    constructor(
        private requestService: RequestService
    ) { }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `api/responsiblePatient?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    public get(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/`+id);
	}

	public save(patientResponsible: any, id: any): Observable<any> {
		return !!id ? this.update(id, patientResponsible) : this.insert(patientResponsible);
	}

	public update(id: any, patientResponsible: any): Observable<any> {
		return this.requestService.put(`${this.baseUrl}/${id}`, patientResponsible);
	}

	public insert(patientResponsible: any): Observable<any> {
		return this.requestService.post(`${this.baseUrl}`, patientResponsible);
	}

    public delete(id: number): Observable<any> {
        return this.requestService.delete(`${this.baseUrl}/${id}`);
    }

	public checkDuplicates(type: any, value: string, id: any): Observable<any> {
		if (typeof (type) == 'number') type = type.toString();
		if (!!type && !!value)
			return this.requestService.get(`${this.baseUrl}/check-duplicates?type=${type}&value=${value}&account=${id}`);
		return Observable.empty();
	}
}




