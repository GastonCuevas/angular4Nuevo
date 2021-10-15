import { Injectable } from '@angular/core';
import { RequestService } from '../+core/services/request.service';
import { ISort } from '../interface/sort.interface';
import { Observable } from 'rxjs/Observable';
import { IColumn } from '../interface/column.interface';

@Injectable()
export class HcEvolutionSchemeService {

  baseUrl = 'api/hcEvolution';
  readonly = false;
  patientMovementId: number;
  isNew: boolean;
	columns: Array<IColumn> = [
    { header: 'Id', property: "id", searchProperty: "patMov.numint", disableSorting: true },
		{ header: 'Fecha', property: "date", type: "date", searchProperty: "date", disableSorting: true },
		{ header: 'Profesional', property: "professionalName", searchProperty: "diagnostic.description", disableSorting: true },
		{ header: 'Especialidad', property: "specialtyName", disableSorting: true }
  ];
  
  constructor(
    private requestService: RequestService
  ) { }

  public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
    let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}&filterBy=patientMovementId=${this.patientMovementId}`
    if (filterBy) url += ` and ${filterBy}`;
    if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
    return this.requestService.get(url);
  }

  public get(id: any): Observable<any> {
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
