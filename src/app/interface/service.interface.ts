import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

export interface IService {
    getAll(paginator: any, query?: any, sort?: any, sqlParameters?: any): Observable<any>;
    getResultQuery(query: any): Observable<any>;
    editItem(config: any, code: any): Observable<any>;
}