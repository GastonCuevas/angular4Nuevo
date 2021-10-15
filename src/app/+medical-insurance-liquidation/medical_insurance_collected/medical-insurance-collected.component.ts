import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GenericControl, PaginatorComponent } from '../../+shared';
import { CommonService, ToastyMessageService, LoadingGlobalService } from '../../+core/services';
import { MedicalInsuranceLiquidationService } from '../medical-insurance-liquidation.service';
import { LiquidateMedicalInsurance } from '../util/models';
import { MaterializeAction } from 'angular2-materialize';
import * as moment from 'moment';

@Component({
    selector: 'app-medical-insurance-collected',
    templateUrl: './medical-insurance-collected.component.html',
    styleUrls: ['./medical-insurance-collected.component.scss']
})

export class MedicalInsuranceCollectedComponent implements OnInit {
    isLoading = true;
    dataSource = new Array<LiquidateMedicalInsurance>();
    private filterBy = '';
    sort = {
        sortBy: 'dateGeneration',
        ascending: true
    };

    isSaving = false;
    paymentValid = false;
    modalActions = new EventEmitter<string | MaterializeAction>();
    payment: number;
    liquidation = new LiquidateMedicalInsurance();

    @ViewChild(PaginatorComponent) paginatorComponent: PaginatorComponent;

    controlsToFilter: Array<GenericControl> = [
        { key: 'medicalEnsurance', label: 'Obra social', type: 'autocomplete', class: 'col s12 m4', functionForData: this.commonService.getMedicalInsurances(), searchProperty: 'medicalInsuranceNumber' },
        { key: 'number', label: 'Código de Liquidación', type: 'text', class: 'col s12 m2', filterType: 'number', },
        { key: 'dateFrom', label: 'Desde', type: 'date', class: 'col s12 m2', filterType: 'date', searchProperty: 'dateGeneration' },
        { key: 'dateTo', label: 'Hasta', type: 'date', class: 'col s12 m2', filterType: 'date', searchProperty: 'dateGeneration' },
        { key: 'type', label: 'Estado', type: 'select', class: 'col s12 m2',parameter: true, options:[{ number: 0, name: 'Todas' },{number: 2, name: 'COBRO PARCIAL'},{number: 3, name: 'NO CANCELADA'}],value:0},
    ];

    constructor(
        public miLiquidationService: MedicalInsuranceLiquidationService,
        private router: Router,
        public commonService: CommonService,
        private toastyMessageService: ToastyMessageService,
        private loadingGlobalService: LoadingGlobalService
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
        this.miLiquidationService.getPracticesToCollectOrReject(this.paginatorComponent.paginator, this.filterBy, this.sort)
            .finally(() => this.isLoading = false)
            .subscribe(response => {
                this.paginatorComponent.loadPaginator(response.itemsCount);
                this.dataSource = response.model;
            },
            error => {
                this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al obtener los datos');
            });
    }

    openModal(item: any) {
        this.liquidation = item;
        this.modalActions.emit({ action: 'modal', params: ['open'] });
    }

    closeModal() {
        this.modalActions.emit({ action: 'modal', params: ['close'] });
    }

    rejectPractice(item: any) {
        this.loadingGlobalService.showLoading('Cargando...');
        const now = moment().format();
        item.rejected = true;
        item.rejectedDate = now;
        this.miLiquidationService.rejectPractice(item)
            .finally(() => this.loadingGlobalService.hideLoading())
            .subscribe(
            response => {
                this.reset();
                this.onPageChange();
                this.toastyMessageService.showSuccessMessagge('Se rechazo la práctica exitosamente');
            },
            error => {
                this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al rechazar la práctica');
            });
    }

    collectLiquidation() {
        this.isSaving = true;
        this.liquidation.saldo -= this.payment;
        if (this.liquidation.saldo <= 0) {
            var now = moment().format();
            this.liquidation.liquidations.forEach(x => {
                x.paymentDate = now;
            });
        }
        this.miLiquidationService.collectLiquidation(this.liquidation)
            .finally(() => this.isSaving = false)
            .subscribe(
            response => {
                this.reset();
                this.onPageChange();
                this.toastyMessageService.showSuccessMessagge('Se cobró la liquidación exitosamente');
            },
            error => {
                this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al cobrar la liquidación');
            });
    }

    reset() {
        this.miLiquidationService.resetService();
        this.payment = 0;
        this.closeModal();
    }

    onKeyUp(event: any) {
        this.paymentValid = !!this.payment;
    }
}