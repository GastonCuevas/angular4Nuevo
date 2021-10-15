import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService } from './../+core/services';
import { Paginator, Sort, IColumn } from '../+shared/util';
import { GenericControl } from '../+shared';
import { PharmacyPatient, PharmacyScheme, PharmacySchemeDetail, PharmacyDelivery, PharmacyReport, PharmacyGroupReport } from './util/models';


@Injectable()
export class PharmacyService {

    baseUrl = 'api/Pharmacy';
    pharmacyPatientList = new Array<PharmacyPatient>();
    pharmacySchemes = new Array<PharmacyScheme>();
    pharmacySchemesDetail = new Array<PharmacySchemeDetail>();
    pharmacySummary = new Array<any>();
    articlesTemp = new Array<PharmacySchemeDetail>();
    columns: Array<IColumn>;
    days = 1;
    controlsToFilter: Array<GenericControl>;

    constructor(private requestService: RequestService) { }

    getAllArticles(): Observable<any> {
        return this.requestService.get('api/hcEvolution/articles/combo');
    }

    getArticles(selected: PharmacyPatient): Observable<any> {
        let url = `${this.baseUrl}/schemes`;
        return this.requestService.post(url, [selected.patMovId])
            .map(response => {
            const dataSource: Array<PharmacyScheme> = response.model;
            response.model =  dataSource.reduce((items, p) => items.concat(p.schemeDetail), new Array<PharmacySchemeDetail>());
            return response;
        });
    }
    getSchemeSelectedPatient(patMovId: number) {
        let url = `${this.baseUrl}/scheme?patMovId=${patMovId}`;
        return this.requestService.get(url);
    }

    getArticlesReturned(): Observable<any> { return Observable.of({ model: this.articlesTemp }); }

    getPharmacyPatient(paginator: Paginator, filterBy?: string, sort?: Sort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`;
        url += `&filterBy=PatMov.MovementStateNumber=2${filterBy ? ' and '+filterBy : ''}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    /** Pharmacy Schemes */
    getSchemes() {
        let patMovIds = this.pharmacyPatientList.map(x => x.patMovId);
        let url = `${this.baseUrl}/schemes`;
        return this.requestService.post(url, patMovIds)
        .map(response => {
            const dataSource: Array<PharmacyScheme> = response.model;
            dataSource.forEach(x => {
                x.schemeDetail = x.schemeDetail.filter(t => t.type == 1);
            });
            response.model =  dataSource;
            return response;
        });
    }

    getPharmacySchemes(): Observable<any> {
        return Observable.of({ model: this.pharmacySchemes });
    }

    /** Pharmacy Scheme Summary */
    getPharmacySummary() {
        let patMovs = this.pharmacyPatientList;
        let url = `${this.baseUrl}/summary?days=${this.days}`;
        return this.requestService.post(url, patMovs);
    }
  
    getPharmacySummaryTable(): Observable<any> {
        return Observable.of({ model: this.pharmacySummary });
    }

    getPharmacySummaryUpdate(): Observable<any> {
        let pharmacyScheme = this.pharmacySchemes;
        let url = `${this.baseUrl}/summary/update?days=${this.days}`;
        return this.requestService.post(url, pharmacyScheme);
    }

    sendPharmacyRecords(p: PharmacyDelivery) {
        let url = `${this.baseUrl}`;
        return this.requestService.post(url, p);
    }

    setPharmacyDetails(p: PharmacyDelivery) {
        let url = `${this.baseUrl}/detail`;
        return this.requestService.post(url, p);
    }

    // /*********** methods to add/update/delete pharmacy Patient ****************/
    selectAll(pharmacyPatients: Array<PharmacyPatient>, checked: boolean) {
        pharmacyPatients.forEach(p => {
            if (checked) this.addPharmacyPatient(p);
            else this.deletePharmacyPatient(p);
        });
    }

    updatePharmacyPatient(p: PharmacyPatient) {
        p.selectedPatient ? this.addPharmacyPatient(p) : this.deletePharmacyPatient(p);
    }

    private addPharmacyPatient(p: PharmacyPatient) {
        this.validatePush(this.pharmacyPatientList, p);
    }

    private validatePush(list: Array<PharmacyPatient>, p: PharmacyPatient) {
        const index = list.findIndex(x => x.patMovId == p.patMovId);
        if (index === -1) list.push(JSON.parse(JSON.stringify(p)));
    }

    private deletePharmacyPatient(p: PharmacyPatient) {
        this.validateDelete(this.pharmacyPatientList, p);
    }

    private validateDelete(list: Array<PharmacyPatient>, p: PharmacyPatient) {
        const index = list.findIndex(x => x.patMovId == p.patMovId);
        if (index !== -1) list.splice(index, 1);
    }


    // /*********** methods to articles temp ****************/

    updateArticleTemp(p: PharmacySchemeDetail) {
        if(!p) return;
        const i =  this.articlesTemp.findIndex(x => x.articleCode == p.articleCode);
        if(i == -1) this.addArticleReturned(p);
        else this.articlesTemp[i].quantity = p.quantity;
    }

    deleteArticleTemp(p: PharmacySchemeDetail) {
        if(!p) return;
        this.deleteArticleReturned(p);
    }

    private addArticleReturned(p: PharmacySchemeDetail) {
        this.validateForAdd(this.articlesTemp, p);
    }

    private validateForAdd(list: Array<PharmacySchemeDetail>, p: PharmacySchemeDetail) {
        const index = list.findIndex(x => x.articleCode == p.articleCode);
        if (index === -1) list.push(JSON.parse(JSON.stringify(p)));
    }

    private deleteArticleReturned(p: PharmacySchemeDetail) {
        this.validateForDelete(this.articlesTemp, p);
    }

    private validateForDelete(list: Array<PharmacySchemeDetail>, p: PharmacySchemeDetail) {
        const index = list.findIndex(x => x.id == p.id);
        if (index !== -1) list.splice(index, 1);
    }

    resetService() {
        this.selectAll(this.pharmacyPatientList,false);
        this.pharmacySchemes = [];
        this.pharmacyPatientList = [];
        this.pharmacySummary = [];
        this.pharmacySchemesDetail = [];
        this.articlesTemp = [];
    }

    /** pharmacy reports */

    getPharmacyReports(paginator: Paginator, filterBy?: string, sort?: Sort): Observable<any> {
        let url = `${this.baseUrl}/history/?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        if (filterBy) url += `&filterBy=${filterBy}`;
        return this.requestService.get(url);
    }

    getPharmacyReportById(id: number, bySchemes: boolean){
        let url = `${this.baseUrl}/report/${id}?byschemes=${!!bySchemes}`;
        return this.requestService.get(url);
        //  .map(response => {
        //     const dataSource: Array<PharmacyReport> = response.model;
        //     response.model =  dataSource.reduce((items, p) => items.concat(p.), new Array<PharmacyGroupReport>());
        //     return response;})
        //     ;
    }
}

