import { Injectable } from '@angular/core';
import { RequestService } from '../+core/services/request.service';
import { Observable } from 'rxjs/Observable';

import { ISort, IPaginator } from '../interface';

import { Column, Sort, ElementFilter, EntityPropertyTable, GenericObject, Property, ControlType } from './util';

@Injectable()
export class DynamicViewService {

    public baseUrl: string = "/api/generic";

    constructor(
        private requestService: RequestService
    ) {
    }

    public getAll(tableName: string, paginator: IPaginator, filterBy?: string, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}/paginate2?tableName=${tableName}&pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${tableName}.${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    public add(genericObject: GenericObject): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, genericObject);
    }

    public update(genericObject: GenericObject, id: number ) {
        return this.requestService.put(`${this.baseUrl}/${id}`, genericObject);
    }

    public delete(tableName: string, useCase: string, id: number) {
        return this.requestService.delete(`${this.baseUrl}/${tableName}/${useCase}/${id}`);
    }

    public getGeneric(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/${id}`);
    }

    public getEntityPropertiesBy(tableName: string): Observable<any>  {
        let url = `api/entityProperty?filterBy=TableName="${tableName}"`;
        return this.requestService.get(url);
    }

    public getComboBy(tableName: string, foraignKey: string , foraignField: string): Observable<any>  {
        let url = `${this.baseUrl}/customcombo/${tableName}?foraignKey=${foraignKey}&foraignField=${foraignField}`;
        return this.requestService.get(url);
    }

}