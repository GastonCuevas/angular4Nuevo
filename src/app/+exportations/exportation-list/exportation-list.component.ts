import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../+core/services/request.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { Subject } from 'rxjs';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { FilterType } from '../../+shared/util';
import { ExportationService } from './../exportation.service';
import { Exportation } from './../../models/exportation.model';
import { ExportationDetailService } from '../../+exportations-detail/exportation-detail.service';
import { ExportationEntryService } from '../../+exportations-entry/exportation-entry.service';
var FileSaver: any = require('file-saver');
var easyxml: any = require('easyxml');

@Component({
    selector: 'app-exportation-list',
    templateUrl: 'exportation-list.component.html'
})

export class ExportationListComponent implements OnInit {

    exportationId: 0;
    deleteModalSubject: Subject<any> = new Subject();
    reloadingData: boolean = false;
    
    columns = [
        { header: "Nombre", property: "name", elementFilter: new ElementFilter(FilterType.TEXT) },
        { header: "Descripción", property: "description", elementFilter: new ElementFilter(FilterType.TEXT) }
    ]

    paginator = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0
    }

    constructor(
        private router: Router,
        public exportationService: ExportationService,
        private toastyService: ToastyMessageService,
        public exportationDetailService: ExportationDetailService,
        public exportationEntryService: ExportationEntryService
    ) { }

    ngOnInit() {
    }

    onActionClick(event: any) {
        switch (event.action) {
            case 'new':
                this.router.navigate(['sistema/exportaciones/formulario'])
                break;
            case 'edit':
                this.router.navigate([`sistema/exportaciones/formulario/${event.item.number}`])
                break;
            case 'delete':
                this.exportationId = event.item.number;
                if (this.exportationId) this.deleteModalSubject.next();
                break;
            case 'detail':
                this.router.navigate([`sistema/exportaciones/detail/${event.item.number}`]);
                break;
            case 'copy':
                this.exportationDetailService.expedientNumber = event.item.number;
                this.exportationEntryService.expedientNumber = event.item.number;
                this.router.navigate([`sistema/exportaciones/clone/formulario/${event.item.number}/clone`]);
                break;
                case 'exportJson':
                this.downloadJsonFile(event.item);
                break;
            case 'exportXml':
                this.convertToXML(event.item);
                break;
            default:
                break;
        }
    }

    onDeleteConfirm(event: any) {
        this.exportationService.delete(this.exportationId).subscribe(
            result => {
                this.exportationId = 0;
                this.reloadingData = true;
                this.toastyService.showSuccessMessagge("Se elimino correctamente");
            },
            error => {
                this.toastyService.showErrorMessagge("Ocurrio un error inesperado");
            });
    }

    updateReloadingData(event: any) {
        this.reloadingData = event.value;
    }

    goToExportView(){
        this.router.navigate([`sistema/exportaciones/exportView`])
    }

    uploadFile() {
        this.router.navigate(['sistema/exportaciones/formulario/upload/file']);
    }
    downloadJsonFile(item: any) {
        this.exportationService.exportDefinition(item.number).subscribe(response => {
            try {
                var blob = new Blob([JSON.stringify(response.content)], { type: "application/json" });
                FileSaver.saveAs(blob, response.fileName + ".json");
            } catch (error) {

            }
        })
    }

    convertToXML(item: any) {
        this.exportationService.exportDefinition(item.number).subscribe(response => {
            try {
                var serializer = new easyxml({
                    singularize: true,
                    rootElement: 'NewDataSet',
                    dateFormat: 'ISO',
                    manifest: true,
                    unwrapArrays: true
                });
                var xml = serializer.render(response.content);
                var blob = new Blob([xml], { type: "application/xml" });
                FileSaver.saveAs(blob, response.fileName + ".xml");
            } catch (error) {
            }
        })
    }

}