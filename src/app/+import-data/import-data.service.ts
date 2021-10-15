import { Injectable } from '@angular/core';
import { RequestService } from '../+core/services';
import { Observable } from 'rxjs/Observable';
import { ISort } from '../interface';

@Injectable()
export class ImportDataService {

  baseUrl = "api/ImportData"
  isNew: boolean;
  constructor(
    private requestService: RequestService
  ) { }

  public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
    let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
    if (filterBy) url += `&filterBy=${filterBy}`;
    if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
    return this.requestService.get(url);
  }

  public get(id: number): Observable<any> {
      return this.requestService.get(`${this.baseUrl}/`+id);
  }

  public getCombo(): Observable<any> {
    return this.requestService.get(`${this.baseUrl}/combo`);
  }

  public add(importation: any): Observable<any> {
      return this.requestService.post(`${this.baseUrl}`, importation);
  }

  public update(id: any, exportation: any): Observable<any> {
      return this.requestService.put(`${this.baseUrl}/${id}`, exportation);
  }

  public uploadFile(data: any): Observable<any> {
    return this.requestService.upFileServer(`${this.baseUrl}/import`, data);
  }

  public runImport(data: FormData): Observable<any> {
    return this.requestService.postFormData(`${this.baseUrl}/runImport`, data);
  }

  public delete(id: number): Observable<any> {
      return this.requestService.delete(`${this.baseUrl}/${id}`);
  }

  public getTablesList(){
    return this.requestService.get(`${this.baseUrl}/tables`);
  }
}
