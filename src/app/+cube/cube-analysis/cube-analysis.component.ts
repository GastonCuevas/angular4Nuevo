import { Component, OnInit, Inject, ElementRef, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { ToastyMessageService, UtilityService } from '../../+core/services';
import { CubeService } from '../cube.service';
import { Cube } from '../../models';
import { Sentence, ExportDataXLSX, StringHTML } from '../util/util';

import { TableExport } from "tableexport";
import 'pivottable/dist/pivot.js';
import '../util/pivot.es.js';
import * as jquery from 'jquery';
import { MaterializeAction } from 'angular2-materialize';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var jQuery: any;

@Component({
    selector: 'app-cube-analysis',
    templateUrl: './cube-analysis.component.html',
    styleUrls: ['./cube-analysis.component.scss']
})
export class CubeAnalysisComponent implements OnInit {

    isLoading = true;
    selectedCube = new Cube();
    isSaving = false;
    modalActions = new EventEmitter<string | MaterializeAction>();
    form: FormGroup;
    private elementRef: ElementRef;
    private dataSource = new Array<any>();
    private sentence = new Sentence();

    constructor(
        private toastyMessageService: ToastyMessageService,
        private utilityService: UtilityService,
        private cubeService: CubeService,
        @Inject(ElementRef) el: ElementRef
    ) {
        this.elementRef = el;
        this.selectedCube = this.cubeService.selectedCube;
        if (!this.selectedCube) this.utilityService.navigate(`archivos/cubo`);
    }

    ngOnInit() {}

    ngAfterViewInit(){
        // if (this.selectedCube) this.loadPivotTable();
        this.loadPivotTable();
    }

    private loadPivotTable() {
        if (!this.elementRef || !this.elementRef.nativeElement || !this.elementRef.nativeElement.children) {
            console.log('cant build without element');
            return;
        }

        const container = this.elementRef.nativeElement;
        const inst = jQuery(container);
        const targetElement = inst.find('#cuboPT');
        if (!targetElement) {
            console.log('cant find the pivot element');
            return;
        }
        while (targetElement.firstChild) {
            targetElement.removeChild(targetElement.firstChild);
        }

        this.sentence.parameters.push({ key: 'dateFrom', value: this.utilityService.formatDateBE(this.selectedCube.dateFrom, 'DD/MM/YYYY') });
        this.sentence.parameters.push({ key: 'dateTo', value: this.utilityService.formatDateBE(this.selectedCube.dateTo, 'DD/MM/YYYY') });
        this.sentence.sql = this.selectedCube.query;
        const rows = this.cubeService.isLoad ? this.selectedCube.row.split(',') : [];
        const cols =  this.cubeService.isLoad ? this.selectedCube.col.split(',') : [];
        this.cubeService.getDataBy(this.sentence)
            .finally(() => this.isLoading = false)
            .subscribe( response => {
                this.dataSource = response.model;
                targetElement.pivotUI(
                this.dataSource,
                {
                    rows: rows,
                    cols: cols,
                    vals: [],
                    aggregatorName: "Cuenta",
                    rendererName: "Tabla",
                    onRefresh: function(config: any) {
                        if(config.cols.length != 0 || config.rows.length != 0) {
                            $("#exportXLSX").removeAttr('disabled');
                        } else {
                            $("#exportXLSX").attr('disabled', 'true')
                        }
                    }

                },false, "es");
            }, error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al obtener los datos para analizar.');
            });
    }

    onReturn() {
        this.cubeService.isLoad = false;
        this.utilityService.navigate(`archivos/cubo`);
    }

    downloadReportXLSX() {
        $('table.pvtTable:first').attr('id', 'pvtTableExport');
        let tableHTMLElement = <HTMLElement> document.getElementById('pvtTableExport');
        let instance: any = new TableExport(tableHTMLElement, {
            formats: ['xlsx'],
            filename: this.selectedCube.name,
            exportButtons: false
        });
        //                                                               ["id" of selector]  [format]
        const exportData = (instance.getExportData() as ExportDataXLSX)['pvtTableExport']['xlsx'];;
        instance.export2file(exportData.data, exportData.mimeType, exportData.filename, exportData.fileExtension);
    }

    print() {
        let htmlStr = '';
        $('table.pvtTable:first').attr('id', 'pvtTableExport');
        const tableHTMLElement = <HTMLElement> document.getElementById('pvtTableExport');
        let newWindow = window.open('','_blank');

        if (newWindow && tableHTMLElement) {
            htmlStr = `${StringHTML.START_HTML}
                <span class="card-title">${this.selectedCube.name}</span>
                <span class="card-subtitle">Desde: ${this.selectedCube.dateFrom} Hasta: ${this.selectedCube.dateTo}</span>
                <hr>
                <div>
                    ${tableHTMLElement.outerHTML}
                </div>
                ${StringHTML.END_HTML}`;
            newWindow.document.write(htmlStr);
            newWindow.document.close();
            newWindow.print();
            newWindow.close();
        }
    }

    openModal() {
        this.modalActions.emit({ action: 'modal', params: ['open'] });
    }
    closeModal() {
        this.modalActions.emit({ action: 'modal', params: ['close'] });
    }
    save(){
		const selectedCube = Object.assign({}, this.selectedCube);
        let col: string[] = [];
        let fil: string[] = [];
        let span = $("table.pvtUi tr:eq(1) td:eq(1) li span.pvtAttr:first-child");
        span.find("span.pvtTriangle" ).remove();
        span.each(function(index,value:any){ col.push(value.textContent); })
        span = $("table.pvtUi tr:eq(2) td:eq(0) li span.pvtAttr:first-child");
        span.find("span.pvtTriangle" ).remove();
        span.each(function(index,value:any){ fil.push(value.textContent); })

        this.isSaving = true;
        selectedCube.col = col.join(",");
        selectedCube.row = fil.join(",");
        selectedCube.dateFrom = this.utilityService.formatDateBE(selectedCube.dateFrom);
        selectedCube.dateTo = this.utilityService.formatDateBE(selectedCube.dateTo);
        selectedCube.name = this.selectedCube.name;
        if(!selectedCube.name || (!selectedCube.row.length && !selectedCube.col.length)) {
            this.toastyMessageService.showErrorMessagge('Error faltan datos del informe.');
            this.isSaving = false;
            return;
        }
        selectedCube.number = this.selectedCube.number || 0;
        if(this.selectedCube.number){
            this.cubeService.update(selectedCube)
            .finally(() => this.isSaving = false )
            .subscribe( response => {
                this.dataSource = response.model;
                this.closeModal();
                this.onReturn();
            }, error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al editar los datos del informe.');
            });
        }else{
            this.cubeService.insert(selectedCube)
            .finally(() => this.isSaving = false)
            .subscribe( response => {
                this.dataSource = response.model;
                this.closeModal();
                this.onReturn();
            }, error => {
                // this.isLoading = false;
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al guardar los datos del informe.');
            });
        }
    }
}
