import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

import { CommonService, ToastyMessageService } from '../../+core/services';
import { TurnManagementService } from '../turn-management.service';
import { GenericControl } from '../../+shared/index';
import { IColumn } from '../../+shared/util';

@Component({
    selector: 'consultation-modal',
    templateUrl: './consultation-modal.component.html',
    styleUrls: ['./consultation-modal.component.scss']
})
export class ConsultationModalComponent implements OnInit {

    controlsToFilter: Array<GenericControl> = [
        { key: 'professional', label: 'Profesional', type: 'autocomplete', class: 'col s12 m6 l3', searchProperty: 'ProfessionalContract.ProfessionalNumber', functionForData: this.turnManagementService.getProfessionalsWithContract() },
        { key: 'specialtyNumber', label: 'Especialidad', type: 'autocomplete', class: 'col s12 m6 l3', functionForData: this.commonService.getSpecialties() },
        { key: 'ConsultingRoom', label: 'Consultorio', type: 'autocomplete', class: 'col s12 m4 l2', placeholder: 'Seleccione', functionForData: this.turnManagementService.getAllMedicalOffices() },
        { key: 'dateFrom', label: 'Fecha Desde', type: 'date', class: 'col s6 m4 l2', parameter: true, required: true },
        { key: 'dateTo', label: 'Fecha Hasta', type: 'date', class: 'col s6 m4 l2', parameter: true, required: true }
    ];
    columns: Array<IColumn> = [
        { header: 'Fecha', property: 'date', type: 'date', disableSorting: true },
        { header: 'Profesional', property: 'professional', disableSorting: true },
        { header: 'Especialidad', property: 'specialty', disableSorting: true },
        { header: 'Consultorio', property: 'medicalOffice', disableSorting: true },
        { header: 'Total de turnos', property: 'totalShifts', disableSorting: true },
        { header: 'Otorgados', property: 'chargedShifts', disableSorting: true },
        { header: 'Disponibles', property: 'availableShifts', disableSorting: true },
        // { header: 'Horarios', property: '', disableSorting: true },
    ];
    modalActions: EventEmitter<string | MaterializeAction> = new EventEmitter<string | MaterializeAction>();

    constructor(
        private commonService: CommonService,
        private toastyMessageService: ToastyMessageService,
        public turnManagementService: TurnManagementService
    ) {}

    ngOnInit() {
    }

    openModal() {
        this.modalActions.emit({action:"modal",params:['open']});
    }
    closeModal () {
        this.modalActions.emit({action:"modal",params:['close']});
    }

    onActionClick() {
        
    }

}


