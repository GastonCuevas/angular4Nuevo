import { Injectable } from '@angular/core';
import { RequestService } from './../+core/services';
import { Observable } from 'rxjs/Observable';
import { Cube } from '../models';
import { ISort } from '../interface';
import * as moment from 'moment';

@Injectable()
export class CubeService {

    baseUrl = "api/cube";
    selectedCube: Cube;
    isLoad = false;

    constructor(
        private requestService: RequestService
    ) {}

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
        // return this.requestService.get(url).map(response => {
        //     let dataSource: Array<Cube> = response.model;
        //     dataSource.forEach(item => {
        //         item.dateFrom = item.dateFrom ? item.dateFrom.substr(0,10) : '' ;
        //         item.dateTo = item.dateTo ? item.dateTo.substr(0,10) : '' ;
        //     });
        //     response.model = dataSource;
        //     return response;
        // });
    }
    public insert(data: any): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, data);
    }
    public update(data: any): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${data.number}`, data);
    }
    public delete(number: any): Observable<any> {
        return this.requestService.delete(`${this.baseUrl}/${number}`);
    }

    getCombo(): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/combo`);
    }

    getDataBy(query: any): Observable<any> {
        return this.requestService.post(`${this.baseUrl}/data`, query);
    }
    getCubesCombo(){
        return this.requestService.get(`${this.baseUrl}`);
    }
    // saveCube(cube: Cube): Observable<any>{
    //     return this.requestService.post(`${this.baseUrl}/cube`, cube);
    // }
}
