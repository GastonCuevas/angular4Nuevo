import { Injectable } from '@angular/core';
import { ISort } from '../interface/index';
import { Observable } from 'rxjs/Observable';
import { RequestService } from '../+core/services/index';
import { HcEvolution } from '../models/hc-evolution.model';
import { PharmacyScheme } from '../models/pharmacy-scheme.model';
import { IColumn } from '../interface/column.interface';

@Injectable()
export class HcEvolutionService {

  baseUrl = 'api/hcEvolution';
  patientMovementId: number = 0;
  hcEvolutionList: Array<HcEvolution> = new Array<HcEvolution>();
  hcEvolution: HcEvolution = new HcEvolution();
  pharmacySchemeList: Array<PharmacyScheme> = new Array<PharmacyScheme>();
  isNew: boolean = false;
  readonly: boolean = false;
  isEvolutionArray: boolean = false;
  medicalInsuranceId: number;
	columns: Array<IColumn> = [
    { property: 'date', header: 'Fecha', type: 'date', searchProperty: 'date', disableSorting: true},
    { property: 'specialtyName', header: 'Especialidad', searchProperty: 'specialty.description', disableSorting: true },
    { property: 'professionalName', header: 'Profesional', searchProperty: 'professional.professionalAccount.name', disableSorting: true },
    { property: 'practiceName', header: 'Práctica', searchProperty: 'practiceId', disableSorting: true }
  ];
  
  constructor(
    public requestService: RequestService
  ) { }

  public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
    if (this.isEvolutionArray) return Observable.of({ model: this.hcEvolutionList });
    let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}&filterBy=patientMovementId=${this.patientMovementId}`;
    if (filterBy) url += ` and ${filterBy}`;
    if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
    return this.requestService.get(url);
  }

  public get(id: any): Observable<any> {
    return this.requestService.get(`${this.baseUrl}/${id}`);
  }

  save(hcEvolution: HcEvolution): boolean {
    return this.isNew ? this.add(hcEvolution) : this.update(hcEvolution);
  }

  add(hcEvolution: HcEvolution): boolean {
    hcEvolution.practiceId = hcEvolution.practiceId;
    this.hcEvolutionList.push(hcEvolution);
    return true;
  }

  update(hcEvolution: HcEvolution) {
    const index = this.hcEvolutionList.findIndex((d: HcEvolution) => d.id == hcEvolution.id);
    if (index === -1) return false;
    this.hcEvolutionList[index] = hcEvolution;
    return true;
  }

  delete(id: number): boolean {
    const index = this.hcEvolutionList.findIndex((d: HcEvolution) => d.id == id);
    if (index === -1) return false;
    this.hcEvolutionList.splice(index, 1);
    return true;
  }

  setEvolutionList(hcEvolution?: Array<HcEvolution>) {
    this.hcEvolutionList = hcEvolution || new Array<HcEvolution>();
    this.hcEvolutionList.forEach((d: HcEvolution) => d.practiceId = d.practiceId);
  }

  exists(hcEvolution: HcEvolution): boolean {
    return this.hcEvolutionList.some((d: HcEvolution) => d.practiceId == hcEvolution.practiceId && d.id != hcEvolution.id);
  }
}

