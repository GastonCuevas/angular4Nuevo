import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService } from './../+core/services/request.service';
import { User } from './../models/user.model';
import { ISort } from '../interface';

@Injectable()
export class UserService {

    private baseUrl: string = 'api/user';

    constructor(
        private requestService: RequestService
    ) { }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url).map(response => {
            response.model.forEach((d:any) => d.enabledText = d.enabled ? 'SI' : 'NO');
            return response;
        });
    }

    public get(id: number): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/${id}`);
    }

    public update(id: number, user: User): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${id}`, user);
    }

    public insert(user: User): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, user);
    }

    public save(user: User): Observable<any> {
        return user.number == 0 ? this.insert(user) : this.update(user.number, user);
    }

    public delete(id: number): Observable<any> {
        return this.requestService.delete(`${this.baseUrl}/${id}`);
    }

    public getActionsUseCase(code: any): Observable<any> {
        return this.requestService.get(`api/usecase/actions/${code}`);
    }
}
