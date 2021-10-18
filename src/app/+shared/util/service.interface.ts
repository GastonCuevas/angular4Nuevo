import { Observable } from 'rxjs/Observable';
import { Paginator, Sort } from './';

export interface IService {
    getAll(paginator: Paginator, filterBy?: any, sort?: Sort, sqlParameters?: any): Observable<any>;
}