import { Injectable } from '@angular/core';
import { ISort } from '../interface/index';
import { Observable } from 'rxjs/Observable';
import { RequestService } from '../+core/services/index';
import { IColumn } from '../interface/column.interface';
import { TreatingProfessional } from '../models/treating-professional.model';

@Injectable()
export class TreatingProfessionalService {

  baseUrl = 'api/TreatingProfessional';
  isNew: boolean = false;
  treatingProfessionalList: Array<TreatingProfessional> = new Array<TreatingProfessional>();
  treatingProfessional: TreatingProfessional = new TreatingProfessional();
  internmentId: number;
  isTreatingProfessionalArray: boolean = false;

  medicalInsuranceId: number;

  columns: Array<IColumn> = [
    { property: 'professionalName', header: 'Profesional', disableSorting: true },
  ];
  
  constructor(
    public requestService: RequestService
  ) { }

  public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
    return Observable.of({ model: this.treatingProfessionalList });
  }

  public getTreatingProfessionals(internmentId: number): Observable<any> {
    let url = `api/internment/treatingProfessionals/${this.internmentId}`;
    return this.requestService.get(url);
  }

  public get(id: any): Observable<any> {
    return this.requestService.get(`${this.baseUrl}/${id}`);
  }

  save(professional: TreatingProfessional): boolean {
    return this.isNew ? this.add(professional) : this.update(professional);
  }

  add(treatingProfessional: TreatingProfessional): boolean {
    treatingProfessional.professionalId = treatingProfessional.professionalId;
    this.treatingProfessionalList.push(treatingProfessional);
    return true;
  }

  update(treatingProfessional: TreatingProfessional) {
    const index = this.treatingProfessionalList.findIndex((d: TreatingProfessional) => d.id == treatingProfessional.id);
    if (index === -1) return false;
    this.treatingProfessionalList[index] = treatingProfessional;
    return true;
  }

  delete(professionalId: number): boolean {
    const index = this.treatingProfessionalList.findIndex((d: TreatingProfessional) => d.professionalId == professionalId);
    if (index === -1) return false;
    this.treatingProfessionalList.splice(index, 1);
    return true;
  }

  setTreatingProfessionalList(treatingProfessionals?: Array<TreatingProfessional>) {
    this.treatingProfessionalList = treatingProfessionals || new Array<TreatingProfessional>();
  }

  exists(treatingProfessional: TreatingProfessional): boolean {
    return this.treatingProfessionalList.some((d: TreatingProfessional) => d.professionalId == treatingProfessional.professionalId);
  }

  resetService() {
    this.treatingProfessional = new TreatingProfessional();
		this.treatingProfessionalList = new Array<TreatingProfessional>();
		this.isNew = false;
	}
}