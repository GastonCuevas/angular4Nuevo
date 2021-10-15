import { HcEvolutionSchemeService } from './../hc-evolution-scheme.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { Subject, Observable } from 'rxjs';
import { ToastyMessageService, CommonService, UtilityService } from '../../+core/services';
import { ElementFilter } from "../../+shared/dynamic-table/element-filter.model";

import { DynamicTableComponent } from '../../+shared/dynamic-table/dynamic-table.component';
import { IColumn } from '../../interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericControl } from '../../+shared';

import { PatientService } from '../../+patient/patient.service';
import { InternmentService } from '../../+internment/internment.service';
import { Internment } from '../../models';
import { InternmentSelectedService } from '../internment-selected.service';
import { HcEvolutionPharmacyService } from '../hc-evolution-pharmacy.service';
import { ReturnMedicationService } from '../return-medication.service';

@Component({
    selector: 'internment-selected-list',
    templateUrl: './internment-selected-list.component.html',
    styleUrls: ['./internment-selected-list.component.scss']
})
export class InternmentSelectedListComponent implements OnInit {

    allSelected: boolean = false;
    internmentId: number;
    isSelected = false;
    showMedicationSchemeForm = false;
    patientMovementId: number;
    selectedItems: number = 0;
    initialFilter = 'patMov.MovementState.Number=2';

    controlsToFilter: Array<GenericControl> = [
        { key: 'patient', label: 'Paciente', type: 'name', class: 'col s12 m4', searchProperty: 'patMov.patient.patientAccount.name' },
        { key: 'professional', label: 'Profesional', type: 'name', class: 'col s12 m4', searchProperty: 'patMov.proContract.prof.professionalAccount.name' },
         { key: 'state', label: 'Tipo de estados ', type: 'select', class: 'col s12 m4', options: [{ number: 2, name: 'Internados' }, { number: 1, name: 'Ambulatorio' }], searchProperty: "PatMov.MovementState.Number", value: 2 }
    ];

    columns: Array<IColumn> = [
        { header: "Paciente", property: "patientName", searchProperty: 'patMov.patient.patientAccount.name' },
        { header: "Profesional", property: "professionalName", searchProperty: 'patMov.proContract.prof.professionalAccount.name' },
        { header: "Fecha", property: "admissionDate", searchProperty: 'patMov.date', type: 'date' },
        { header: "Hora", property: "time", searchProperty: 'patMov.time' }
    ];
    
    constructor(
        private router: Router,
        private utilityService: UtilityService,
        public patientService: PatientService,
        public internmentSelectedService: InternmentSelectedService,
        public hcEvolutionSchemeService: HcEvolutionSchemeService,
        public hcEvolutionPharmacyService: HcEvolutionPharmacyService,
        public returnMedicationService: ReturnMedicationService
    ) { }

    ngOnInit() {}

    

    processMedication() {
        this.router.navigate([`historiaclinica/consumo/detail`]);
    }

    onActionClick(event: any) {
		switch (event.action) {
			case 'new':
				break;
			case 'edit':
                
                this.internmentSelectedService.patMovId = event.item;
                this.processMedication();
				break;
			case 'delete':
				break;
            case 'detail':
                // this.router.navigate([`historiaclinica/consumo/${event.item.id}`])
                this.showMedicationSchemeForm = true;
                this.patientMovementId = event.item.id;
                this.hcEvolutionSchemeService.patientMovementId = event.item.id;
				break;
			default:
				break;
		}
    }
    
    onMedicationShow(event: any) {
        this.showMedicationSchemeForm = false;
    }

    selectedChange(internment: any) {
        this.internmentId = internment.id;
    }

    returnMedication() {
        this.utilityService.navigate(`historiaclinica/consumo/returnMedication/${this.internmentId}`);
    }
}
