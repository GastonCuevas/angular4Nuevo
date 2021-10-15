import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GenericControl, PaginatorComponent, IntelligentReportComponent } from '../../+shared';
import { CommonService, ToastyMessageService } from '../../+core/services';
import { MedicalInsuranceLiquidationService } from '../medical-insurance-liquidation.service';
import { LiquidateMedicalInsurance, ModelForReport } from '../util/models';
import * as moment from 'moment';

@Component({
	selector: 'app-medical-insurance-liquidation-list',
	templateUrl: './medical-insurance-liquidation-list.component.html',
	styleUrls: ['./medical-insurance-liquidation-list.component.scss']
})
export class MedicalInsuranceLiquidationListComponent implements OnInit {
    isLoading = true;
    dataSource = new Array<LiquidateMedicalInsurance>();
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
        { key: 'medicalEnsurance', label: 'Obra social', type: 'autocomplete', class: 'col s12 m4', functionForData: this.commonService.getMedicalInsurances(), searchProperty: 'medicalInsuranceNumber' },
        { key: 'number', label: 'Código de Liquidación', type: 'text', class: 'col s12 m2', filterType: 'number', },
        { key: 'dateFrom', label: 'Desde', type: 'date', class: 'col s12 m2', filterType: 'date', searchProperty: 'dateGeneration'},
        { key: 'dateTo', label: 'Hasta', type: 'date', class: 'col s12 m2', filterType: 'date', searchProperty: 'dateGeneration' },
        { key: 'type', label: 'Estado', type: 'select', class: 'col s12 m2',parameter: true, options:[{ number: 0, name: 'Todas' },{ number: 1, name: 'CANCELADO' },{number: 2, name: 'COBRO PARCIAL'},{number: 3, name: 'NO CANCELADA'}],value:0}
	];

	constructor(
		public miLiquidationService: MedicalInsuranceLiquidationService,
		private router: Router,
        public commonService: CommonService,
		private toastyMessageService: ToastyMessageService,
	) { }

	ngOnInit() {
    }

    onFilterChange(filterBy: string) {
        this.filterBy = filterBy;
        this.paginatorComponent.paginator.currentPage = 1;
        this.loadLiquidateMedicalInsurance();
    }

    onPageChange() {
        this.loadLiquidateMedicalInsurance();
    }

    private loadLiquidateMedicalInsurance() {
        this.miLiquidationService.getAllLiquidations(this.paginatorComponent.paginator, this.filterBy, this.sort)
            .finally(() => this.isLoading = false)
            .subscribe(response => {
                this.paginatorComponent.loadPaginator(response.itemsCount);
                this.dataSource = response.model;
            },
            error => {
                this.toastyMessageService.showErrorMessagge('Ocurrio un error al obtener los datos.');
            });
    }

    private setModelForReport() {
        // this.modelForReport = data;
        this.modelForReport.liquidaciones.forEach(liq => {
                    liq.fecha = moment(liq.fecha).format('DD/MM/YYYY HH:mm');
                    liq.fechaCobro = moment(liq.fechaCobro).format('DD/MM/YYYY');
        });
        this.modelForReport.internaciones.forEach(liq => {
                    liq.fecha = moment(liq.fecha).format('DD/MM/YYYY HH:mm');
                    liq.fechaHasta = moment(liq.fechaHasta).format('DD/MM/YYYY HH:mm');
                    liq.fechaCobro = moment(liq.fechaCobro).format('DD/MM/YYYY');
                });
            
            this.modelForReport.fecha = moment().format('DD/MM/YYYY HH:mm');
            this.modelForReport.fechaDesde = moment(this.modelForReport.fechaDesde).format('DD/MM/YYYY');
            this.modelForReport.fechaHasta = moment(this.modelForReport.fechaHasta).format('DD/MM/YYYY');
		
    }

    actionReport(item: any) {
        this.miLiquidationService.getReportLiquidations(item.i)
            .finally(() => this.isLoading = false)
            .subscribe(response => {
                this.modelForReport = response.model;
                this.setModelForReport();
                this.printLiq();
            },
            error => {
                this.toastyMessageService.showErrorMessagge('Ocurrio un error al obtener los datos.');
            });
            item.e.stopPropagation();
    }
    printLiq(){
        this.iReport.generateReportWithData(this.modelForReport, 3005, true);
    }
}