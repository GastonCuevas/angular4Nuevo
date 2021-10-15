import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService, UtilityService } from '../+core/services';
import { ISort } from '../interface';
import { ActionTable, FilterType } from '../+shared/util';
import * as moment from 'moment';
import { ElementFilter } from '../+dynamic-view-v2/util';

@Injectable()
export class ContractOsService {
	baseUrl: string = "api/medicalinsurancecontract";
	isNewContract: boolean = false;
	osNumber: number;
	routeList: any = "archivos/contratosOs";
	columns = [
		{ header: "Obra Social", property: 'medicalInsuranceName', searchProperty: 'os.medicalInsuranceAccount.name', elementFilter: new ElementFilter(FilterType.TEXT) },
		{ header: "Período Desde", property: "dateFrom", elementFilter: new ElementFilter(FilterType.DATE) },
		{ header: "Período Hasta", property: "dateTo", elementFilter: new ElementFilter(FilterType.DATE) }
	];
	
	constructor(
		private requestService: RequestService,
		private utilityService: UtilityService
	) { }

	public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
		let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
		if (filterBy) url += `&filterBy=${filterBy}`;
		else if (this.osNumber) url += `&filterBy=medicalInsuranceNumber=${this.osNumber}`;
		if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;

		return this.requestService.get(url)
        .map(response => {
            const dataSource: Array<any> = response.model;
		    const now = moment().startOf("day");
            dataSource.forEach(item => {
                item['action'] = new ActionTable();
                if (this.isValid(now, item.dateTo)) {
                    item.action.edit = true;
                    item.action.detail = false;
                } else {
                    item.action.edit = false;
                    item.action.detail = true;
                }
			});
            response.model = dataSource;
            return response;
        });
	}

	public get(id: any): Observable<any> {
		return this.requestService.get(`${this.baseUrl}/` + id);
	}

	public save(contractOs: any): Observable<any> {
		return !!contractOs.number ? this.update(contractOs.number, contractOs) : this.insert(contractOs);
	}

	public update(id: any, contractOs: any): Observable<any> {
		return this.requestService.put(`${this.baseUrl}/${id}`, contractOs);
	}

	public insert(contractOs: any): Observable<any> {
		return this.requestService.post(`${this.baseUrl}`, contractOs);
    }

    private isValid(now: moment.Moment, date: string) {
        return !date || now.isBefore(moment(date));
    }
}
