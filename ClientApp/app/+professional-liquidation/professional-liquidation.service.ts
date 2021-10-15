import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService } from './../+core/services';
import { PracticeToLiquidate, LiquidateProfessional } from './util/models';
import { Paginator, Sort, IColumn } from '../+shared/util';
import { GenericControl } from '../+shared';
import { LiquidateConcept } from '../models/liquidate-concept.model';

@Injectable()
export class ProfessionalLiquidationService {

    baseUrl = 'api/ProfessionalSettlement';
    columns: Array<IColumn>;
    controlsToFilter: Array<GenericControl>;
    practicesProf = new Array<PracticeToLiquidate>();
    medicalGuards = new Array<LiquidateConcept>();
    additionalDebits = new Array<LiquidateConcept>();

    professionalNumber: number;
    dateFrom: string;
    dateTo: string;

    constructor(
        private requestService: RequestService
    ) {}

    getPracticesToLiquidate(paginator: Paginator, filterBy?: string, sort?: Sort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        url += `&${filterBy}`;
        this.checkFilters();
        return this.requestService.get(url)
            .map(response => {
                const dataSource: Array<PracticeToLiquidate> = response.model;
                dataSource.forEach(item => {
                    item.liquidate = this.practicesProf.some(x => x.numberMovPacHC == item.numberMovPacHC);
                });
                response.model = dataSource;
                return response;
            });
    }

    getAmbulatoryPractices(): Observable<any> {
        return Observable.of({ model: this.practicesProf.filter(x => !x.typeInternament) });
    }

    getHospitalizationPractices(): Observable<any> {
        return Observable.of({ model: this.practicesProf.filter(x => x.typeInternament) });
    }

    getMedicalGuards() {
        return Observable.of({ model: this.medicalGuards });
    }

    getAdditionalDebits(): Observable<any> {
        return Observable.of({ model: this.additionalDebits });
    }

    getFixedAmount(professionalId: number): Observable<any> {
        return this.requestService.get(`api/professionalContract/professional/${professionalId}`);
    }

    save(professionalLiquidation: LiquidateProfessional): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, professionalLiquidation);
    }

    /******************** methods to liquidate ***********************/
    getConcepts() {
        return [...this.medicalGuards, ...this.additionalDebits];
    }

    updatePracticesToLiquidate(practices: Array<PracticeToLiquidate>, checked: boolean) {
        practices.forEach(p => {
            if (checked) this.addPracticeToLiquidate(p);
            else this.deletePracticeToLiquidate(p);
        });
    }

    updatePracticeToLiquidate(p: PracticeToLiquidate) {
        p.liquidate ? this.addPracticeToLiquidate(p) : this.deletePracticeToLiquidate(p);
    }

    calculateImport(price: number) {
        this.practicesProf.forEach(x => x.total = x.typeInternament ? x.days * price : (x.coinsurance + x.price - (x.price * x.retention / 100)));
    }

    private addPracticeToLiquidate(p: PracticeToLiquidate) {
        const index = this.practicesProf.findIndex(x => x.numberMovPacHC == p.numberMovPacHC);
        if (index !== -1) return;
        this.practicesProf.push(JSON.parse(JSON.stringify(p)));
    }

    private deletePracticeToLiquidate(p: PracticeToLiquidate) {
        const index = this.practicesProf.findIndex(x => x.numberMovPacHC == p.numberMovPacHC);
        if (index === -1) return;
        this.practicesProf.splice(index, 1);
    }

    private checkFilters() {
        if (this.professionalNumber != this.controlsToFilter[0].value ||
            this.dateFrom != this.controlsToFilter[1].value ||
            this.dateTo != this.controlsToFilter[2].value) {
            this.resetService();
        }
        this.professionalNumber = this.controlsToFilter[0].value;
        this.dateFrom = this.controlsToFilter[1].value;
        this.dateTo = this.controlsToFilter[2].value;
    }

    //*********** Consulting *********
    getAllLiquidations(paginator: Paginator, filterBy?: string, sort?: Sort): Observable<any> {
        let url = `${this.baseUrl}/liquidated?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`;
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }
    getReportLiquidations(liquidation: any): Observable<any> {
        const url = `${this.baseUrl}/report`;
        return this.requestService.post(url, liquidation);
    }

    resetService() {
        this.practicesProf = [];
        this.additionalDebits = [];
        this.medicalGuards = [];
    }
}
