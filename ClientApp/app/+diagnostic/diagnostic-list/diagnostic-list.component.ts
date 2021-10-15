import { Component, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { ToastyMessageService, UtilityService, LoadingGlobalService } from '../../+core/services';
import { DynamicTableComponent } from '../../+shared';
import { EventDynamicTable } from '../../+shared/util';
import { DiagnosticService } from './../diagnostic.service';
import { Diagnostic } from '../../models';

@Component({
    selector: 'app-diagnostic-list',
    templateUrl: './diagnostic-list.component.html',
    styleUrls: ['./diagnostic-list.component.scss']
})
export class DiagnosticListComponent {

    openModalDeleteSubject = new Subject();
    reloadingDataSource = false;
    private diagnosticId = 0;

    constructor(
        private toastyService: ToastyMessageService,
        private utilityService: UtilityService,
        private loadingGlobalService: LoadingGlobalService,
        public diagnosticService: DiagnosticService,
    ) {}

    onUploadClick() {
        this.utilityService.navigate(`/archivos/diagnosticos/formulario/upload/file`);
    }

    onActionClick(event: EventDynamicTable<Diagnostic>) {
        switch (event.action) {
            case 'new':
                this.utilityService.navigate('/archivos/diagnosticos/formulario');
                break;
            case 'edit':
                this.utilityService.navigate(`/archivos/diagnosticos/formulario/${event.item.number}`);
                break;
            case 'detail':
                this.utilityService.navigate(`/archivos/diagnosticos/detalle/${event.item.number}`);
                break;
            case 'delete':
                this.diagnosticId = event.item.number;
                if (this.diagnosticId) this.openModalDeleteSubject.next();
                break;
            default:
                break;
        }
    }

    deleteDiagnostic() {
        this.loadingGlobalService.showLoading('Eliminando Diagnóstico...');
        this.diagnosticService.delete(this.diagnosticId)
            .finally(() => this.loadingGlobalService.hideLoading())
            .subscribe(
            response => {
                this.diagnosticId = 0;
                this.reloadingDataSource = true;
                this.toastyService.showSuccessMessagge("Se ha eliminado correctamente");
            },
            error => {
                this.toastyService.showToastyError(error, 'Ocurrio un error inesperado');
            });
    }

}
