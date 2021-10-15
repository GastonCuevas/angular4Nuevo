import { Injectable } from '@angular/core';
import { RequestService } from './../+core/services/request.service';
import { Observable } from 'rxjs/Rx';
import { ISort } from '../interface';
import { ExportationEntry } from '../models/exportationEntry.model';

@Injectable()
export class ExportationEntryService {
    expedientNumber: any = 0;
    baseUrl: string = "api/exportentry"
    exportationEntries: Array<ExportationEntry> = new Array<ExportationEntry>();
    isNewEntry: boolean = false;
    
    constructor(
        private requestService: RequestService
    ) { }

    public getAllByExportNumber(paginator: any, filterBy?: any): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) url += `&filterBy=${filterBy}`;
        return this.requestService.get(url);
    }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) {
            url += `&filterBy=${filterBy} and expedientNumber=${this.expedientNumber}`;
        } else {
            url += `&filterBy=expedientNumber=${this.expedientNumber}`;
        }
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    public get(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/` + id);
    }

    public add(exportationEntry: any): Observable<any> {
        if(!this.isNewEntry) {
            return this.requestService.post(`${this.baseUrl}`, exportationEntry);
        } else {
            this.exportationEntries.push(exportationEntry);
            return Observable.of(this.exportationEntries);
        }
        
    }

    public update(id: any, exportationEntry: any): Observable<any> {
        if(!this.isNewEntry) {
            return this.requestService.put(`${this.baseUrl}/${id}`, exportationEntry);
        } else {
            for(let i = 0; i < this.exportationEntries.length; i++) {
                if(this.exportationEntries[i].number == id) {
                    this.exportationEntries[i] = exportationEntry;
                }
            }
            return Observable.of(this.exportationEntries);
        }
    }

    public delete(id: any): Observable<any> {
        if(!this.isNewEntry) {
            return this.requestService.delete(`${this.baseUrl}/${id}`);
        } else {
            let position = this.exportationEntries.indexOf(id);
            if(position) {
                this.exportationEntries.splice(position,1);
            }
            return Observable.of(this.exportationEntries);
        }
    }

    public getEntryTypes() {
        return this.requestService.get(`${this.baseUrl}/`+"entrytypes");
    }
}