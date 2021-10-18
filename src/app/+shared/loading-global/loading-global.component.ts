import { Component, OnInit } from '@angular/core';
import { LoadingGlobalService } from '../../+core/services';

@Component({
    selector: 'his-loading-global',
    templateUrl: './loading-global.component.html',
    styleUrls: ['./loading-global.component.scss']
})
export class LoadingGlobalComponent implements OnInit {

    showLoading = false;
    msg = 'Cargando...';

    constructor(private loadingGlobalService: LoadingGlobalService) {}

    ngOnInit() {
        this.loadingGlobalService.loadingSubject.subscribe(result => {
            this.msg = result.msg || 'Cargando...';
            this.showLoading = result.showLoading;
        });
    }
}
