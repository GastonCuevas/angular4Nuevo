import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RequestService } from '../+core/services/request.service';

@Injectable()
export class BedMovementService {

  baseUrl = 'api/bedMovement';
  public professionalId: any = 0;

  constructor(
    private requestService: RequestService
  ) { }

  public getAll(paginator: any, filterBy?: any): Observable<any> {
    let url = `${this.baseUrl}/filter?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
    if (filterBy) url += `&filterBy=${filterBy}`;
    return this.requestService.get(url);
  }

  public getBedCardById(id: any): Observable<any> {
    return this.requestService.get(`${this.baseUrl}/bedCard/${id}`);
  }
}
