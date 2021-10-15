import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { Subject } from 'rxjs';
import { ElementFilter } from "../../+shared/dynamic-table/element-filter.model";

import { ProfessionalContractMedicalInsurance } from '../../models/professional-contract-medicalInsurance.model';
import { ContractProfessionalMedicalInsuranceService } from '../contract-professional-medical-insurance.service';
import { IColumn } from '../../+shared/util';

@Component({
    selector: 'contract-professional-medical-insurance-list',
    templateUrl: 'contract-professional-medical-insurance-list.component.html',
    styleUrls: ['contract-professional-medical-insurance-list.component.scss']
})

export class ContractProfessionalMedicalInsuranceListComponent implements OnInit {
    elements: Array<ElementFilter>;
    openModalSubject: Subject<any> = new Subject();
    contractProfessionalId: 0;
    reloadingData: boolean = false;
    professional: any;
    isNew: boolean = false;
    professionalContractMedicalInsurance: ProfessionalContractMedicalInsurance = new ProfessionalContractMedicalInsurance();
    deleteModalScheduleSubject: Subject<any> = new Subject();
    public contractNumber: number = 0;
    public professionalAccount: number = 0;

    registeredMedicalInsurances: Array<any>;
    professionalMedicalInsurances: Array<ProfessionalContractMedicalInsurance>;
    professionalContractScheduleIndex: number;
    contractProfessionalMedicalInsuranceId: number;
    onEdition = false;

    // controlsToFilter: Array<GenericControl> = [
    //     { key: 'practice', label: 'Práctica', type: 'text', class: 'col s12 m12', searchProperty: 'inosPractice.Description' }
    // ];

	columns: Array<IColumn> = [
        { header: "Obra Social", property: "medicalInsuranceName", searchProperty: "medicalInsuranceName" },
        { header: "Practica", property: "practiceName", searchProperty: "practiceName" },
        { header: "Factor", property: "factor", searchProperty: "factor" },
        { header: "Fijo", property: "fixed", searchProperty: "fixed" },
        { header: "Cobrar", property: "porcob", type:'checkbox', width: '120px', disableSorting: true }
    ];
    
    @Output() actionClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public contractProfessionalMedicalInsuranceService: ContractProfessionalMedicalInsuranceService,
        private _route: ActivatedRoute,
        private _toastyService: ToastyMessageService,
    ) {
        this.contractNumber = +(this._route.snapshot.paramMap.get('id') || 0);
        this.professionalAccount = +(this._route.snapshot.paramMap.get('profesionalId') || 0);
    }

    ngOnInit() {
        this.contractProfessionalMedicalInsuranceService.contractId = this._route.snapshot.paramMap.get('id');
        this.loadList();
    }

    onActionClick(action: string, item?: any) {
        this.actionClick.emit({ action: action, item: item })
    }

    onAgree() {
        this.contractProfessionalMedicalInsuranceService.delete(this.contractProfessionalMedicalInsuranceId).subscribe(
            () => {
                this.contractProfessionalMedicalInsuranceId = 0;
                this.reloadingData = true;
                this._toastyService.showSuccessMessagge("Se elimino correctamente");
            },
            () => {
                this._toastyService.showErrorMessagge("Ocurrio un error inesperado");
            });
    }

    updateReloadingData(event: any) {
        this.reloadingData = event.value;
        this.loadList();
    }

    deleteClick(medicalInsurance: any) {
        this.deleteModalScheduleSubject.next();
        this.professionalContractMedicalInsurance = medicalInsurance;
    }

    onDeleteScheduleConfirm() {
        const itemSelected = this.professionalContractMedicalInsurance;
        if (itemSelected) {
            this.contractProfessionalMedicalInsuranceService.contractMedicalInsurances.forEach((absence: any, index: number) => {
                if (absence === this.professionalContractMedicalInsurance) {
                    this.contractProfessionalMedicalInsuranceService.contractMedicalInsurances.splice(index, 1);
                }
            });
        }
    }

    loadList() {
        this.contractProfessionalMedicalInsuranceService.getAll(`contractNumber=${this.contractNumber}`)
            .subscribe(
                result => {
                    if (!this.contractProfessionalMedicalInsuranceService.onEditOrAdd) {
                        this.professionalMedicalInsurances = this.contractProfessionalMedicalInsuranceService.contractMedicalInsurances = result.model;
                        this.contractProfessionalMedicalInsuranceService.onEditOrAdd = true;
                    }
                    else {
                        this.professionalMedicalInsurances = this.contractProfessionalMedicalInsuranceService.contractMedicalInsurances;
                    }
                },
                () => {
                    this._toastyService.showErrorMessagge("Ocurrio un error al obtener los datos");
                });

    }
}