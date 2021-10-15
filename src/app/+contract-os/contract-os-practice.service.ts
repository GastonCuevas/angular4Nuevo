import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { RequestService } from '../+core/services/request.service';
import { ContractOsPractice } from './../models/contract-os-practice.model';
import { ISort } from '../interface';

@Injectable()
export class ContractOsPracticeService {
	baseUrl: string = "api/medicalinsurancecontractpractice";
	contractNumber: number = 0;
	isNewPractice: boolean = false;
	newPractices: Array<ContractOsPractice> = new Array<ContractOsPractice>();
	columns = [
		{ header: "Nombre", property: "practiceName", searchProperty: "inosPractice.description" },
		{ header: "Código", property: "code" },
		{ header: "Coseguro", property: "coinsurance" },
		{ header: "Precio", property: "price" },
		{ header: "Cobertura Médica", property: "medicalCoverage" },
		{ header: "Facturable", property: "facturab" }
	];

	constructor(
		public requestService: RequestService
	) { }

	public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
		if (this.isNewPractice) return Observable.of({ model: this.newPractices });
		let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}&filterBy=contractNumber=${this.contractNumber}`;
		if (filterBy) url += ` and ${filterBy}`;
		if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;

		return this.requestService.get(url).map(response => {
            const dataSource: Array<any> = response.model;
		    dataSource.forEach(item => {
                item.facturab = item.facturable?'Si':'No';
			});
            response.model = dataSource;
            return response;
        });
	}

	public get(id: any): Observable<any> {
		return this.requestService.get(`${this.baseUrl}/` + id);
	}

	public save(contractOsPractice: ContractOsPractice): Observable<any> {
		return !contractOsPractice.number ? this.add(contractOsPractice) : this.update(contractOsPractice.number, contractOsPractice);
	}

	public add(contractOsPractice: ContractOsPractice): Observable<any> {
		if (!this.isNewPractice) return this.requestService.post(`${this.baseUrl}`, contractOsPractice);
		contractOsPractice.number = contractOsPractice.practiceNumber;
		this.newPractices.push(contractOsPractice);
		return Observable.of(this.newPractices);
	}

	public update(id: any, contractOsPractice: any): Observable<any> {
		if (!this.isNewPractice) return this.requestService.put(`${this.baseUrl}/${id}`, contractOsPractice);
		contractOsPractice.number = contractOsPractice.practiceNumber;
		const index = this.newPractices.findIndex((d: ContractOsPractice) => d.number == id);
		if (index != -1) this.newPractices[index] = contractOsPractice;
		return Observable.of(this.newPractices);
	}

	public delete(id: any): Observable<any> {
		if (!this.isNewPractice) return this.requestService.delete(`${this.baseUrl}/${id}`);
		const index = this.newPractices.findIndex((d: ContractOsPractice) => d.number == id);
		if (index != -1) this.newPractices.splice(index, 1);
		return Observable.of(this.newPractices);
	}

	public find(id: any): ContractOsPractice | undefined {
		return this.newPractices.find((d: ContractOsPractice) => d.number == id);
	}

	public exists(contractOsPractice: ContractOsPractice): boolean {
		return this.newPractices.some((d: ContractOsPractice) => d.practiceNumber == contractOsPractice.practiceNumber && d.number != contractOsPractice.number)
	}
}