import { Injectable } from '@angular/core';
import { RequestService } from '../+core/services/request.service';
import { Observable } from 'rxjs/Observable';
import { ISort } from '../interface';

@Injectable()
export class HcTableItemService {

  public baseUrl: string = "api/hcTableItem";
  hcTableNumber: number = 0;

  constructor(
    private requestService: RequestService
  ) { }

  public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
    let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
    if (filterBy) {
      url += `&filterBy=${filterBy} and hcTableNumber=${this.hcTableNumber}`;
    } else {
        url += `&filterBy=hcTableNumber=${this.hcTableNumber}`;
    }
    if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
    return this.requestService.get(url);
  }
  public get(id: any): Observable<any> {
    return this.requestService.get(`${this.baseUrl}/`+id);
  }

  public add(itemPractice: any): Observable<any> {
      return this.requestService.post(`${this.baseUrl}`, itemPractice);
  }

  public update(id: any, itemPractice: any): Observable<any> {
      return this.requestService.put(`${this.baseUrl}/${id}`, itemPractice);
  }

  public delete(id: number): Observable<any>{
      return this.requestService.delete(`${this.baseUrl}/${id}`);
  }
}
