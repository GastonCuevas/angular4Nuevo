import { Injectable } from '@angular/core';
import { RequestService } from './../+core/services/request.service';
import { ISort } from '../interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ReportUseCaseService {
    baseUrl: string = 'api/usecase/report';
    
    constructor(
        public requestService: RequestService
    ) { }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    public get(code: any): Observable<any> {
        return this.requestService.get(`api/usecase/report/${code.replace("#","%23")}`);
    }

    public update(config: any, code: any): Observable<any> {
        return this.requestService.put(`api/usecase/${code.replace("#","%23")}/${config}`);
    }
}