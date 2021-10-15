import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { RequestService } from './../+core/services/request.service';
import { ISort } from '../interface';
import { ProfessionalContractConcept } from '../models/professional-contract-concept.model';
// import { ProfessionalContractAbsence } from '../models/professional-contract-absence.model';


@Injectable()
export class ContractProfessionalConceptService {
    baseUrl = '/api/professionalcontractconcept';
    contractProfessionalConceptId: any = 0;
    professionalContractId = 0;
    isNewConcept = false;
    contractConcepts = new Array<ProfessionalContractConcept>();
    
    
    professionalContractConcept = new ProfessionalContractConcept();


    constructor(
        private requestService: RequestService
    ) {
    }
    
    getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}?`;
        if (filterBy) {
            url += `&filterBy=${filterBy}`;
            if(this.professionalContractId) url += ` and contractNumber=${this.professionalContractId}`;
        } else if(this.professionalContractId) url += `&filterBy= contractNumber=${this.professionalContractId}`;

        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    getConcepts() {
        return this.requestService.get('api/concept/professionalcontract');
    }

    // public getAllContractConcept(filterBy?: any, sort?: ISort): Observable<any> {
    //     let url = `${this.baseUrl}/contract?`
    //     // if (filterBy) url += `filterBy=${filterBy}`;
    //     // if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
    //     return this.requestService.get(url);
    // }

    update(data: ProfessionalContractConcept): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${data.number}`, data);
    }

    insert(data: ProfessionalContractConcept): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, data);
    }

    delete(id: number): Observable<any> {
        return this.requestService.delete(`${this.baseUrl}/${id}`);
    }

    getByContract(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/contract/${id}`);
    }
}