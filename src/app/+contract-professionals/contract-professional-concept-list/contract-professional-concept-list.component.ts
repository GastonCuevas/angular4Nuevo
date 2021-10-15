import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { Subject } from 'rxjs';
import { UtilityService } from './../../+core/services/utility.service';
import { ProfessionalContractConcept } from '../../models/professional-contract-concept.model';
import { ContractProfessionalConceptService } from '../contract-professional-concept.service';
import { IColumn, EventDynamicTable } from '../../+shared/util';
import { DynamicTableComponent } from '../../+shared';


@Component({
    selector: 'contract-professional-concept-list',
    templateUrl: 'contract-professional-concept-list.component.html',
    styleUrls: ['contract-professional-concept-list.component.scss']
})

export class ContractProfessionalConceptListComponent implements OnInit {

    @ViewChild('dtconceptos') dtComponent: DynamicTableComponent;
    professionalContractConcept = new ProfessionalContractConcept();
    deleteModalConceptSubject: Subject<any> = new Subject();
    contractNumber = 0;
    professionalAccount = 0;
    professionalConcepts: Array<ProfessionalContractConcept>;
    @Output() actionClick = new EventEmitter<any>();

    constructor(
        public contractProfessionalConceptService: ContractProfessionalConceptService,
        private _route: ActivatedRoute,
        private _toastyService: ToastyMessageService,
        private utilityService: UtilityService,
    ) {
        this.contractNumber = +(this._route.snapshot.paramMap.get('id') || 0);
        this.professionalAccount = +(this._route.snapshot.paramMap.get('profesionalId') || 0);
    }

    columns: Array<IColumn> = [
        { header: 'Codigo', property: 'code' },
        { header: 'Descripción', property: 'description' },
        { header: 'Precio', property: 'price' },
        { header: 'Cantidad Hs.', property: 'quantity' },
    ];

    ngOnInit() {
    }

    onActionClick(event: EventDynamicTable) {
        switch (event.action) {
            case 'edit':
                this.contractProfessionalConceptService.professionalContractConcept = event.item;
                break;
            case 'delete':
                this.professionalContractConcept = event.item;
                this.deleteModalConceptSubject.next();
                break;
            default:
                break;
        }
        this.actionClick.emit({ action: event.action, item: event.item });
    }

    onDeleteConceptConfirm(event: any) {
        // this.reloadingData = true;
        this.contractProfessionalConceptService.delete(this.professionalContractConcept.number).subscribe(
            result => {
                this.dtComponent.updateTable();
                this._toastyService.showSuccessMessagge('Se elimino correctamente');
            },
            error => {
                this._toastyService.showErrorMessagge('Ocurrio un error inesperado');
            });

    }
}