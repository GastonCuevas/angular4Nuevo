import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';
import { IntellReportUserService } from '../intellReport-finalUser.service';
import { IService } from '../../interface/service.interface';
import * as XLSX from 'xlsx';
import { TableExport } from "tableexport";
import { saveAs as importedSaveAs } from "file-saver";
import { ExportDataXLSX } from '../models/exportDataXLSX';
import { ExportDataCSV } from '../models/exportDataXLSX';
import { ExportDataXLSXhtml } from '../models/exportDataXLSX';
import { ExportDataCSVhtml } from '../models/exportDataXLSX';
import { ExportDataTXThtml } from '../models/exportDataXLSX';
import { ExportDataTXT } from '../models/exportDataXLSX';
import { ValidationService } from './../../+shared/forms/validation.service';
import { MaterializeDirective, MaterializeAction } from "angular2-materialize";

import { ConfigCKEditor } from '../config-ckeditor';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import * as jquery from 'jquery';

@Component({
    selector: 'app-intell-report-viewHTML',
    templateUrl: './intell-report-viewHTML.component.html',
    styleUrls: ['./intell-report-viewHTML.component.scss'],
    providers: [IntellReportUserService]
})

export class IntellReportViewHTMLComponent implements OnInit, OnChanges, AfterViewInit  {
    @Input() title: string = "";
    @Input() columns: Array<any>=[];
    @Input() isLoading: boolean;
    @Input() sourceData: Array<any>;
    @Input() paginator: {
        pageSize: number,
        totalItems: number,
        currentPage: number
    };
    @Input() sourceService: IService;
    @Output() pageChange: EventEmitter<any> = new EventEmitter<any>();
    @Input() queryPaginator: boolean = false;
    @Input() sqlParameters: any;
    @Input() typeDownload: string;
    @Input() separe: string;
    @Output() showReports: EventEmitter<any> = new EventEmitter<any>();

    @Input() exportationDetailSelect: any;
    @Input() showBtnToExport: boolean = true;
    pages: Array<any> = [];
    adjacentPagesCount = 2
    sourceDataAux: Array<any>;
    // hideElement: boolean = true;
    pdfMake: any;
    pdfFonts: any;
    bodyPDF: Array<any> = [];
    filePDF: any;
    fileSend: any;
    filea: any;

    properties: any;
    emailPattern = ValidationService.emailPattern;
    address: string = "";
    subjects: string = "";
    contents: string = "";
    modalActions1 = new EventEmitter<string | MaterializeAction>();
    model1Params = [
        {
            dismissible: false,
            complete: function () { }
        }
    ]

    @ViewChild('docHtml') docHtml: ElementRef;
    private dochtmlImg: any;
    public docHtmlString: string;

    @ViewChild('dynamicComponent') dynamicComponent: ElementRef;
    private auxStringHtml: any;
    stringHtml: string = ConfigCKEditor.CARGANDO_HTML;
    config = ConfigCKEditor.CONFIG_PRINT;
    withDocHtml: boolean;

    constructor(
        private _router: Router,
        public _intellReportUserService: IntellReportUserService,
        ) {
        this.pdfMake = require<any>('pdfmake/build/pdfmake.js');
        this.pdfFonts = require<any>('pdfmake/build/vfs_fonts.js');
        this.pdfMake.vfs = this.pdfFonts.pdfMake.vfs;
    }

    ngOnInit() {
        this.withDocHtml = this.exportationDetailSelect.docHtml ? true : false;
        if (this.withDocHtml) {
            let auxString: string = this.exportationDetailSelect.docHtml;
            auxString = auxString.replace('angular="ngFor"', '*ngFor="let data of list"');
            auxString = auxString.replace('angular="ngfor"', '*ngFor="let data of list"');
            this.docHtmlString = auxString;
        }

        if (this.sourceService) {
            this.paginator.currentPage = 1;
            this.paginator.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
            this.updateTable();
            this.calculatePages();
        } else {
            this.sourceDataAux = this.sourceData;
        }
    }

    ngAfterViewInit() {
        this.auxStringHtml = this.dynamicComponent.nativeElement.outerHTML;
    }

    ngOnChanges() {
        this.calculatePages();
    }

    previousPage() {
        if (this.paginator.currentPage == 1)
            return;
        this.paginator.currentPage--;
        this.calculatePages();
        this.emitChange();
    }

    nextPage() {
        if (this.paginator.currentPage == this.pages.length)
            return;

        this.calculatePages();
        this.paginator.currentPage++;
        this.emitChange();
    }

    selectPage(page: any) {
        if (this.paginator.currentPage == page)
            return;

        this.calculatePages();
        this.paginator.currentPage = page;
        this.emitChange();
    }

    // Pagination Events
    selectPageSize() {
        this.paginator.currentPage = 1;
        this.calculatePages();
        this.emitChange();
    }

    emitChange() {
        if (this.sourceService) {
            this.updateTable();
        } else {
            this.pageChange.emit(this.paginator);
        }
    }

    calculatePages() {
        let pagesCount = Math.ceil(this.paginator.totalItems / this.paginator.pageSize);
        this.pages = [];
        for (var i = 1; i <= pagesCount; i++)
            this.pages.push(i);
    }

    updateTable() {
        this.sourceService.getAll(this.paginator, null, this.sqlParameters)
            .subscribe(result => {
                this.sourceData = result.model;
                this.paginator.totalItems = result.itemsCount;
                this.paginator.pageSize = result.pageSize;
                this.paginator.currentPage = result.pageNumber;
                this.isLoading = false;
            })
        this.getResultQueryAux();
    }

    getResultQueryAux() {
        this.sourceService.getResultQuery(this.sqlParameters)
            .subscribe(result => {
                this.sourceDataAux = result.model;
            },
            error => {
            })
    }

    getPropByString(obj: any, propString: string) {
        if (!propString)
            return obj;

        var prop, props = propString.split('.');

        for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
            prop = props[i];

            var candidate = obj[prop];
            if (candidate !== undefined) {
                obj = candidate;
            } else {
                break;
            }
        }
        return obj[props[i]];
    }

    showListReports() {
        this.showReports.emit();
    }

    downloadReportXLSX() {
        let ExportButtons = <HTMLElement> document.getElementById('table');
        let instance: any = new TableExport(ExportButtons, {
            formats: ['xlsx'],
            filename: this.exportationDetailSelect.fileName,
            exportButtons: false
        });
        //                                               ["id" of selector]  [format]
        const exportData = (instance.getExportData() as ExportDataXLSX)['table']['xlsx'];;
        instance.export2file(exportData.data, exportData.mimeType, exportData.filename, exportData.fileExtension);
    }

    downloadReportCSV() {
        let ExportButtons = <HTMLElement> document.getElementById('table');
        let instance = new TableExport(ExportButtons, {
            formats: ['csv'],
            filename: this.exportationDetailSelect.fileName,
            exportButtons: false
        });
        //                                              ["id" of selector]  [format]
        const exportData = (instance.getExportData() as ExportDataCSV)['table']['csv'];
        //                        data          // mime              // name              // extension
        instance.export2file(exportData.data, exportData.mimeType, exportData.filename, exportData.fileExtension);
    }

    downloadReportTXT() {
        // if (this.queryPaginator) {
        //     var ExportButtons = <HTMLElement>document.getElementById('table');
        //     let instance = new TableExport(ExportButtons, {
        //         formats: ['txt'],
        //         filename: this.exportationDetailSelect.fileName,
        //         exportButtons: false
        //     });
        //     //                                              ["id" of selector]  [format]
        //     var exportData = (instance.getExportData() as ExportDataTXT)['table']['txt'];
        //     //    //                   // data          // mime              // name              // extension
        //     instance.export2file(exportData.data, exportData.mimeType, exportData.filename, exportData.fileExtension);
        // } else {
        //     var ExportButtons = <HTMLElement>document.getElementById('tableHTML');
        //     let instance = new TableExport(ExportButtons, {
        //         formats: ['txt'],
        //         filename: this.exportationDetailSelect.fileName,
        //         exportButtons: false
        //     });
        //     //                                              // "id" of selector // format
        //     var exportData = (instance.getExportData() as ExportDataTXThtml)['tableHTML']['txt'];
        //     //    //                   // data          // mime              // name              // extension
        //     instance.export2file(exportData.data, exportData.mimeType, exportData.filename, exportData.fileExtension);
        // }
        let ExportButtons = <HTMLElement> document.getElementById('table');
        let instance = new TableExport(ExportButtons, {
            formats: ['txt'],
            filename: this.exportationDetailSelect.fileName,
            exportButtons: false
        });
        //                                              ["id" of selector]  [format]
        let exportData = (instance.getExportData() as ExportDataTXT)['table']['txt'];
        //                        data          // mime              // name              // extension
        instance.export2file(exportData.data, exportData.mimeType, exportData.filename, exportData.fileExtension);
    }

    private async generatePDF() {
        // await this.capture();
        this.bodyPDF = [];
        let headers: Array<any> = [];
        let pageOri = '';
        let fontSiz = 0;
        let pageMarg = [0, 0, 0, 0];

        if (!this.sourceService) {
            headers = Object.keys(this.sourceData[0]);
            this.loadBodyPDF(headers, this.sourceData);
        } else {
            await this.getResultQueryAux();
            headers = Object.keys(this.sourceDataAux[0]);
            this.loadBodyPDF(headers, this.sourceDataAux);
        }

        if (headers.length < 15) {
            pageOri = 'portrait';
            fontSiz = 12;
            pageMarg = [20, 25, 20, 25];
        } else {
            pageOri = 'landscape';
            fontSiz = 5;
            pageMarg = [5, 20, 5, 20];
        }

        const body = this.bodyPDF;
        this.filePDF = {
            content: [
                // {
                //     image: this.dochtmlImg,
                //     width: 555,
                //     alignment: 'center'
                // },
                {
                    style: 'tablePDF',
                    table: {
                        body
                    }
                }
            ],
            pageOrientation: pageOri,
            pageMargins: pageMarg,
            styles: {
                tablePDF: {
                    fontSize: fontSiz,
                    alignment: 'center'
                }
            }
        };
    }

    private loadBodyPDF(headers: Array<any>, dataSource: Array<any>) {
        this.bodyPDF = [];
        let rowValues: Array<any> = [];

        this.bodyPDF.push(headers);

        for (let j = 0; dataSource.length > j; j++) {
            rowValues = [];
            for (let k = 0; headers.length > k; k++) {
                let name = headers[k];
                rowValues.push(dataSource[j][name]);
            }
            this.bodyPDF.push(rowValues);
        }
    }

    async downloadReportPDF() {
        await this.generatePDF();
        this.pdfMake.createPdf(this.filePDF).download(this.exportationDetailSelect.fileName.split('.')[0] + ".pdf");
        this.filePDF = null;
    }

    async printReportPDF() {
        await this.generatePDF();
        this.pdfMake.createPdf(this.filePDF).print();
        this.filePDF = null;
    }

    openModal1() {
        this.modalActions1.emit({ action: "modal", params: ['open'] });
    }

    closeModal1() {
        this.modalActions1.emit({ action: "modal", params: ['close'] });
        this.address = "";
        this.subjects = "";
        this.contents = "";
    }

    async sendToMail() {
        await this.generatePDF();

        const pdfDocGenerator = this.pdfMake.createPdf(this.filePDF)
        pdfDocGenerator.getBase64((data: any) => {
            this.fileSend = data;
            var dd = {
                ToAddress: this.address,
                Subject: this.subjects,
                Content: this.contents,
                File: this.fileSend
            }
            this._intellReportUserService.sendToEmail(dd).subscribe(
                response => {
                    let a = response.model.toAddresses;
                    this.address = "";
                    this.subjects = "";
                    this.contents = "";
                },
                error => {
                    this.address = "";
                    this.subjects = "";
                    this.contents = "";
                });

        });
    }

    /*
    async capture() {
        let docHtml = this.docHtml.nativeElement;
        let options: Html2Canvas.Html2CanvasOptions = {
            allowTaint: false
        }
        // await html2canvas(document.body, options).then((canvas: any) => {
        await html2canvas(docHtml, options).then((canvas: any) => {
            // document.body.appendChild(canvas);
            this.dochtmlImg = canvas.toDataURL('image/jpeg', 1.0);
            // this.dochtmlImg = canvas.toDataURL('image/png');
            // this.dochtmlImg = canvas.toDataURL('image/jpeg');
        });
    } */

    onReady(event: any) {
        this.stringHtml = this.auxStringHtml;
    }

}









