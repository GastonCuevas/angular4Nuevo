import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { ContractProfessional } from '../models/contract-professional.model';
import { RequestService, UtilityService } from './../+core/services';
import { ISort } from '../interface';
import { ActionTable, FilterType } from '../+shared/util';
import * as moment from 'moment';
import { ElementFilter } from '../+dynamic-view-v2/util';

@Injectable()
export class ContractProfessionalService {
    public baseUrl: string = "/api/professionalContract";
    public professionalAccount: number = 0;
    public professionalId: any = 0;
    public professionalName: string = "";
    public isCloned: boolean = false;
	public routeList: string;

    columns = [
        { header: "Profesional", property: "professionalName", searchProperty: "prof.professionalAccount.name", elementFilter: new ElementFilter(FilterType.NAME) },
		{ header: "Valido desde", property: "dateFrom", elementFilter: new ElementFilter(FilterType.DATE) },
		{ header: "Valido hasta", property: "dateTo", elementFilter: new ElementFilter(FilterType.DATE) }
	];

    constructor(
        private requestService: RequestService,
        private utilityService: UtilityService
    ) {}

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`

        if (filterBy) {
            url += `&filterBy=${filterBy}`;
            if(this.professionalId) url += ` and professionalNumber=${this.professionalId}`;
        } else if(this.professionalId) url += `&filterBy= professionalNumber=${this.professionalId}`;

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
        return this.requestService.get(`${this.baseUrl}/${id}`);
    }

    public addContractProfessional(contractProfessional: any): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, contractProfessional);
	}

	public update(id: any, contractProfessional: any): Observable<any> {
		return this.requestService.put(`${this.baseUrl}/${id}`, contractProfessional);
    }
    
    public save(contractProfessional: any): Observable<any> {
		return contractProfessional.number == 0 ? this.addContractProfessional(contractProfessional) : this.update(contractProfessional.number, contractProfessional);
    }

	public delete(id: any) {
		return this.requestService.delete(`${this.baseUrl}/${id}`);
    }

    private isValid(now: moment.Moment, date: string) {
        return !date || now.isBefore(moment(date));
    }

    public getImage(number: number): Observable<any> {
        return this.requestService.get(`api/image/contract/${number}`);
    }

    public uploadImage(number: any, image: any): Observable<any> {
        return this.requestService.upFileServer(`api/image/contract/upload/${number}`, image);
    }

}