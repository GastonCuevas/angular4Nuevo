import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService } from './../+core/services';
import { PracticeToLiquidate, LiquidationPracticeMI, LiquidateMedicalInsurance, MedicalInsuranceLiquidation } from './util/models';
import { Paginator, Sort, IColumn } from '../+shared/util';
import { GenericControl } from '../+shared';

@Injectable()
export class MedicalInsuranceLiquidationService {

    baseUrl = 'api/MedicalInsuranceSettlement';
    movPac = new Array<PracticeToLiquidate>();
    columns: Array<IColumn>;
    controlsToFilter: Array<GenericControl>;

    miNumber: number;
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
                    item.hideLiquidate = item.rejected;
                    item.hideReLiquidate = !item.rejected;
                    var find = this.movPac.find(x => !item.cheId && x.movPacId == item.movPacId || !!item.cheId && x.cheId == item.cheId);
                    item.liquidate = !!find && find.liquidate;
                    item.reLiquidate = !!find && find.reLiquidate;
                });

                response.model = dataSource;
                return response;
            });
    }

    save(miLiquidation: LiquidateMedicalInsurance): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, miLiquidation);
    }

    /*********** methods to liquidate or reliquidate ****************/
    updatePracticesToLiquidate(practices: Array<PracticeToLiquidate>, checked: boolean, reLiquidation: boolean) {
        practices.forEach(p => {
            if (reLiquidation !== p.rejected) return;
            if (checked) this.addPracticeToLiquidate(p);
            else this.deletePracticeToLiquidate(p);
        });
    }

    updatePracticeToLiquidate(practice: PracticeToLiquidate) {
        if (!practice.rejected) practice.liquidate ? this.addPracticeToLiquidate(practice) : this.deletePracticeToLiquidate(practice);
        else practice.reLiquidate ? this.addPracticeToLiquidate(practice) : this.deletePracticeToLiquidate(practice);
    }

    private addPracticeToLiquidate(p: PracticeToLiquidate) {
        this.validatePush(this.movPac, p);
    }

    private deletePracticeToLiquidate(p: PracticeToLiquidate) {
        this.validateDelete(this.movPac, p);
    }

    private validatePush(list: Array<PracticeToLiquidate>, practice: PracticeToLiquidate) {
        const index = list.findIndex(x => x.movPacId == practice.movPacId && x.cheId == practice.cheId);
        if (index === -1) list.push(JSON.parse(JSON.stringify(practice)));
    }

    private validateDelete(list: Array<PracticeToLiquidate>, practice: PracticeToLiquidate) {
        const index = list.findIndex(x => x.movPacId == practice.movPacId && x.cheId == practice.cheId);
        if (index !== -1) list.splice(index, 1);
    }

    private checkFilters() {
        if (this.miNumber != this.controlsToFilter[0].value ||
            this.dateFrom != this.controlsToFilter[1].value ||
            this.dateTo != this.controlsToFilter[2].value) {
            this.resetService();
        }
        this.miNumber = this.controlsToFilter[0].value;
        this.dateFrom = this.controlsToFilter[1].value;
        this.dateTo = this.controlsToFilter[2].value;
    }

    /*********** methods to collect or reject ****************/

    getPracticesToCollectOrReject(paginator: Paginator, filterBy?: string, sort?: Sort): Observable<any> {
        let url = `${this.baseUrl}/AllWithoutPaymentDate?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`;
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    collectLiquidation(liquidation: LiquidateMedicalInsurance): Observable<any> {
        return this.requestService.put(`${this.baseUrl}`, liquidation);
    }

    rejectPractice(practice: any): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/practice`, practice);
    }

    //*********** Consulting *********
    getAllLiquidations(paginator: Paginator, filterBy?: string, sort?: Sort): Observable<any> {
        let url = `${this.baseUrl}/liquidated?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`;
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }
    getReportLiquidations(liquidation: any): Observable<any> {
        let url = `${this.baseUrl}/report`;
        return this.requestService.post(url,liquidation);
    }

    resetService() {
        this.movPac = [];
    }
}

