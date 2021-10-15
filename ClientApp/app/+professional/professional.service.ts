import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService } from './../+core/services/request.service';
import { ISort } from '../interface';

@Injectable()
export class ProfessionalService {
    public baseUrl: string = "/api/professional";

    constructor(
        private requestService: RequestService
    ) { }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    public getProfessional(id: any): Observable<any> {
		return this.requestService.get(`${this.baseUrl}/${id}`)
		.map(response => {
			let item = response.model;
			item.professionalAccount.fullname = item.professionalAccount.name;
			const names:string[] = item.professionalAccount.name.split(',');
            item.professionalAccount.surname = names.length?names[0].trim():'';
			item.professionalAccount.name = names.length > 1 ? names[1].trim() : '';
            response.model = item;
            return response;
        });
	}

	public save(professional: any): Observable<any> {
		return !!professional.account ? this.update(professional.account, professional) : this.insert(professional);
	}

	public update(id: any, professional: any): Observable<any> {
		return this.requestService.put(`${this.baseUrl}/${id}`, professional);
	}

	public insert(professional: any): Observable<any> {
		return this.requestService.post(`${this.baseUrl}`, professional);
	}

	public delete(id: any): Observable<any> {
		return this.requestService.delete(`${this.baseUrl}/${id}`);
	}

	public checkDuplicates(type: any, value: string, id: any): Observable<any> {
		if (typeof (type) == 'number') type = type.toString();
		if (!!type && !!value)
			return this.requestService.get(`${this.baseUrl}/check-duplicates?type=${type}&value=${value}&account=${id}`);
		return Observable.empty();
	}
}
