import { Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { RequestService } from '../+core/services';
import { ISort } from '../interface';
import { IColumn } from '../+shared/util';

@Injectable()
export class ImportFileService {

  baseUrl = "api/ImportFile"

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

  

  public getByImport(id: any): Observable<any> {
    return this.requestService.get(`${this.baseUrl}/import/`+id);
  }

  public add(importField: any): Observable<any> {
      return this.requestService.post(`${this.baseUrl}`, importField);
  }

  public update(id: any, importField: any): Observable<any> {
      return this.requestService.put(`${this.baseUrl}/${id}`, importField);
  }

  public delete(id: number): Observable<any> {
      return this.requestService.delete(`${this.baseUrl}/${id}`);
  }
}
