import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RequestService } from './../+core/services/request.service';
import { Sort, IColumn } from '../+shared/util';
import { PharmacyScheme } from '../models/pharmacy-scheme.model';
import { ISort } from '../interface/sort.interface';

@Injectable()
export class HcEvolutionPharmacyService {
    baseUrl: string = "api/hcEvolutionPharmacy";
    schemesList = new Array<PharmacyScheme>();
    isNew = false;
    scheme: PharmacyScheme;
    hcId: number;

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
        if (this.isNew) return Observable.of({ model: this.schemesList });
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}&filterBy=hcId=${this.hcId}`;
        if (filterBy) url += ` and ${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    getArticles(): Observable<any> {
        return this.requestService.get('api/hcEvolution/articles/combo');
    }

    save(pharmacyScheme: PharmacyScheme): boolean {
        return !pharmacyScheme.idCode ? this.add(pharmacyScheme) : this.update(pharmacyScheme);
    }

    add(pharmacyScheme: PharmacyScheme): boolean {
        pharmacyScheme.idCode = pharmacyScheme.articleCode;
        this.schemesList.push(pharmacyScheme);
        return true;
    }

    update(pharmacyScheme: PharmacyScheme) {
        const index = this.schemesList.findIndex((d: PharmacyScheme) => d.idCode == pharmacyScheme.idCode);
        if (index === -1) return false;
        pharmacyScheme.idCode = pharmacyScheme.articleCode;
        this.schemesList[index] = pharmacyScheme;
        return true;
    }

    delete(id: string): boolean {
        const index = this.schemesList.findIndex((d: PharmacyScheme) => d.idCode === id);
        if (index === -1) return false;
        this.schemesList.splice(index, 1);
        return true;
    }

    setSchemesList(schemes?: Array<PharmacyScheme>) {
        this.schemesList = schemes || new Array<PharmacyScheme>();
        this.schemesList.forEach((d: PharmacyScheme) => d.idCode = d.articleCode);
    }

    exists(pharmacyScheme: PharmacyScheme): boolean {
        return this.schemesList.some((d: PharmacyScheme) => d.articleCode == pharmacyScheme.articleCode && d.idCode != pharmacyScheme.idCode);
    }
    
    insert(data: any): Observable<any> {
        return this.requestService.post(`${this.baseUrl}/selected`, data);
    }

	getMedicationWithStock(medicationConsumptionSelected: any): Observable<any> {
		return this.requestService.post(`${this.baseUrl}/stock`, medicationConsumptionSelected);
	}    
}
