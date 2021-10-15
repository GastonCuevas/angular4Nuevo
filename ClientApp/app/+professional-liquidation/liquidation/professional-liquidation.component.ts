import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastyMessageService, UtilityService, CommonService, LoadingGlobalService } from '../../+core/services';
import { ProfessionalLiquidationService } from '../professional-liquidation.service';
import { GenericControl, IntelligentReportComponent } from '../../+shared/';
import { IColumn } from '../../+shared/util';
import { ModelForReport, LiquidateProfessional, LiquidatePractice } from '../util/models';
import { PracticesToLiquidateComponent } from '../practices-to-liquidate/practices-to-liquidate.component';
import { PracticeToLiquidate } from '../util/models';
import { ProfessionalLiquidationContractComponent } from '../professional-liquidation-contract/professional-liquidation-contract.component';

import * as moment from 'moment';

@Component({
    selector: 'app-professional-liquidation',
    templateUrl: './professional-liquidation.component.html',
    styleUrls: ['./professional-liquidation.component.scss']
})
export class ProfessionalLiquidationComponent implements OnInit {

    @ViewChild(PracticesToLiquidateComponent) practicesToLiquidateComponent: PracticesToLiquidateComponent;
    @ViewChild(ProfessionalLiquidationContractComponent) profLiquidationComponent: ProfessionalLiquidationContractComponent;
    @ViewChild('iReport') iReport: IntelligentReportComponent;

    isSaving = false;
    liquidacionValid = false;
    itemsSelectedToLiquidate = 0;
    showConceptsForm = false;
    professionalLiquidations: Array<PracticeToLiquidate> = [];
    
    private modelForReport: ModelForReport;

    columns: Array<IColumn> = [
        { header: 'Práctica', property: 'practiceName' },
        { header: 'Fecha', property: 'date', type: 'date' },
        //{ header: 'Profesional', property: 'professionalName' },
        { header: 'O.S.', property: 'medicalInsuranceName' },
        { header: 'Paciente', property: 'patientName' },
        { header: 'Días', property: 'days' },
        { header: 'Liquidar', property: 'liquidate', type: 'checkbox', width: '120px', disableSorting: true },
    ];
    controlsToFilter: Array<GenericControl> = [
        { key: 'professionalNumber', label: 'Profesional', type: 'autocomplete', class: 'col s12 m6', functionForData: this.commonService.getProfessionals(), parameter: true, required: true },
        { key: 'dateFrom', label: 'Período Desde', type: 'date', class: 'col s12 m3', parameter: true, required: true },
        { key: 'dateTo', label: 'Período Hasta', type: 'date', class: 'col s12 m3', parameter: true, required: true },
        { key: 'medicalInsuranceNumber', label: 'Obra social', type: 'autocomplete', class: 'col s12 m5', functionForData: this.commonService.getMedicalInsurances(), parameter: true },
        { key: 'practiceId', label: 'Práctica', type: 'autocomplete', class: 'col s12 m5', functionForData: this.commonService.getInosPractices(), parameter: true },
        { key: 'type', label: 'Tipo', type: 'select', class: 'col s12 m2', parameter: true, options: [{ number: 0, name: 'Todos' }, { number: 1, name: 'Ambulatorios' }, { number: 2, name: 'Internados' }] },
    ];

    constructor(
        private loadingGlobalService: LoadingGlobalService,
        private toastyMessageService: ToastyMessageService,
        private commonService: CommonService,
        private utilityService: UtilityService,
        public professionalLiquidationService: ProfessionalLiquidationService
    ) { }

    ngOnInit() {
        this.professionalLiquidationService.resetService();
        this.professionalLiquidationService.columns = this.columns;
        this.professionalLiquidationService.controlsToFilter = this.controlsToFilter;
    }

    onChangeOfSelection() {
        this.itemsSelectedToLiquidate = this.professionalLiquidationService.practicesProf.length;
        this.liquidacionValid = this.itemsSelectedToLiquidate > 0;
        this.professionalLiquidations = this.professionalLiquidationService.practicesProf;
    }

    liquidateProfessional() {
        this.isSaving = true;
        const now = moment().format();
        const liquidations = this.professionalLiquidationService.practicesProf.map(x => {
            var item = new LiquidatePractice;
            item.practiceId = x.practiceId;
            item.type = 1;
            item.numberMovPacHC = x.numberMovPacHC;
            item.code = x.code;
            item.typeInternament = x.typeInternament;
            item.date = x.date;
            item.departureDate = x.departureDate;
            item.days = x.days;
            item.total = x.total || 0;
            return item;
        });
        const professionalLiquidation = new LiquidateProfessional();
        professionalLiquidation.dateFrom = this.utilityService.formatDate(this.professionalLiquidationService.controlsToFilter[1].value, 'DD/MM/YYYY');
        professionalLiquidation.dateTo = this.utilityService.formatDate(this.professionalLiquidationService.controlsToFilter[2].value, 'DD/MM/YYYY');
        professionalLiquidation.dateGeneration = now;
        professionalLiquidation.professionalNumber = this.professionalLiquidationService.controlsToFilter[0].value;
        professionalLiquidation.liquidations = liquidations;
        professionalLiquidation.concepts = [...this.professionalLiquidationService.getConcepts(), ...this.profLiquidationComponent.getConcepts()];
        this.professionalLiquidationService.save(professionalLiquidation)
            .finally(() => this.isSaving = false)
            .subscribe(
            response => {
                this.reset();
                this.toastyMessageService.showSuccessMessagge('Se liquido exitosamente');
                if (response.model == null) { this.toastyMessageService.showErrorMessagge('Ocurrio un error al obtener los datos para el reporte'); return; }
                this.setModelForReport(response.model);
                this.printReport();
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al liquidar las prácticas');
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
            } else
            {
                //this.modelForReport.liqAmbulatorios.push(liq);
                liqAmb.push(liq);
            }

        });
        console.log(this.modelForReport.liqAmbulatorios);
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
        
        this.modelForReport.fecha = moment().format('DD/MM/YYYY HH:mm');

        //this.modelForReport.dateGeneration = moment(data.dateGeneration).format('DD/MM/YYYY');
        this.modelForReport.dateGeneration = this.utilityService.formatDateFE(data.dateGeneration);
        this.modelForReport.total=data.total;
        //this.modelForReport.dateFrom = moment(data.dateFrom).format('DD/MM/YYYY');
        this.modelForReport.dateFrom = this.utilityService.formatDateFE(data.dateFrom);
        //this.modelForReport.dateTo = moment(data.dateTo).format('DD/MM/YYYY');
        this.modelForReport.dateTo = this.utilityService.formatDateFE(data.dateTo);
        this.modelForReport.precioPHs=data.precioPHs;
        this.modelForReport.fixedAmount=data.fixedAmount;

        this.modelForReport.liqInternaciones = liqInt;
        this.modelForReport.liqAmbulatorios = liqAmb;
        this.modelForReport.externs = concExt;
        this.modelForReport.internmentConcepts = concInt;
        this.modelForReport.medicalGuards = concMed;
        this.modelForReport.debits = concDeb;
     
    }

    private printReport() {
        console.log(this.modelForReport);

        //this.iReport.generateReportWithData(this.modelForReport, 3002, true);
        this.iReport.generateReportWithData(this.modelForReport, 3002, true);
    }

    reset() {
        this.professionalLiquidationService.resetService();
        this.practicesToLiquidateComponent.dtComponent.dfComponent.onSubmit();
        this.onChangeOfSelection();
        this.showOrHideForm(false);
        //if(this.profLiquidationComponent) this.profLiquidationComponent.reset();
    }

    setProfessionalConcepts() {
        this.showOrHideForm(true);
        this.profLiquidationComponent.init(this.controlsToFilter[0].value);
    }

    showOrHideForm(show: boolean) {
        this.showConceptsForm = show;
    }
}
