import { Injectable } from '@angular/core';
import { RequestService } from '../+core/services/request.service';
import { ISort } from '../interface/sort.interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BedService {

  baseUrl = "api/bed"

  constructor(
    private requestService: RequestService
  ) { }

  public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
    let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
    if (filterBy) url += `&filterBy=${filterBy}`;
    if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
    return this.requestService.get(url);
  }

  public getById(id: any): Observable<any> {
    return this.requestService.get(`${this.baseUrl}/${id}`);
  }

  public update(data: any): Observable<any> {
    return this.requestService.put(`${this.baseUrl}/${data.id}`, data);
  }

  public insert(data: any): Observable<any> {
    return this.requestService.post(`${this.baseUrl}`, data);
  }

  public delete(id: any): Observable<any> {
    return this.requestService.delete(`${this.baseUrl}/${id}`);
  }
}
