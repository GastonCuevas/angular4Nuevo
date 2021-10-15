import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';

import { ToastyMessageService, UtilityService, CommonService, LoadingGlobalService } from '../../+core/services';
import { MedicalInsuranceLiquidationService } from '../medical-insurance-liquidation.service';
import { IntelligentReportComponent, GenericControl, InputAutoComplete } from '../../+shared/';
import { IColumn } from '../../+shared/util';
import { LiquidateMedicalInsurance, ModelForReport, LiquidatePractice } from '../util/models';
import { PracticesToLiquidateComponent } from '../practices-to-liquidate/practices-to-liquidate.component';

import * as moment from 'moment';
import { MaterializeAction } from 'angular2-materialize';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LiquidateConcept } from '../../models/liquidate-concept.model';
import { PharmacySchemeLiq } from '../../models/pharmacy-scheme.model';

@Component({
    selector: 'app-mi-liquidation',
    templateUrl: './mi-liquidation.component.html',
    styleUrls: ['./mi-liquidation.component.scss']
})
export class MILiquidationComponent implements OnInit {

    @ViewChild(PracticesToLiquidateComponent) practicesToLiquidateComponent: PracticesToLiquidateComponent;
    @ViewChild('iReport') iReport: IntelligentReportComponent;
    @ViewChild('conceptIAC') conceptIAC: InputAutoComplete;

    isSaving = false;
    validLiquidation = false;
    itemsSelectedToLiquidate = 0;
    itemsSelectedToReLiquidate = 0;
    showAlternativeCode: boolean;
    liquidationConcepts = new Array<LiquidateConcept>();
    medicinesLiquidate = new Array<PharmacySchemeLiq>();
    concepts: Array<any>;
    loadingConceptIAC = false;
    form: FormGroup;
    modalActions = new EventEmitter<string | MaterializeAction>();

    private modelForReport: ModelForReport;

    columns: Array<IColumn> = [
        { header: 'Práctica', property: 'practiceName' },
        { header: 'Días', property: 'days' },
        { header: 'Código Normalizado', property: 'standarCode' },
        { header: 'Profesional', property: 'professionalName' },
        { header: 'Fecha', property: 'date', type: 'date' },
        { header: 'Liquidar', property: 'liquidate', type: 'checkbox', hideColumnBy: 'hideLiquidate', defaultValue: 'Rechazada', width: '120px', disableSorting: true },
        { header: 'ReLiquidar', property: 'reLiquidate', type: 'checkbox', hideColumnBy: 'hideReLiquidate', width: '130px', disableSorting: true }
    ];
    controlsToFilter: Array<GenericControl> = [
        { key: 'medicalInsuranceNumber', label: 'Obra Social', type: 'autocomplete', class: 'col s12 m6', functionForData: this.commonService.getMedicalInsurances(), parameter: true, required: true },
        { key: 'dateFrom', label: 'Período Desde', type: 'date', class: 'col s12 m3', parameter: true, required: true },
        { key: 'dateTo', label: 'Período Hasta', type: 'date', class: 'col s12 m3', parameter: true, required: true },
        { key: 'professionalName', label: 'Profesional', type: 'text', class: 'col s12 m5', parameter: true },
        { key: 'practiceId', label: 'Práctica', type: 'autocomplete', class: 'col s12 m5', functionForData: this.commonService.getInosPractices(), parameter: true },
        { key: 'type', label: 'Tipo', type: 'select', class: 'col s12 m2', parameter: true, options: [{ number: 0, name: 'Todos' }, { number: 1, name: 'Ambulatorios' }, { number: 2, name: 'Internados' }] },
    ];

    constructor(
        private fb: FormBuilder,
        private loadingGlobalService: LoadingGlobalService,
        private commonService: CommonService,
        private utilityService: UtilityService,
        private toastyMessageService: ToastyMessageService,
        public miLiquidationService: MedicalInsuranceLiquidationService
    ) { }

    ngOnInit() {
        this.miLiquidationService.resetService();
        this.miLiquidationService.columns = this.columns;
        this.miLiquidationService.controlsToFilter = this.controlsToFilter;
        this.loadConcepts();
    }

    loadConcepts() {
        this.loadingConceptIAC = true;
        this.commonService.getConceptsByType(0)
            .finally(() => this.loadingConceptIAC = false)
            .subscribe(
            response => {
                this.concepts = response.model;
            }, error => {
                this.toastyMessageService.showToastyError(error, 'No se pudo cargar el combo de Conceptos.');
            });
    }

    onChangeOfSelection() {
        const movPacIds = this.miLiquidationService.movPac.filter(x => x.reLiquidate || x.liquidate).map(x => x.movPacId);

        this.itemsSelectedToLiquidate = this.miLiquidationService.movPac.filter(x => x.liquidate).length;
        this.itemsSelectedToReLiquidate = this.miLiquidationService.movPac.filter(x => x.reLiquidate).length;
        this.validLiquidation = this.itemsSelectedToLiquidate > 0 || this.itemsSelectedToReLiquidate > 0;
        //traer medicamentos
        this.medicinesLiquidate = this.miLiquidationService.movPac.filter(x => x.reLiquidate || x.liquidate).reduce((list, item, i) => {
            return list.concat(item.medicines);
        },new Array<PharmacySchemeLiq>());
        
    }

    liquidateMI() {
        this.isSaving = true;
        var now = moment().format();
        const liquidations = this.miLiquidationService.movPac.map(x => {
            var item = new LiquidatePractice;
            item.practiceId = x.practiceId;
            item.type = !!x.cheId ? 2 : 1;
            item.numberMovPacHC = !x.cheId && x.movPacId || x.cheId;
            item.reliquidate = x.reLiquidate;
            item.reliquidationDate = x.reLiquidate ? now : '';
            item.code = this.showAlternativeCode ? x.alternativeCode : x.standarCode;
            item.typeInternament = x.hospitalization;
            item.date = x.date;
            item.departureDate = x.departureDate;
            item.days = x.days;
            return item;
        });
        const miLiquidation = new LiquidateMedicalInsurance();
        miLiquidation.dateFrom = this.utilityService.formatDate(this.miLiquidationService.controlsToFilter[1].value, 'DD/MM/YYYY');
        miLiquidation.dateTo = this.utilityService.formatDate(this.miLiquidationService.controlsToFilter[2].value, 'DD/MM/YYYY');
        miLiquidation.dateGeneration = now;
        miLiquidation.medicalInsuranceNumber = this.miLiquidationService.controlsToFilter[0].value;
        miLiquidation.liquidations = liquidations;
        miLiquidation.concepts = this.liquidationConcepts;
        miLiquidation.medicines = this.medicinesLiquidate;
        
        this.miLiquidationService.save(miLiquidation)
            .finally(() => this.isSaving = false)
            .subscribe(
            response => {
                this.reset();
                this.closeModal();
                this.toastyMessageService.showSuccessMessagge('Se liquido exitosamente');
                if (response.model == null) { this.toastyMessageService.showErrorMessagge('Ocurrio un error al obtener los datos para el reporte'); return; }
                this.setModelForReport(response.model);
                this.printReport();
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al liquidar las prácticas');
            });
    }

    private setModelForReport(data: ModelForReport) {
        this.modelForReport = data;
            this.modelForReport.liquidaciones.forEach(liq => {
                liq.fecha = moment(liq.fecha).format('DD/MM/YYYY');
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

    private printReport() {
        this.iReport.generateReportWithData(this.modelForReport, 2010, true);
    }

    reset() {
        this.liquidationConcepts = [];
        this.miLiquidationService.resetService();
        this.practicesToLiquidateComponent.dtComponent.dfComponent.onSubmit();
        this.onChangeOfSelection();
        if (this.conceptIAC) this.conceptIAC.clearInput();
        //this.conceptIAC.clearInput();
    }

    onCheckboxChange(value: boolean) {
        this.showAlternativeCode = value;
        if (value) this.miLiquidationService.columns[2] = { header: 'Código Alternativo', property: 'alternativeCode' };
        else this.miLiquidationService.columns[2] = { header: 'Código Normalizado', property: 'standarCode' };
    }

    openModal() {
        this.liquidationConcepts = new Array<LiquidateConcept>();
        this.createFormModal();
        this.modalActions.emit({ action: 'modal', params: ['open'] });
    }

    closeModal() {
        this.modalActions.emit({ action: 'modal', params: ['close'] });
    }

    loadLiquidationConcept() {
        const exist = this.liquidationConcepts.some(d => d.conceptId == this.form.value.conceptId);
        if (exist) {
            this.toastyMessageService.showErrorMessagge('El concepto ya fue cargado');
            return;
        }
        const conc: LiquidateConcept = Object.assign({}, this.form.value);
        conc.price *= this.form.value.subtract ? -1 : 1;
        conc.total = conc.price * conc.count;
        this.liquidationConcepts.push(conc);
        this.resetForm();
    }

    deleteConcept(concept: LiquidateConcept) {
        const index = this.liquidationConcepts.indexOf(concept);
        this.liquidationConcepts.splice(index, 1);
    }

    private createFormModal() {
        this.form = this.fb.group({
            conceptId: [0, Validators.required],
            conceptCode: ['', null],
            conceptDescription: ['', null],
            price: [null, null],
            count: [null, Validators.required],
            subtract: [false, null]
        });
    }

    onChangeSelectedConcept(event: any) {
        this.form.patchValue({
            conceptCode: event.code,
            conceptDescription: event.description,
            price: event.price,
        });
    }

    resetForm() {
        this.form.reset();
        this.conceptIAC.clearInput();
    }
}
