import { Component, OnInit, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import{ ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';

import { ToastyMessageService, LoadingGlobalService } from '../../+core/services';
import { IntellReportUserService } from '../../+intellReport-finalUser/intellReport-finalUser.service';
// import { IService } from '../../interface/service.interface';

import { ConfigCKEditor } from './config-ckeditor';
import * as jquery from 'jquery';
import { ExportationDetail } from '../../models';

@Component({
    selector: 'app-intelligent-report',
    templateUrl: './intelligent-report.component.html',
    // providers: [IntellReportUserService]
})
export class IntelligentReportComponent implements OnInit, AfterViewInit  {

    // @Input() isLoading: boolean;
    resultQuery: any;
    model: any;
    dataSource: Array<any>;
    htmlForDC: string;
    htmlForCKE: string;
    config = ConfigCKEditor.CONFIG_PRINT;
    showCKE = false;
    showDynamicComponent = false;
    parameters = new Array<Parameter>();

    private exportationDetail: ExportationDetail;
    // private parameters = new Array<Parameter>();
    // private query: { sql: string, parameters: Array<Parameter> }
    private query = new Query();

    constructor(
        private cdRef : ChangeDetectorRef,
        private toastyMessageService: ToastyMessageService,
        public loadingService: LoadingGlobalService,
        public intellReportUserService: IntellReportUserService,
        ) {
    }

    ngOnInit() {
        // this.loadExportDetail();
    }

    ngAfterViewInit() {}

    // private loadExportDetail() {
    //     // this.isLoading = true;
    // }

    generateReport(id: number, reportId: number) {
        this.restartComponent();
        this.loadingService.showLoading('Preparando para imprimir...');
        this.intellReportUserService.getExporDetailBy(reportId)
            // .finally(() => this.loadingService.hideLoading())
            .subscribe(response => {
                this.exportationDetail = response.model;

                this.parameters.push({ key: 'id', value: id });

                if (this.exportationDetail.sql) {
                    let sentences = this.exportationDetail.sql.split(';');
                    let sentence: Sentence;
                    sentences.forEach(s => {
                        const values = s.split(':');
                        if (values.length == 3) {
                            sentence = new Sentence();
                            sentence.property = values[0];
                            sentence.sql = values[1];
                            sentence.parameters = this.parameters;
                            sentence.type = parseInt(values[2]);
                            this.query.sentences.push(sentence);
                        }
                    });
                }

                if (this.exportationDetail.docHtml) {
                    this.intellReportUserService.getResultBy(this.query)
                        .finally(() => this.loadingService.hideLoading())
                        .subscribe(
                        response => {
                            this.resultQuery = response.model;
                            // this.dataSource = response.model;
                            // if (this.dataSource.length > 0) this.model = this.dataSource[0];

                            let auxString: string = this.exportationDetail.docHtml || 'Sin Proforma cargada.';
                            auxString = auxString.replace(/angular-ngFor/g, '*ngFor');
                            auxString = auxString.replace(/angular-ngfor/g, '*ngFor');
                            this.htmlForDC = auxString;
                            this.showDynamicComponent = true;
                        },
                        error => {
                            this.toastyMessageService.showToastyError(error, 'Error al generar el reporte');
                        });
                }
            },
            error => {
                this.loadingService.hideLoading()
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al obtener los datos para el reporte');
            });
    }

    generateReportWithData(data: any, idExporDetail: number, showLoading?: boolean) {
        this.restartComponent();
        if (showLoading) this.loadingService.showLoading('Preparando para imprimir...');
        this.intellReportUserService.getExporDetailBy(idExporDetail)
            .finally(() => this.loadingService.hideLoading())
            .subscribe(response => {
                this.exportationDetail = response.model;
                this.resultQuery = data;
                let auxString: string = this.exportationDetail.docHtml || 'Sin Proforma cargada.';
                auxString = auxString.replace(/angular-ngFor/g, '*ngFor');
                auxString = auxString.replace(/angular-ngfor/g, '*ngFor');
                auxString = auxString.replace(/angular-ngIf/g, '*ngIf');
                auxString = auxString.replace(/angular-ngif/g, '*ngIf');
                this.htmlForDC = auxString;
                this.showDynamicComponent = true;
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al obtener los datos para el reporte');
            });
    }

    generateReportWithSQL(parameters: Array<Parameter>, idExporDetail: number) {
        this.restartComponent();
        this.loadingService.showLoading('Preparando para imprimir...');
        this.intellReportUserService.getExporDetailBy(idExporDetail)
            .subscribe(response => {
                this.exportationDetail = response.model;
                this.parameters = parameters;

                if (this.exportationDetail.sql) {
                    let sentences = this.exportationDetail.sql.split(';');
                    let sentence: Sentence;
                    sentences.forEach(s => {
                        const values = s.split(':');
                        if (values.length == 3) {
                            sentence = new Sentence();
                            sentence.property = values[0];
                            sentence.sql = values[1];
                            sentence.parameters = this.parameters;
                            sentence.type = parseInt(values[2]);
                            this.query.sentences.push(sentence);
                        }
                    });
                }

                if (this.exportationDetail.docHtml) {
                    this.intellReportUserService.getResultBy(this.query)
                        .finally(() => this.loadingService.hideLoading())
                        .subscribe(
                        response => {
                            this.resultQuery = response.model;

                            let auxString: string = this.exportationDetail.docHtml || 'Sin Proforma cargada.';
                            auxString = auxString.replace(/angular-ngFor/g, '*ngFor');
                            auxString = auxString.replace(/angular-ngfor/g, '*ngFor');
                            auxString = auxString.replace(/angular-ngIf/g, '*ngIf');
                            auxString = auxString.replace(/angular-ngif/g, '*ngIf');
                            this.htmlForDC = auxString;
                            this.showDynamicComponent = true;
                        },
                        error => {
                            this.toastyMessageService.showToastyError(error, 'Error al generar el reporte');
                        });
                }
            },
            error => {
                this.loadingService.hideLoading()
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al obtener los datos para el reporte');
            });
    }

    private restartComponent() {
        this.showCKE = false;
        this.showDynamicComponent = false;
        this.parameters = [];
        this.query = new Query();
        this.htmlForDC = '';
        this.htmlForCKE = '';
    }

    onReady(event: any) {
        const element = document.getElementById('ckeditorPrint');
        let elementsIFrame: any = [];
        if (element) elementsIFrame = element.getElementsByTagName('iframe');
        if (elementsIFrame.length > 0) elementsIFrame[0].contentWindow.print();
    }

    loadCKE(event: any) {
        this.htmlForCKE = event;
        this.showCKE = true;
        this.cdRef.detectChanges();
    }

}

type Parameter = {key: string, value: any};

class Sentence {
    property: string;
    sql: string;
    parameters: Array<Parameter>;
    type: number
}

class Query {
    sentences: Array<Sentence> = new Array<Sentence>();
}