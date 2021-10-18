import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterializeAction } from 'angular2-materialize/dist/materialize-directive';

import { ToastyMessageService, CommonService, NavBarService } from '../../../+core/services';

import { Navbar, Item } from '../../../models';

import { IntellReportUserService } from '../../../+intellReport-finalUser/intellReport-finalUser.service';

import { TableExport } from "tableexport";
import { ExportDataXLSX } from '../../../+intellReport-finalUser/models/exportDataXLSX';

declare var $: any;

@Component({
    selector: 'app-button-floating',
    templateUrl: 'button-floating.component.html',
	styleUrls: ['./button-floating.component.scss'],
	providers: [IntellReportUserService]
})

export class ButtonFloatingComponent implements OnInit {

    isLoading: boolean = true;
    // VARIABLES DEL COMPONENT
    @Input() item?: Item;
    @Input() private sentItem?: boolean;
    @Input() tableName?: string;

    // MANEJADOR DEL MODAL
    modalPrint = new EventEmitter<String | MaterializeAction>();
    // VARIABLES DEL MODAL
    typeReports: Array<any> = new Array<any>();
    exportationDetails: Array<any> = new Array<any>();
    reportSelectValue: any;
    subReportSelectValue: any;

    constructor(
        private router: Router,
        private navBarService: NavBarService,
        private toastyService: ToastyMessageService,
        public _intellReportUserService: IntellReportUserService,
        private commonService: CommonService
    ) {
        this.reportSelectValue = null;
        this.subReportSelectValue = null;
    }

    ngOnInit() {
        // this.loadTypesReport();
        if (!this.sentItem) {
            let findByWebMnu: Subscription = this.navBarService.getNavbars().subscribe(
                (res) => {
                    if (res.length != 0) {
                        this.item = this.navBarService.findItem(this.router.url, null);
                        if (findByWebMnu) findByWebMnu.unsubscribe();
                    }
                }
            );    
        }
    }

    downloadReportXLSX() {
        if (this.item) {
            let elementDom = <HTMLElement>document.getElementById('table');
            let instance: any = new TableExport(elementDom, {
                formats: ['xlsx'],
                filename: this.item.label,
                exportButtons: false
            });
            // ["id" of selector]  [format]
            const exportData = (instance.getExportData() as ExportDataXLSX)['table']['xlsx'];;
            instance.export2file(exportData.data, exportData.mimeType, exportData.filename, exportData.fileExtension);
        }
    }

    // FUNCIONES DEL MODAL
    openPrintModal() {
        if (this.item) {
            if (this.item.config) {
                this.tableName = this.tableName ? '/' + this.tableName : '';
                this.router.navigate(['administradorArchivos/intellReport/' + this.item.config + this.tableName])
            }
            else{
                this.loadTypesReport();
                this.modalPrint.emit({ action: "modal", params: ['open'] });
                this.reportSelectValue = null;
                this.subReportSelectValue = null;
                this.exportationDetails = new Array<any>();
            }
        }
    }

    cancelModalNew() {
        this.modalPrint.emit({ action: "modal", params: ['close'] });
    }

    saveModalNew() {
        if (this.item) {
            let item = this.item
            this.commonService.editItem(this.subReportSelectValue, this.item.codigo)
            .finally(() => this.cancelModalNew())
            .subscribe(
                 response => {
                     item.config = this.subReportSelectValue;
                     this.toastyService.showSuccessMessagge("Se guardaron los cambios");
                 },
                 error => {
                     this.toastyService.showToastyError(error, 'Ocurrió un error al guardar los cambios');
                 })
        }
    }

    loadTypesReport() {
        this._intellReportUserService.getAllTypesReport().subscribe(
            response => {
                this.typeReports = response.model;
                this.isLoading = false;
            },
            error => {
                this.toastyService.showErrorMessagge("Ocurrio un error al cargar el combo");
            });
    }

    loadSubreport(value: any) {
        const typeReport = this.typeReports.find(i=>i.number == value);
        if (typeReport) {
            this.exportationDetails = typeReport.exportationDetails
            this.subReportSelectValue = null;
        }
    }
}