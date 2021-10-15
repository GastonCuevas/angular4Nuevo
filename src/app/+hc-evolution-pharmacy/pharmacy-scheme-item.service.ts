import { Injectable } from '@angular/core';
import { IColumn } from '../interface/column.interface';
import { RequestService } from '../+core/services/request.service';
import { ISort } from '../interface/sort.interface';
import { Observable } from 'rxjs/Observable';
import { PharmacyScheme } from '../models/pharmacy-scheme.model';

@Injectable()
export class PharmacySchemeItemService {
	baseUrl: string = "api/pharmacyScheme";
	HcSchemeId: number = 0;
	isPharmacyShemeArray: boolean = false;
	newPharmacySchemes: Array<PharmacyScheme> = new Array<PharmacyScheme>();
	pharmacyScheme: PharmacyScheme;
	columns = [
        { header: 'Codigo', property: 'articleCode', disableSorting: true },
        { header: 'Nombre', property: 'articleName', disableSorting: true },
        { header: 'Cantidad', property: 'quantity', disableSorting: true }
	];

	constructor(
		public requestService: RequestService
	) { }

	public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
		if (this.isPharmacyShemeArray) return Observable.of({ model: this.newPharmacySchemes });
		let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}&filterBy=HcSchemeId=${this.HcSchemeId}`;
		if (filterBy) url += ` and ${filterBy}`;
		if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
		return this.requestService.get(url);
	}

	public get(id: any): Observable<any> {
		return this.requestService.get(`${this.baseUrl}/` + id);
	}

	public save(pharmacyScheme: PharmacyScheme): Observable<any> {
		return !pharmacyScheme.id ? this.add(pharmacyScheme) : this.update(pharmacyScheme.id, pharmacyScheme);
	}

	public add(pharmacyScheme: PharmacyScheme): Observable<any> {
		if (!this.isPharmacyShemeArray) return this.requestService.post(`${this.baseUrl}`, pharmacyScheme);
		pharmacyScheme.id = parseInt(pharmacyScheme.articleCode);
		this.newPharmacySchemes.push(pharmacyScheme);
		return Observable.of(this.newPharmacySchemes);
	}

	public update(id: any, pharmacyScheme: PharmacyScheme): Observable<any> {
		if (!this.isPharmacyShemeArray) return this.requestService.put(`${this.baseUrl}/${id}`, pharmacyScheme);
		pharmacyScheme.id = parseInt(pharmacyScheme.articleCode);
		const index = this.newPharmacySchemes.findIndex((d: PharmacyScheme) => d.id == id);
		if (index != -1) this.newPharmacySchemes[index] = pharmacyScheme;
		return Observable.of(this.newPharmacySchemes);
	}

	public delete(id: any): Observable<any> {
		if (!this.isPharmacyShemeArray) return this.requestService.delete(`${this.baseUrl}/${id}`);
		const index = this.newPharmacySchemes.findIndex((d: PharmacyScheme) => d.id == id);
		if (index != -1) this.newPharmacySchemes.splice(index, 1);
		return Observable.of(this.newPharmacySchemes);
	}

	public find(id: any): PharmacyScheme | undefined {
		return this.newPharmacySchemes.find((d: PharmacyScheme) => d.id == id);
	}

	public exists(pharmacyScheme: PharmacyScheme): boolean {
		return this.newPharmacySchemes.some((d: PharmacyScheme) => d.articleCode == pharmacyScheme.articleCode && d.id != pharmacyScheme.id)
	}

	public getSchemeItems (schemeId: any, date: any): Observable<any> {
		return this.requestService.get(`${this.baseUrl}/scheme?schemeId=${schemeId}&date=${date}`);
		//this.requestService.get(`api/locality/combo?country=${countryId}&province=${provinceId}`)
	}
}
