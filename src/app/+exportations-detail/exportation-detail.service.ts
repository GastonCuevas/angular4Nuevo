import { Observable } from 'rxjs/Rx';
import { RequestService } from './../+core/services/request.service';
import { Injectable } from '@angular/core';
import { ISort } from '../interface';
import { ExportationDetail } from '../models/exportationDetail.model';

@Injectable()
export class ExportationDetailService {
    expedientNumber: any = 0;
    baseUrl: string = "api/exportdetail";
    exportationDetails: Array<ExportationDetail> = new Array<ExportationDetail>();
    isNewDetail: boolean = false;

    constructor(
        private requestService: RequestService
    ) { }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) {
            url += `&filterBy=${filterBy} and expedientNumber=${this.expedientNumber}`;
        } else {
            url += `&filterBy=expedientNumber=${this.expedientNumber}`;
        }
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        
        if(!this.isNewDetail){
            return this.requestService.get(url);
        } else {
            return Observable.of({model:this.exportationDetails});
        }
    }

    public get(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/`+id);
    }

    public add(exportationDetail: any): Observable<any> {
        if (!this.isNewDetail) {
            return this.requestService.post(`${this.baseUrl}`, exportationDetail);
        } else {
            this.exportationDetails.push(exportationDetail);
            return Observable.of(this.exportationDetails);
        }
    }

    public update(id: any, exportationDetail: any): Observable<any> {
        if(!this.isNewDetail) {
            return this.requestService.put(`${this.baseUrl}/${id}`, exportationDetail);
        } else {
            for(let i = 0; i < this.exportationDetails.length; i++) {
                if(this.exportationDetails[i].number == id) {
                    this.exportationDetails[i] = exportationDetail;
                }
            }
            return Observable.of(this.exportationDetails);
        }
    }

    public delete(id: any): Observable<any> {
        if(!this.isNewDetail) {
            return this.requestService.delete(`${this.baseUrl}/${id}`);
        } else {
            let position = this.exportationDetails.indexOf(id);
            if(position) {
                this.exportationDetails.splice(position,1);
            }
            return Observable.of(this.exportationDetails);
        }
    }

    public getDetailType(): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/`+"detailtypes");
    }

}