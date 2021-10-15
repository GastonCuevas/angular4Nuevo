import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { FilterType } from '../../+shared/util';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { CommonService } from './../../+core/services/common.service';
import { ExportationEntry } from '../../models/exportationEntry.model';
import { ExportationEntryService } from './../exportation-entry.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';

@Component({
    selector: 'app-exportation-entry-list',
        templateUrl: 'exportation-entry-list.component.html'
})

export class ExportationEntryListComponent implements OnInit {

    deleteModalSubject: Subject<any> = new Subject();
    exportationEntryNumber: 0;
    reloadingData: boolean = false;
    @Input() exportId: number;
    columns = [
        { header: "Nombre", property: "name", elementFilter: new ElementFilter(FilterType.TEXT) },
        { header: "Key", property: "key", elementFilter: new ElementFilter(FilterType.TEXT) },
        { header: "Tipo", property: "typeDescription", disableSorting: true },
        { header: "Tabla Fo", property: "tableFo", disableSorting: true },
        { header: "Campo Fo", property: "fieldFo", disableSorting: true },
    ]

    paginator = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0
    }


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private commonService: CommonService,
        public exportationEntryService: ExportationEntryService,
        private toastyMessageService: ToastyMessageService
    ) { }

    ngOnInit() {
       // this.exportationEntryService.expedientNumber = this.route.snapshot.paramMap.get('id');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.exportId != null) {
            this.exportationEntryService.expedientNumber = this.exportId;
        }
    }

    goBack() {
        this.router.navigate([`sistema/exportaciones/formulario/${this.exportationEntryService.expedientNumber}`]);
    }

    onActionClick(event: any) {
        switch (event.action) {
            case 'new':
                this.router.navigate(['sistema/exportaciones/entradas/formulario'])
                break;
            case 'edit':
                this.router.navigate([`sistema/exportaciones/entradas/formulario/${event.item.number}`])
                break;
            case 'delete':
                this.exportationEntryNumber = event.item.number;
                if (this.exportationEntryNumber) this.deleteModalSubject.next();
                break;
            case 'detail':
                this.router.navigate([`sistema/exportaciones/entradas/detalle/${event.item.number}`]);
                break;
            default:
                break;
        }
    }

    onDeleteConfirm(event: any) {
        this.exportationEntryService.delete(this.exportationEntryNumber).subscribe(
            result => {
                this.exportationEntryNumber = 0;
                this.reloadingData = true;
                this.toastyMessageService.showSuccessMessagge("Se elimino correctamente");
            },
            error => {
                this.toastyMessageService.showErrorMessagge("Ocurrio un error inesperado");
            });
    }

    updateReloadingData(event: any) {
        this.reloadingData = event.value;
    }

}