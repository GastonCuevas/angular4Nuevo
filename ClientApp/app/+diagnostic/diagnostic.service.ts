import { Injectable } from '@angular/core';
import { RequestService } from './../+core/services';
import { Observable } from 'rxjs/Observable';
import { GenericControl } from '../+shared';
import { IColumn, Paginator, Sort, AbstractServiceBase } from '../+shared/util';
import { Diagnostic } from '../models';

@Injectable()
export class DiagnosticService extends AbstractServiceBase {

    baseUrl = "api/diagnostic";
    columns: IColumn[] = [
        { header: "Código", property: "code" },
        { header: "Descripción", property: "name", searchProperty: "description" }
    ];
    controlsToFilter: GenericControl[];
    constructor(private requestService: RequestService) {
        super();
        this.reset();
    }

    getAll(paginator: Paginator, filterBy?: any, sort?: Sort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`;
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    getById(id: number): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/${id}`);
    }

    update(data: Diagnostic): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${data.number}`, data);
    }

    insert(data: Diagnostic): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, data);
    }

    delete(id: number): Observable<any> {
        return this.requestService.delete(`${this.baseUrl}/${id}`);
    }

    uploadFile(data: any): Observable<any> {
        return this.requestService.upFileServer(`${this.baseUrl}/import`, data);
    }

    reset() {
        this.controlsToFilter = [
            { key: 'code', label: 'Código', type: 'text', class: 'col s12 m6' },
            { key: 'description', label: 'Descripción', type: 'text', class: 'col s12 m6' }
        ];
    }
}
