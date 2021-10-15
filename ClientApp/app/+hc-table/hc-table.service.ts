import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService } from './../+core/services/request.service';
import { ISort } from '../interface';

@Injectable()
export class HcTableService {

  public baseUrl: string = "api/hcTable";

  constructor(
    private requestService: RequestService
  ) { }

  public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
    let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
    if (filterBy) url += `&filterBy=${filterBy}`;
    if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
    return this.requestService.get(url);
  }
  
  public getCombo(): Observable<any> {
    return this.requestService.get(`${this.baseUrl}/combo`);
  }

  public get(id: any): Observable<any> {
    return this.requestService.get(`${this.baseUrl}/`+id);
  }

  public add(hcTable: any): Observable<any> {
      return this.requestService.post(`${this.baseUrl}`, hcTable);
  }

  public update(id: any, hcTable: any): Observable<any> {
      return this.requestService.put(`${this.baseUrl}/${id}`, hcTable);
  }

  public delete(id: number): Observable<any>{
      return this.requestService.delete(`${this.baseUrl}/${id}`);
  }
}
