import { Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { RequestService } from '../+core/services';
import { ISort } from '../interface';
import { IColumn } from '../+shared/util';
import { ImportDataField } from '../models/import-data-field';

@Injectable()
export class ImportFieldService {

    baseUrl = "api/ImportField"

    columns: Array<IColumn> = [
        { header: 'Orden', property: 'index' },
        { header: 'Nombre', property: 'name' },
        { header: 'Relacion', property: 'relation', disableSorting: true },
    ];
    importId: number = 0;
    tableName: string;
    fields = new Array<any>();
    constructor(
        private requestService: RequestService
    ) { }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) {
            url += `&filterBy=${filterBy} and importId=${this.importId}`;
        } else {
            url += `&filterBy=importId=${this.importId}`;
        }

        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    public get(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/` + id);
    }

    public add(importField: any): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, importField);
    }

    public update(id: any, importField: any): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${id}`, importField);
    }

    public delete(id: any): Observable<any> {
        return this.requestService.delete(`${this.baseUrl}/${id}`);
    }

    getByTable(table: string): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/all/${table}`).map(response => {
            const dataSource: Array<any> = response.model;
            dataSource.forEach(element => {
                element['relation'] = element.key ? 'CLAVE PRIMARIA' : element.foreignKey ? 'CLAVE FORANEA' : '';
                element['number'] = element.name;
            });
            response.model = dataSource;
            return response;
        });
    }
}
