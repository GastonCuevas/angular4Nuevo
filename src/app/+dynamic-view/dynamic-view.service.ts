import { Injectable } from '@angular/core';
import { RequestService } from '../+core/services/request.service';
import { Observable } from 'rxjs/Observable';
import { ISort } from '../interface';

@Injectable()
export class DynamicViewService {

    public baseUrl: string = "/api/generic";

    constructor(
        private requestService: RequestService
    ) {
    }

    public add(tableName: any, useCase: any, object: any): Observable<any> {
        return this.requestService.post(`${this.baseUrl}/${tableName}/${useCase}`, object);//save
    }

    public delete(tableName: any, useCase: any, id: any) {
        return this.requestService.delete(`${this.baseUrl}/${tableName}/${useCase}/${id}`);
    }

    public update(tableName: any, useCase: any, id: any, object: any) {
        return this.requestService.put(`${this.baseUrl}/${tableName}/${useCase}/${id}`, object);//update
    }

    public getAll(tableName: any, paginator: any, propertyName?: string, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}/paginate?tableName=${tableName}&pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (propertyName) url += `&propertyName=${propertyName}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    public getGeneric(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/${id}`);
    }

}