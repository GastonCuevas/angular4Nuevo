import { ContractProfessionalConceptService } from './../contract-professional-concept.service';
import { ProfessionalContractConcept } from './../../models/professional-contract-concept.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilityService } from '../../+core/services/utility.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../+core/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
declare var $: any;

@Component({
    selector: 'contract-professional-concept-form',
    templateUrl: './contract-professional-concept-form.component.html',
    styleUrls: ['./contract-professional-concept-form.component.scss']
})

export class ContractProfessionalConceptFormComponent implements OnInit {
    form: FormGroup;
    isLoadingConcept = false;
    professionalContractConcept = new ProfessionalContractConcept();
    professionalConcepts: Array<ProfessionalContractConcept>;

    concepts: Array<any>;
    openModalSubject: Subject<any> = new Subject();
    isNew = true;
    itemValue = 0;
    contractNumber = 0;
    professionalAccount = 0;
    index = 0;
    functionConcepts = this.contractProfessionalConceptService.getConcepts();


    @Output() actionClick = new EventEmitter<any>();

    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private utilityService: UtilityService,
        private commonService: CommonService,
        private toastyService: ToastyMessageService,
        public contractProfessionalConceptService: ContractProfessionalConceptService,
    ) {
        this.contractNumber = +(this.activatedRoute.snapshot.paramMap.get('id') || 0);
        this.professionalAccount = +(this.activatedRoute.snapshot.paramMap.get('profesionalId') || 0);
    }

    createForm() {
        this.form = this.fb.group({
            code: [this.professionalContractConcept.code, Validators.required],
            conceptId: [this.professionalContractConcept.conceptId, Validators.required],
            price: [this.professionalContractConcept.price, Validators.required],
            quantity: [this.professionalContractConcept.quantity, null],
        });
    }

    getConcept() {
        this.professionalContractConcept = this.contractProfessionalConceptService.professionalContractConcept;
        this.createForm();
    }

    ngOnInit() {
        this.loadForm();
    }

    loadForm() {
        if (this.contractProfessionalConceptService.isNewConcept) {
            this.createForm();
        } else {
            this.getConcept();
        }
    }

    onAgree() {
        this.actionClick.emit({ action: 'cancelar' });
    }

    onCancelButton(): void {
        this.openModalSubject.next();
    }

    onSubmitConcept() {
        const professionalContractConcept = Object.assign({}, this.professionalContractConcept, this.form.value);
        professionalContractConcept.contractNumber = this.contractProfessionalConceptService.professionalContractId;
        professionalContractConcept.type = 1;

        if(this.contractProfessionalConceptService.isNewConcept){
            this.contractProfessionalConceptService.insert(professionalContractConcept).subscribe(response =>{
                this.toastyService.showSuccessMessagge('Concepto creado correctamente');
                this.contractProfessionalConceptService.isNewConcept = false;
                this.actionClick.emit({ action: 'nuevo' });
                },
            error => {
                this.toastyService.showToastyError(error, 'Ocurrio un error al dar el alta');
            });
        }else{
            this.contractProfessionalConceptService.update(professionalContractConcept).subscribe(response =>{
                this.toastyService.showSuccessMessagge('Concepto actualizado correctamente');
                this.contractProfessionalConceptService.isNewConcept = false;
                this.actionClick.emit({ action: 'editar' });

                },
                error => {
                    this.toastyService.showToastyError(error, 'Ocurrio un error al actualizar');
            });
        }
    }

    onChangeIAC(event: any) {
        this.professionalContractConcept.conceptId = event.number;
        this.form.patchValue({
            code: event.code,
            price: event.price,
        });
    }
}