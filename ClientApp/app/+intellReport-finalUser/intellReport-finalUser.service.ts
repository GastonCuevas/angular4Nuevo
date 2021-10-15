import { Injectable } from '@angular/core';
import { RequestService } from './../+core/services/request.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IntellReportUserService {
    handleError: any;
  baseUrl = "api/export"

  constructor(
    private requestService: RequestService
  ) { }

  public getAllTypesReport(): Observable<any> {
      return this.requestService.get(`${this.baseUrl}/combo`);
  }
  public getInputData(num: string): Observable<any> {
      return this.requestService.get(`api/exportentry?filterBy=ExpedientNumber=${num}`);
  }

  public getEntryTypes(): Observable<any> {
      return this.requestService.get(`api/exportentry/entryTypes`);
  }

  public getResultQuery(query: any): Observable<any> {
      return this.requestService.post(`${this.baseUrl}/`+'dynamiclist', query);
  }

  public getAll(paginator: any, filterBy?: any, sqlParameters?: any): Observable<any> {
      sqlParameters.pageNumber = paginator.currentPage;
      sqlParameters.pageSize = paginator.pageSize;
      return this.requestService.post(`${this.baseUrl}/` + 'pagedlist', sqlParameters);
  }

  public downloadToExcel(query: any): Observable<any> {
      return this.requestService.post(`${this.baseUrl}/` + 'toexcel', query)
  }

  public sendToEmail(dd: any): Observable<any>{
      return this.requestService.post(`api/email`, dd)
  }

  public getByIdExportationDetail(id: any): Observable <any> {
    return this.requestService.get(`api/exportdetail/`+id);
  }

    getExporDetailBy(id: number): Observable <any> {
        return this.requestService.get(`api/exportdetail/${id}`);
    }

    getResultBy(query: any): Observable<any> {
        return this.requestService.post(`${this.baseUrl}/dynamicReport`, query);
    }
}
