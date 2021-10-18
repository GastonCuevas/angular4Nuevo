import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

type Result = {msg?: string; showLoading: boolean}

@Injectable()
export class LoadingGlobalService {

    loadingSubject = new Subject<Result>();

    constructor(
    ) { }

    showLoading(msg?: string) {
        return this.loadingSubject.next({msg: msg, showLoading: true})
    }

    hideLoading() {
        return this.loadingSubject.next({showLoading: false})
    }

}
