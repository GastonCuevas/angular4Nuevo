import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '../+core/services';
import { Paginator, Sort } from '../+shared/util';

@Injectable()
export class SystemLogService {
  baseUrl = 'api/Export';
  constructor(private requestService: RequestService) { }

  getSystemLogs(paginator: Paginator, sort?: Sort): Observable<any> {
    let url = `${this.baseUrl}/exportlogs?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`;
    if (sort) url += `&ascending=${sort.ascending}`;
    return this.requestService.get(url);
  }

  getLogByName(name: string) {
    let url = `${this.baseUrl}/log?name=${name}`;
    return this.requestService.get(url);
  }
}
