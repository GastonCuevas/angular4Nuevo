import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { Subject } from 'rxjs';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { FilterType } from '../../+shared/util';
import { ImportDataService } from '../import-data.service';
import { DynamicTableComponent } from '../../+shared';
import { LoadingGlobalService } from '../../+core/services';
import { ImportFieldService } from '../import-field.service';

@Component({
    selector: 'app-import-data-list',
    templateUrl: 'import-data-list.component.html',
    styleUrls: ['./import-data-list.component.scss']

})

export class ImportDataListComponent implements OnInit {

    importId: 0;
    deleteModalSubject: Subject<any> = new Subject();
    @ViewChild(DynamicTableComponent) tdImportDataList: DynamicTableComponent;

    columns = [
        { header: "Tabla", property: "table" }
    ]

    paginator = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0
    }

    constructor(
        private router: Router,
        public importFieldService: ImportFieldService,
        public importDataService:ImportDataService,
        private toastyService: ToastyMessageService,
        private loadingGlobalService: LoadingGlobalService
    ) { }

    ngOnInit() {
    }

    onActionClick(event: any) {
        switch (event.action) {
            case 'new':
                this.router.navigate(['sistema/importData/formulario'])
                break;
            case 'edit':
                this.importFieldService.tableName = event.item.table;
                this.router.navigate([`sistema/importData/formulario/${event.item.id}/${event.item.table}`])
                break;
            case 'delete':
                this.importId = event.item.id;
                if (this.importId) this.deleteModalSubject.next();
                break;
            default:
                break;
        }
    }

    onDeleteConfirm() {
        this.loadingGlobalService.showLoading("Eliminando Configuracíon...");
        this.importDataService.delete(this.importId).subscribe(
            () => {
                this.importId = 0;
                this.tdImportDataList.updateTable();
                this.toastyService.showSuccessMessagge("Se elimino correctamente");
            },
            () => {
                this.loadingGlobalService.hideLoading();
                this.toastyService.showErrorMessagge("Ocurrio un error inesperado");
            },
            () => {
                this.loadingGlobalService.hideLoading();
            });
    }
}