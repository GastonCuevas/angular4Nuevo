import { Injectable } from '@angular/core';
import { RequestService } from '../+core/services/request.service';
import { Observable } from 'rxjs/Observable';
import { Sort, Paginator } from '../+shared/util';

import * as moment from 'moment';

@Injectable()
export class HolidayService {

    baseUrl = 'api/holiday';

    constructor(
        private requestService: RequestService
    ) {}

    getAll(paginator: Paginator, filterBy?: any, sort?: Sort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    getAllWithOutPaged(filterBy?: any): Observable<any> {
        let url = `${this.baseUrl}/all?`
        if (filterBy) url += `&filterBy=${filterBy}`;
        return this.requestService.get(url);
    }

    get(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/`+id);
    }

    insert(holiday: any): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, holiday);
    }

    update(id: any, holiday: any): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${id}`, holiday);
    }

    delete(id: number): Observable<any>{
        return this.requestService.delete(`${this.baseUrl}/${id}`);
    }

}
