import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GenericControl, PaginatorComponent, IntelligentReportComponent } from '../../+shared';
import { CommonService, ToastyMessageService, UtilityService } from '../../+core/services';
import { ProfessionalLiquidationService } from '../professional-liquidation.service';
import { LiquidateProfessional, ModelForReport } from '../util/models';
import * as moment from 'moment';

@Component({
	selector: 'app-professional-history',
    templateUrl: './professional-history.component.html',
    styleUrls: ['./professional-history.component.scss']
})
export class ProfessionalHistoryComponent implements OnInit {
    isLoading = true;
    dataSource = new Array<LiquidateProfessional>();
    modelForReport: ModelForReport;
    private item: any;
    private filterBy = '';
    sort = {
        sortBy: 'dateGeneration',
        ascending: true
    }

    @ViewChild(PaginatorComponent) paginatorComponent: PaginatorComponent;
    @ViewChild('iReport') iReport: IntelligentReportComponent;

    controlsToFilter: Array<GenericControl> = [
        { key: 'professional', label: 'Profesional', type: 'autocomplete', class: 'col s12 m4', functionForData: this.commonService.getProfessionals(), searchProperty: 'professionalNumber' },
        { key: 'number', label: 'Código de Liquidación', type: 'text', class: 'col s12 m2', filterType: 'number', },
        { key: 'dateFrom', label: 'Desde', type: 'date', class: 'col s12 m3', filterType: 'date', searchProperty: 'dateGeneration' },
        { key: 'dateTo', label: 'Hasta', type: 'date', class: 'col s12 m3', filterType: 'date', searchProperty: 'dateGeneration' },
    ];

    constructor(
        public profLiquidationService: ProfessionalLiquidationService,
		private router: Router,
        public commonService: CommonService,
        private toastyMessageService: ToastyMessageService,
        private utilityService: UtilityService,

	) { }

    ngOnInit() {
    }

    onFilterChange(filterBy: string) {
        this.filterBy = filterBy;
        this.paginatorComponent.paginator.currentPage = 1;
        this.loadLiquidations();
    }

    onPageChange() {
        this.loadLiquidations();
    }

    private loadLiquidations() {
        this.profLiquidationService.getAllLiquidations(this.paginatorComponent.paginator, this.filterBy, this.sort)
            .finally(() => this.isLoading = false)
            .subscribe(response => {
                this.paginatorComponent.loadPaginator(response.itemsCount);
                this.dataSource = response.model;
            },
            error => {
                this.toastyMessageService.showErrorMessagge('Ocurrio un error al obtener los datos.');
            });
    }

    private setModelForReport(data: any) {
        this.modelForReport = new ModelForReport();
        var liqInt = new Array<any>();
        var liqAmb = new Array<any>();
        var concExt = new Array<any>();
        var concInt = new Array<any>();
        var concMed = new Array<any>();
        var concDeb = new Array<any>();
        //const modelForReport = new ModelForReport();
        this.modelForReport.professionalName = data.professionalName;
        data.liquidations.forEach((liq: any) => {
            liq.fechaDesde = moment(liq.fechaDesde).format('DD/MM/YYYY');
            liq.fechaHasta = moment(liq.fechaHasta).format('DD/MM/YYYY');
            if (liq.typeInternament) {
                //this.modelForReport.liqInternaciones.push(liq);
                liqInt.push(liq);
            } else {
                //this.modelForReport.liqAmbulatorios.push(liq);
                liqAmb.push(liq);
            }
            //
        //    this.modelForReport.professionalName = liq.professionalName;
        });
        data.concepts.forEach((c: any) => {

            switch (c.orderReport) {
                case 1:
                    {
                        //this.modelForReport.externs.push(c);
                        concExt.push(c);
                        break;
                    }
                case 2:
                    {
                        //this.modelForReport.internmentConcepts.push(c);
                        concInt.push(c);
                        break;
                    }
                case 3:
                    {
                        //this.modelForReport.medicalGuards.push(c);
                        concMed.push(c);
                        break;
                    }
                case 4:
                    {
                        //this.modelForReport.debits.push(c);
                        concDeb.push(c);
                        break;
                    }

            }
        });

        this.modelForReport.dateGeneration = moment().format('DD/MM/YYYY HH:mm');

        //this.modelForReport.dateGeneration = moment(data.dateGeneration).format('DD/MM/YYYY');
        this.modelForReport.dateGeneration = this.utilityService.formatDateFE(data.dateGeneration);
        this.modelForReport.total = data.total;
        //this.modelForReport.dateFrom = moment(data.dateFrom).format('DD/MM/YYYY');
        this.modelForReport.dateFrom = this.utilityService.formatDateFE(data.dateFrom);
        //this.modelForReport.dateTo = moment(data.dateTo).format('DD/MM/YYYY');
        this.modelForReport.dateTo = this.utilityService.formatDateFE(data.dateTo);
        this.modelForReport.precioPHs = data.precioPHs;
        this.modelForReport.fixedAmount = data.fixedAmount;

        this.modelForReport.liqInternaciones = liqInt;
        this.modelForReport.liqAmbulatorios = liqAmb;
        this.modelForReport.externs = concExt;
        this.modelForReport.internmentConcepts = concInt;
        this.modelForReport.medicalGuards = concMed;
        this.modelForReport.debits = concDeb;
    }

    actionReport(item: any) {
        this.profLiquidationService.getReportLiquidations(item.i)
            .finally(() => this.isLoading = false)
            .subscribe(response => {
                //this.modelForReport = response.model;
                this.setModelForReport(response.model);
                this.printLiq();
            },
            error => {
                this.toastyMessageService.showErrorMessagge('Ocurrio un error al obtener los datos.');
            });
        item.e.stopPropagation();
    }
    printLiq(){
        //this.iReport.generateReportWithData(this.modelForReport, 3002, true);
        this.iReport.generateReportWithData(this.modelForReport, 4005, true);
    }
}