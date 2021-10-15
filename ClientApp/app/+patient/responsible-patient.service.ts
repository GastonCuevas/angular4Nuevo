import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService } from './../+core/services/request.service';
import { ISort } from '../interface';
import { PatientFilter } from '../models/patient-filter.model';
import { IColumn } from '../+shared/util';

@Injectable()
export class ResponsiblePatientService {
	baseUrl: string = "api/responsiblePatient";
	patientId: number;

	columns: Array<IColumn> = [
        { header: "Apellido y Nombre", property: "responsible.name", searchProperty: "responsible.name", disableSorting: true },
        { header: "Documento", property: "responsible.cuit", searchProperty: "responsible.cuit", disableSorting: true },
        { header: "Fecha de Nac.", property: "responsible.birthDate", searchProperty: "responsible.birthDate", type: 'date', disableSorting: true },
		{ header: "Direccion", property: "responsible.address", searchProperty: "responsible.address", disableSorting: true },
		{ header: "Vigente", property: "yesOrNo", disableSorting: true }
	];
	
	responsibleSearchColumns: Array<IColumn> = [
		{ header: 'Nombre', property: 'name', searchProperty: 'name', filterType: 'text' },
		{ header: 'Documento', property: 'cuit', searchProperty: 'cuit', filterType: 'text' },
        { header: 'Dirección', property: 'address', searchProperty: 'address', filterType: 'text', hideInMobile: true },
        { header: 'Estado', property: 'estado', disableSorting: true },
	];

	constructor(
		private requestService: RequestService
	) { }

	public get(id: number): Observable<any> {
		return this.requestService.get(`${this.baseUrl}/${id}`);
	}

	public save(responsible: any, isEdit: boolean): Observable<any> {
		return isEdit ? this.update(responsible.patientId, responsible.responsibleId, responsible) : this.insert(responsible);
	}

	public update(patientId: any, responsibleId: any, responsible: any): Observable<any> {
		return this.requestService.put(`${this.baseUrl}/${patientId}/${responsibleId}`, responsible);
	}

	public insert(responsible: any): Observable<any> {
		return this.requestService.post(`${this.baseUrl}`, responsible);
	}

	public delete(id: number): Observable<any> {
		return this.requestService.delete(`${this.baseUrl}/${this.patientId}/${id}`);
	}

	public checkDuplicates(patientId: number, responsibleId: number): Observable<any> {
		return this.requestService.get(`${this.baseUrl}/check-duplicates?patientId=${patientId}&responsibleId=${responsibleId}`);
	}

	public getAllResponsableByPatient(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `api/patient/responsibles?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`

        if (filterBy) {
            url += `&filterBy=${filterBy}`;
            if(this.patientId) url += ` and patientId=${this.patientId}`;
        } else if(this.patientId) url += `&filterBy=patientId=${this.patientId}`;

        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
		return this.requestService.get(url)
			.map( response => {
				const dataSource: Array<any> = response.model;
				dataSource.forEach(item => {
					item['yesOrNo'] = item.vigente ? 'Si' : '';
				});
				response.model = dataSource;
				return response;
			});
    }
}
