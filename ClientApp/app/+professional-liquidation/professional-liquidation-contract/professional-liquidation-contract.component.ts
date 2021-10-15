import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonService, ToastyMessageService, UtilityService, LoadingGlobalService } from '../../+core/services';
import { ProfessionalLiquidationService } from '../professional-liquidation.service';
import { LiquidateConcept } from '../../models/liquidate-concept.model';
import { IColumn } from '../../+shared/util';
import { ProfessionalContractConcept } from '../util/models';
import { InputAutoComplete } from '../../+shared';

@Component({
    selector: 'professional-liquidation-contract',
    templateUrl: './professional-liquidation-contract.component.html',
    styleUrls: ['./professional-liquidation-contract.component.scss']
})
export class ProfessionalLiquidationContractComponent implements OnInit {
    @Input() isSaving: boolean;
    @Output() cancelEvent = new EventEmitter<any>();
    @Output() submitEvent = new EventEmitter<any>();
    @ViewChild('conceptMedicalGuardIAC') conceptMedicalGuardIAC: InputAutoComplete;
    @ViewChild('conceptDebitIAC') conceptDebitIAC: InputAutoComplete;

    isLoading = false;
    form: FormGroup;
    concepts = new Array<ProfessionalContractConcept>();
    generalConcepts = new Array<any>();
    loadingConceptIAC = false;
    loadingGeneralConceptIAC = false;
    fixedAmount: number;
    priceHs: number;
    error = false;
    ambTextConsExt: String;
    ambTextInternat: String;

    ambulatoryPracticesColumns = [
        { header: 'Fecha', property: 'date', type: 'date' },
        { header: 'Práctica', property: 'practiceName' },
        { header: 'Obra Social', property: 'medicalInsuranceName' },
        { header: 'Paciente', property: 'patientName' },
        { header: 'Importe', property: 'total' },
    ];
    hospitalizationPracticesColumns = [
        { header: 'Fecha Desde', property: 'dateFrom', type: 'date' },
        { header: 'Fecha Hasta', property: 'dateTo', type: 'date' },
        { header: 'Práctica', property: 'practiceName' },
        { header: 'Obra Social', property: 'medicalInsuranceName' },
        { header: 'Paciente', property: 'patientName' },
        { header: 'Cantidad', property: 'days' },
        { header: 'Importe', property: 'total' },
    ];
    medicalGuardsColumns = [
        { header: 'Código', property: 'conceptCode' },
        { header: 'Descripción', property: 'conceptDescription' },
        { header: 'Cantidad', property: 'count' },
        { header: 'Precio', property: 'price' },
        { header: 'Total', property: 'total' }
    ];
    additionalDebitsColumns = [
        { header: 'Código', property: 'conceptCode' },
        { header: 'Descripción', property: 'conceptDescription' },
        { header: 'Cantidad', property: 'count' },
        { header: 'Precio', property: 'price' },
        { header: 'Total', property: 'total' }
    ];

    constructor(
        private fb: FormBuilder,
        private commonService: CommonService,
        private toastyService: ToastyMessageService,
        private utilityService: UtilityService,
        public professionalLiquidationService: ProfessionalLiquidationService,
        private loadingGlobalService: LoadingGlobalService
    ) { }

    ngOnInit() { }

    init(professionalId: number) {
        this.loadingGlobalService.showLoading();
        this.error = false;
        this.loadGeneralConcepts();
        this.loadContract(professionalId);
        this.createForm();
    }

    loadGeneralConcepts() {
        this.loadingGeneralConceptIAC = true;
        this.commonService.getConceptsByType(0)
            .finally(() => {
                this.loadingGeneralConceptIAC = false;
                this.computeLoading();
            })
            .subscribe(
            response => {
                this.generalConcepts = response.model.map((x: any) => {
                    x.fullDescription = x.code + ' - ' + x.description;
                    return x;
                });
            }, error => {
                this.error = true;
                this.toastyService.showToastyError(error, 'Ocurrio un error al obtener los concepetos generales');
            });
    }

    loadContract(professionalId: number) {
        this.professionalLiquidationService.getFixedAmount(professionalId).subscribe(
            response => {
                this.fixedAmount = response.model.fixedAmount;
                this.priceHs = response.model.priceHs || 0;
                this.loadConceptByContractProfessional(response.model.number);
                this.professionalLiquidationService.calculateImport(this.priceHs);
            },
            error => {
                this.error = true;
                this.toastyService.showToastyError(error, 'Ocurrio un error al obtener el contrato del profesional');
            });
    }

    loadConceptByContractProfessional(id: number) {
        this.loadingConceptIAC = true;
        this.commonService.getConceptsByContractProf(id)
            .finally(() => {
                this.loadingConceptIAC = false;
                this.computeLoading();
            })
            .subscribe(
            response => {
                this.concepts = response.model;
            }, error => {
                this.error = true;
                this.toastyService.showToastyError(error, 'Ocurrio un error al obtener los conceptos del profesional');
            });
    }

    computeLoading() {
        this.isLoading = this.loadingGeneralConceptIAC || this.loadingConceptIAC;
        if (!this.isLoading) this.loadingGlobalService.hideLoading();
    }

    createForm() {
        this.form = this.fb.group({
            // cosultorio externo (ambulatorio)
            ambId: [null, null],
            ambPrice: [null, null],
            ambCode: [null, null],
            ambDescription: [null, null],
            ambCount: [null, null],
            ambQuantity: [null, null],
            ambDiff: [null, null],
            ambText:[null,null],

            // internacion
            hospId: [null, null],
            hospPrice: [null, null],
            hospCode: [null, null],
            hospDescription: [null, null],
            hospCount: [null, null],
            hospQuantity: [null, null],
            hospDiff: [null, null],

            // guardia medica
            gmId: [null, null],
            gmPrice: [null, null],
            gmCode: [null, null],
            gmDescription: [null, null],
            gmCount: [null, null],

            // debitos adicionales
            aId: [null, null],
            aPrice: [null, null],
            aCode: [null, null],
            aDescription: [null, null],
            aCount: [null, null],
            aSubtract: [false, null]
        });
    }

    onSubmit() {
        this.isSaving = true;
        const msg = this.validForm();
        if (!!msg) {
            this.toastyService.showErrorMessagge(msg);
            setTimeout(() => this.isSaving = false);
            return;
        }

        this.submitEvent.emit();
    }

    onCancel() {
        this.cancelEvent.emit(false);
    }

    validForm() {
        if (!!this.form.value.ambId && !this.form.value.ambCount) return 'Debe ingresar la cantidad en "Consultorio Externo"';
        if (!!this.form.value.hospId && !this.form.value.hospCount) return 'Debe ingresar la cantidad en "Internación"';
        return '';
    }

    reset() {
        this.form.reset();
        this.conceptMedicalGuardIAC.clearInput();
        this.conceptDebitIAC.clearInput();
    }

    getConcepts() {
        const array = new Array<LiquidateConcept>();
        if (!!this.form.value.ambId && !!this.form.value.ambCount) {
            const abmConcept = new LiquidateConcept();
            abmConcept.conceptId = this.form.value.ambId;
            abmConcept.conceptCode = this.form.value.ambCode;
            abmConcept.conceptDescription = this.form.value.ambDescription;
            abmConcept.price = this.form.value.ambPrice;
            abmConcept.count = this.form.value.ambCount;
            abmConcept.total = abmConcept.price * this.form.value.ambCount;
            abmConcept.orderReport = 1;
            array.push(abmConcept);
        }
        if (!!this.form.value.hospId && !!this.form.value.hospCount) {
            const hospConcept = new LiquidateConcept();
            hospConcept.conceptId = this.form.value.hospId;
            hospConcept.conceptCode = this.form.value.hospCode;
            hospConcept.conceptDescription = this.form.value.hospDescription;
            hospConcept.price = this.form.value.hospPrice;
            hospConcept.count = this.form.value.hospCount;
            hospConcept.total = hospConcept.price * this.form.value.hospCount;
            hospConcept.orderReport = 2;
            array.push(hospConcept);
        }
        return array;
    }

    // cosultorio externo
    onChangeSelectedConcept(event: ProfessionalContractConcept) {
        this.form.patchValue({
            ambId: event.conceptId,
            ambDescription: event.description,
            ambCode: event.code,
            ambPrice: event.price,
            ambQuantity: event.quantity,
            ambDiff: event.quantity - this.form.value.ambCount,
            
        });
        
    }

    updateAmbDiff() {
        this.form.patchValue({
            ambDiff: this.form.value.ambQuantity - this.form.value.ambCount,
        });
        if (this.form.value.ambDiff < 0) {
            this.form.value.ambDiff = this.form.value.ambDiff * -1;
            this.ambTextConsExt = 'Excede ' + this.form.value.ambDiff + ' hs';
        } else
        this.ambTextConsExt = 'Falta ' + this.form.value.ambDiff + ' hs';
        

    }

    // internacion
    onChangeSelectedInternmentConcept(event: ProfessionalContractConcept) {
        this.form.patchValue({
            hospId: event.conceptId,
            hospDescription: event.description,
            hospCode: event.code,
            hospPrice: event.price,
            hospQuantity: event.quantity,
            hospDiff: event.quantity - this.form.value.hospCount
        });
    }

    updateHospDiff() {
        this.form.patchValue({
            hospDiff: this.form.value.hospQuantity - this.form.value.hospCount,
        });
        if (this.form.value.hospDiff < 0) {
            this.form.value.hospDiff = this.form.value.hospDiff * -1;
            this.ambTextInternat = 'Excede ' + this.form.value.hospDiff + ' hs';
        } else
        this.ambTextInternat = 'Falta ' + this.form.value.hospDiff + ' hs';

    }

    // guardia medica
    onChangeSelectedConceptMedicalGuard(event: ProfessionalContractConcept) {
        this.form.patchValue({
            gmId: event.conceptId,
            gmDescription: event.description,
            gmCode: event.code,
            gmPrice: event.price
        });
    }

    addConceptMedicalGuard() {
        const msg = this.validMedicalGuardConcept();
        if (!!msg) {
            this.toastyService.showErrorMessagge(msg);
            return;
        }

        const exist = this.professionalLiquidationService.medicalGuards.some(d => d.conceptId == this.form.value.gmId);
        if (exist) {
            this.toastyService.showErrorMessagge('El concepto ya fue cargado');
            return;
        }

        const concept = new LiquidateConcept();
        concept.conceptId = this.form.value.gmId;
        concept.conceptCode = this.form.value.gmCode;
        concept.conceptDescription = this.form.value.gmDescription;
        concept.price = this.form.value.gmPrice;
        concept.count = this.form.value.gmCount;
        concept.total = concept.price * this.form.value.gmCount;
        concept.orderReport = 3;
        
        this.professionalLiquidationService.medicalGuards.push(concept);
        console.log(this.professionalLiquidationService.medicalGuards);
        this.conceptMedicalGuardIAC.clearInput();
        this.form.patchValue({
            gmId: null,
            gmCount: null
        });
    }

    validMedicalGuardConcept() {
        if (!this.form.value.gmId) return 'Debe elegir un concepto';
        if (!this.form.value.gmCount) return 'Debe ingresar la cantidad';
        const exist = this.professionalLiquidationService.medicalGuards.some(d => d.conceptId == this.form.value.gmId);
        if (exist) return 'El concepto ya fue cargado';
        return '';
    }

    deleteConceptMedicalGuard(event: any) {
        if (event.action !== 'delete') return;
        const index = this.professionalLiquidationService.medicalGuards.findIndex(x => x.conceptId == event.item.conceptId);
        if (index !== -1) this.professionalLiquidationService.medicalGuards.splice(index, 1);
    }

    // debitos adicionales
    onChangeSelectedConceptDebit(event: any) {
        this.form.patchValue({
            aId: event.number,
            aDescription: event.description,
            aCode: event.code,
            aPrice: event.price
        });
    }

    addConceptDebit() {
        const msg = this.validDebitConcept();
        if (!!msg) {
            this.toastyService.showErrorMessagge(msg);
            return;
        }

        const concept = new LiquidateConcept();
        concept.conceptId = this.form.value.aId;
        concept.conceptCode = this.form.value.aCode;
        concept.conceptDescription = this.form.value.aDescription;
        concept.price = this.form.value.aPrice * (this.form.value.aSubtract ? -1 : 1);
        concept.count = this.form.value.aCount;
        concept.total = concept.price * this.form.value.aCount;
        concept.orderReport = 4;
        console.log(concept);

        this.professionalLiquidationService.additionalDebits.push(concept);
        this.conceptDebitIAC.clearInput();
        this.form.patchValue({
            aId: null,
            aCount: null
        });
    }

    validDebitConcept() {
        if (!this.form.value.aId) return 'Debe elegir un concepto';
        if (!this.form.value.aCount) return 'Debe ingresar la cantidad';
        const exist = this.professionalLiquidationService.additionalDebits.some(d => d.conceptId == this.form.value.aId);
        if (exist) return 'El concepto ya fue cargado';
        return '';
    }

    deleteConceptDebit(event: any) {
        if (event.action !== 'delete') return;
        const index = this.professionalLiquidationService.additionalDebits.findIndex(x => x.conceptId == event.item.conceptId);
        if (index !== -1) this.professionalLiquidationService.additionalDebits.splice(index, 1);
    }
}
