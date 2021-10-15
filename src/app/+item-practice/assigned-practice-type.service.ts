import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { RequestService } from '../+core/services/request.service';
import { ISort } from '../interface';
import { ItemPractice } from '../models/item-practice.model';
import { AssignedPracticeType } from '../models/assigned-practice-type.model';

@Injectable()
export class AssignedPracticeTypeService {
  public baseUrl: string = "api/assignedPracticeType";
  practices: ItemPractice = new ItemPractice();
  newPractices: Array<AssignedPracticeType> = new Array<AssignedPracticeType>();
  itemPracticeNumber: number = 0;
  isNewPractice: boolean = false;

  constructor(
    public requestService: RequestService
  ) { }

  public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
    let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
    if (filterBy) {
        url += `&filterBy=${filterBy} and itemPracticeNumber=${this.itemPracticeNumber}`;
    } else {
        url += `&filterBy=itemPracticeNumber=${this.itemPracticeNumber}`;
    }
    if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
    return this.requestService.get(url);
  }

  public getAllItems(practiceTypeNumber: number): Observable<any> {
    let url = `${this.baseUrl}/items/${practiceTypeNumber}`
    return this.requestService.get(url);
  }

  public get(id: any): Observable<any> {
    return this.requestService.get(`${this.baseUrl}/`+id);
  }

  public insert(assignedPractice: any): Observable<any> {
    return this.requestService.post(`${this.baseUrl}`, assignedPractice);
  }

  public update(id: any, assignedPractice: any): Observable<any> {
    return this.requestService.put(`${this.baseUrl}/${id}`, assignedPractice);
  }

  public delete(itemPractice: number, practiceType: number): Observable<any> {
    return this.requestService.delete(`${this.baseUrl}/${itemPractice}/${practiceType}`);
  }
}
