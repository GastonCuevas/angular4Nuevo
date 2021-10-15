import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService } from './../+core/services/request.service';
import { ISort } from '../interface';
import { PatientFilter } from '../models/patient-filter.model';
import { UtilityService } from '../+core/services';
import { IColumn } from '../+shared/util';

@Injectable()
export class PatientService {
	baseUrl: string = "api/patient";
	account: number;
	columnsDiagnostic: Array<IColumn> = [
		{ header: 'Diagnóstico', property: "name", searchProperty: "diagnostic.description", disableSorting: true },
		{ header: 'Fecha', property: "date", type: 'date', disableSorting: true },
		{ header: 'Jerarquía', property: "hierarchy", disableSorting: true }
	];
	constructor(
		private requestService: RequestService,
		private _utilityService: UtilityService
	) { }

	public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
		let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
		if (filterBy) url += `&filterBy=${filterBy}`;
		if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
		return this.requestService.get(url)
			.map(response => {
				let dataSource: Array<any> = response.model;
				dataSource.forEach(item => {
					item.years = item.birthdate ? this._utilityService.getYearOld(item.birthdate.toString(), "YYYY-MM-DD") + ' Años' : 'Sin Datos';
				});
				response.model = dataSource;
				return response;
			});
	}

	public getAllPacientes(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
		let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
		if (filterBy) url += `&filterBy=${filterBy}`;
		if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
		return this.requestService.get(url)
			.map(response => {
				let dataSource: Array<PatientFilter> = response.model;
				dataSource.forEach(item => item.estado = item.state ? 'Internado' : '');
				response.model = dataSource;
				return response;
			});
	}

	public get(id: number): Observable<any> {
		return this.requestService.get(`${this.baseUrl}/${id}`)
			.map(response => {
				let item = response.model;
				const names = item.account.name.split(',');
				item.account.surname = names.length ? names[0].trim() : '';
				item.account.name = names.length > 1 ? names[1].trim() : '';
				item.years = item.birthdate ? this._utilityService.getYearOld(item.birthdate.toString(), "YYYY-MM-DD") + ' Años' : 'Sin Datos';
				response.model = item;
				return response;
			});
	}

	public save(patient: any): Observable<any> {
		return !!patient.accountNumber ? this.update(patient.accountNumber, patient) : this.insert(patient);
	}

	public update(id: any, patient: any): Observable<any> {
		return this.requestService.put(`${this.baseUrl}/${id}`, patient);
	}

	public insert(patient: any): Observable<any> {
		return this.requestService.post(`${this.baseUrl}`, patient);
	}

	public delete(id: number): Observable<any> {
		return this.requestService.delete(`${this.baseUrl}/${id}`);
	}

	public checkDuplicates(type: any, value: string, id: any): Observable<any> {
		if (typeof (type) == 'number') type = type.toString();
		if (!!type && !!value)
			return this.requestService.get(`${this.baseUrl}/check-duplicates?type=${type}&value=${value}&account=${id}`);
		return Observable.empty();
	}

	public getDiagnostic(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
		return this.requestService.get(`${this.baseUrl}/diagnostic/` + this.account);
	}
}
