import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { RequestService } from './../+core/services/request.service';
import { ISort } from '../interface';
import { ProfessionalContractMedicalInsurance } from '../models/professional-contract-medicalInsurance.model';
import { Paginator, Sort } from '../+shared/util';

@Injectable()
export class ContractProfessionalMedicalInsuranceService {
    public baseUrl: string = "/api/ProfessionalContractMedicalInsurance";
    isNewMedicalInsurance: boolean = false;
    contractMedicalInsurances: Array<ProfessionalContractMedicalInsurance> = new Array<ProfessionalContractMedicalInsurance>();
    professionalContractMedicalInsurance: ProfessionalContractMedicalInsurance = new ProfessionalContractMedicalInsurance();
    itemIndexToEdit: number = -1;
    onEditOrAdd = false;
    osId: number = 0;
    practicesSelected: Array<any> = new Array<any>();
    contractId: any = 0;

    constructor(
        private requestService: RequestService
    ) {
    }

    public delete(id: any) {
        return this.requestService.delete(`${this.baseUrl}/${id}`);
    }

    public update(contractProfessionalPractice: any): Observable<any> {
        const index = this.contractMedicalInsurances.findIndex((d: any) => d.numint == contractProfessionalPractice.numint);
        if (index != -1) this.contractMedicalInsurances[index] = contractProfessionalPractice;
        return  Observable.of(this.contractMedicalInsurances);

        // this.contractMedicalInsurances.forEach((item: any, index: number) => {
        //     if (index === this.itemIndexToEdit) {
        //         this.contractMedicalInsurances[index] = contractProfessionalPractice;
        //         this.itemIndexToEdit = -1;
        //     }
        // });
    }

    public getAll(filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}?`
        if (filterBy) url += `filterBy=${filterBy}`; 
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    public getAllInMemory(): Observable<any> {
        return Observable.of(this.contractMedicalInsurances);
    }

    public get(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/${id}`);
    }

    // public add(contractProfessionalPractice: any): Observable<any> {
    //     this.contractMedicalInsurances.push(contractProfessionalPractice);
    //     return Observable.of(this.newMedicalInsurances);
    // }

    public add(contractProfessionalPractice: any): Observable<any> {
        contractProfessionalPractice.practiceNumber = contractProfessionalPractice.practiceNumber;
        this.contractMedicalInsurances.push(contractProfessionalPractice);
        return Observable.of(this.contractMedicalInsurances);
    }

    public save(contractProfessionalPractice: any): Observable<any> {
        return this.isNewMedicalInsurance ? this.add(contractProfessionalPractice) : this.update(contractProfessionalPractice);
    }

    public addRange(contractProfessionalPractices: Array<any>): Observable<any> {
        contractProfessionalPractices.forEach(e => {
            this.contractMedicalInsurances.push(e);
        });
        return Observable.of(this.contractMedicalInsurances);
    }

    itemToEdit(item: any) {
        if (item) {
            this.professionalContractMedicalInsurance = item;
            this.itemIndexToEdit = this.contractMedicalInsurances.findIndex(x => x === item);
        }
    }

    public getPracticesToCheck(paginator: any, filterBy?: string, sort?: Sort): Observable<any> {
        let url: string = "api/professionalContractMedicalInsurance/practices?";
        if (this.osId) url += `filterBy=MedicalInsuranceContract.MedicalInsuranceNumber = ${this.osId}`;
        if (filterBy) url += ` and ${filterBy}&`; else url +=`&`;
        if (sort) url += `orderBy=${sort.sortBy}&ascending=${sort.ascending}`;

        return this.requestService.get(url)
        .map(response => {
            this.practicesSelected = response.model;
            this.practicesSelected.forEach(item => {
                let practiceAdded = this.contractMedicalInsurances.find(
                    practice => { return practice.practiceNumber === item.number && this.osId == practice.medicalInsuranceNumber});
                item.added = !!practiceAdded;
                item.selected = item.added;
            });
            response.model = this.practicesSelected;
            return response;
        });
    }

    selectedAll(checked: boolean) {
        this.practicesSelected.forEach(item => {
            item.selected = checked;
        });
    }
}