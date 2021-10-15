import { Injectable } from '@angular/core';
import { RequestService } from '../+core/services/request.service';
import { ISort } from '../interface/sort.interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WardSectorService {

  baseUrl = "api/wardSector"
  
  constructor(
    private requestService: RequestService
  ) { }

  public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
    let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
    if (filterBy) url += `&filterBy=${filterBy}`;
    if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
    return this.requestService.get(url);
  }

  public getById(number: any): Observable<any> {
    return this.requestService.get(`${this.baseUrl}/${number}`);
  }

  public update(data: any): Observable<any> {
    return this.requestService.put(`${this.baseUrl}/${data.number}`, data);
  }

  public insert(data: any): Observable<any> {
    return this.requestService.post(`${this.baseUrl}`, data);
  }

  public delete(number: any): Observable<any> {
    return this.requestService.delete(`${this.baseUrl}/${number}`);
  }
}
