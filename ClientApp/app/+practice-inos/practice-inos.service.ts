import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import { RequestService } from './../+core/services/request.service';
import { ISort } from '../interface';

@Injectable()
export class PracticeInosService {
    baseUrl: string = "api/inospractice";

    constructor(
        private requestService: RequestService
    ) { }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    public get(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/`+id);
    }

    public update(id: any, practiceInos: any): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${id}`, practiceInos);
    }

    public add(practiceInos: any): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, practiceInos);
    }

    public delete(id: number): Observable<any> {
        return this.requestService.delete(`${this.baseUrl}/${id}`);
    }

    public import(file:any) : Observable<any> {
        return this.requestService.upFileServer(`${this.baseUrl}/`+"import",file);
	}
}