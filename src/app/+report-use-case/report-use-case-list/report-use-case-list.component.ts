import { Component, OnInit } from '@angular/core';
import { TypeFilter } from '../../+shared/constant';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { Subject } from 'rxjs/Subject';
import { ReportUseCase } from './../../models/report-use-case.model';
import { ReportUseCaseService } from './../report-use-case.service';
import { Router } from '@angular/router';
import { GenericControl } from '../../+shared';

@Component({
    selector: 'selector-name',
    templateUrl: 'report-use-case-list.component.html'
})

export class ReportUseCaseListComponent implements OnInit {
    reportUseCase: Array<ReportUseCase> = new Array<ReportUseCase>();

    controlsToFilter: Array<GenericControl> = [
        { key: 'code', label: 'Codigo', type: 'text', class: 'col s12 m4', searchProperty: 'code' },
        { key: 'description', label: 'Descripcion', type: 'text', class: 'col s12 m4', searchProperty: 'description' },
        { key: 'reportName', label: 'Nombre del Reporte', type: 'text', class: 'col s12 m4', searchProperty: 'reportName' },
    ];
    
    columns = [
        { header: "Código", property: "code", elementFilter: new ElementFilter(TypeFilter.TEXT) },
        { header: "Descripción", property: "description", elementFilter: new ElementFilter(TypeFilter.TEXT) },
        { header: "Nombre del Reporte", property: "reportName", elementFilter: new ElementFilter(TypeFilter.TEXT) },
    ]

    paginator = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0
    }

    reloadingData: boolean = false;
    deleteModalSubject: Subject<any> = new Subject();

    constructor(
        public reportUseCaseService: ReportUseCaseService,
        public router: Router
    ) { }

    ngOnInit() { }

    onActionClick(event: any) {
        switch (event.action) {
            case 'edit':
                this.router.navigate([`sistema/reportUsec/formulario/${event.item.code}`])
                break;
            default:
                break;
        }
    }

    updateReloadingData(event: any) {
        this.reloadingData = event.value;
    }
}