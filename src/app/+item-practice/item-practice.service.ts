import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService } from './../+core/services/request.service';
import { ISort } from '../interface';

@Injectable()
export class ItemPracticeService {

    public baseUrl: string = "api/itemPractice";

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

    public save(itemPractice: any): Observable<any> {
		return !!itemPractice.numint ? this.update(itemPractice.numint, itemPractice) : this.insert(itemPractice);
	}

    public insert(itemPractice: any): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, itemPractice);
    }

    public update(id: any, itemPractice: any): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${id}`, itemPractice);
    }

    public delete(id: number): Observable<any>{
        return this.requestService.delete(`${this.baseUrl}/${id}`);
    }
}