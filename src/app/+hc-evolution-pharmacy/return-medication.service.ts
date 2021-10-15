import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RequestService } from './../+core/services/request.service';
import { Sort, IColumn } from '../+shared/util';
import { PharmacyScheme } from '../models/pharmacy-scheme.model';
import { ISort } from '../interface/sort.interface';

@Injectable()
export class ReturnMedicationService {

  baseUrl: string = "api/PharmacyScheme";
  schemesList = new Array<PharmacyScheme>();
  isFirstTime = false;
  scheme: PharmacyScheme;
  internmentId: number;

  columns: Array<IColumn> = [
    { header: 'Codigo', property: 'articleCode', disableSorting: true },
    { header: 'Nombre', property: 'articleName', disableSorting: true },
    { header: 'Cantidad', property: 'quantity', disableSorting: true },
    { header: 'Observacion', property: 'observation', disableSorting: true }
  ];

  constructor(
    private requestService: RequestService
  ) {
  }

  public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
    if (!this.isFirstTime) return Observable.of({ model: this.schemesList });
    let url = `${this.baseUrl}/medications/${this.internmentId}?`;
    return this.requestService.get(url)
    .map(response => {
      this.schemesList = response.model;
      return response;
    });
  }

  update(pharmacyScheme: PharmacyScheme) {
    const index = this.schemesList.findIndex((d: PharmacyScheme) => d.articleCode == pharmacyScheme.articleCode);
    if (index === -1) return false;
    pharmacyScheme.idCode = pharmacyScheme.articleCode;
    this.schemesList[index] = pharmacyScheme;
    return true;
  }

  delete(id: string): boolean {
    const index = this.schemesList.findIndex((d: PharmacyScheme) => d.articleCode === id);
    if (index === -1) return false;
    this.schemesList.splice(index, 1);
    return true;
  }

  insert(data: any): Observable<any> {
    return this.requestService.post(`api/hcEvolutionPharmacy/range`, data);
  }
}
