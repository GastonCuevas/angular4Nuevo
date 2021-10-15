import { forEach } from '@angular/router/src/utils/collection';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { RequestService } from './../+core/services/request.service';
import { ISort } from '../interface';
import { ProfessionalContractAbsence } from '../models/professional-contract-absence.model';


@Injectable()
export class ContractProfessionalAbsenceService {
    public baseUrl: string = "/api/ProfessionalContractAbsence";
    public contractProfessionalAbsenceId: any = 0;
    isNewAbsence: boolean = false;
    contractAbsences: Array<ProfessionalContractAbsence> = new Array<ProfessionalContractAbsence>();
    newAbsences: Array<ProfessionalContractAbsence> = new Array<ProfessionalContractAbsence>();
    deletedAbsences: Array<ProfessionalContractAbsence> = new Array<ProfessionalContractAbsence>();
    modifiedAbsences: Array<ProfessionalContractAbsence> = new Array<ProfessionalContractAbsence>();
    professionalContractAbsence: ProfessionalContractAbsence = new ProfessionalContractAbsence();
    itemIndexToEdit: number = -1;

    constructor(
        private requestService: RequestService
    ) {
    }

    public delete(id: any) {
        return this.requestService.delete(`${this.baseUrl}/${id}`);
    }

    public update(contractProfessionalAbsence: any) {
        this.contractAbsences.forEach((absence: any, index: number) => {
            if (index === this.itemIndexToEdit) {
                this.contractAbsences[index] = contractProfessionalAbsence;
                this.itemIndexToEdit = -1;
            }
        });
    }

    public getAll(filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}/all?`
        if (filterBy) url += `filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    public get(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/${id}`);
    }

    public add(contractProfessionalAbsence: any): Observable<any> {
        this.contractAbsences.push(contractProfessionalAbsence);
        return Observable.of(this.contractAbsences);
    }

    itemToEdit(absence: any) {
        if (absence) {
            this.professionalContractAbsence = absence;
            this.itemIndexToEdit = this.contractAbsences.findIndex(x => x.dateFrom === absence.dateFrom && x.dateTo === absence.dateTo);
        }
    }
    //llama al turnmanagment para consultar turnos 
    public getAllShitf(professionalId?: number, dateFrom?: string, dateTo?: string): Observable<any> {
        let url = `/api/turnmanagement/turns?`
        if (professionalId) url += `professional=${professionalId}`;
        if (dateFrom) url += `&dateFrom=${dateFrom}`;
        if (dateTo) url += `&dateTo=${dateTo}`;
        return this.requestService.get(url);
    }
}