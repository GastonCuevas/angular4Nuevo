import { PharmacyScheme } from './../../models/pharmacy-scheme.model';
import { ClinicItem } from './../../models/clinic-item.model';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastyMessageService, UtilityService, CommonService } from '../../+core/services';

import { ClinicHistory } from '../../models/clinic-history.model';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { PatientService } from '../../+patient/patient.service';
import { Patient } from '../../models/patient.model';
import { DiagnosticMovement } from '../../models/diagnostic-movement.model';
import { ItemPractice } from '../../models/item-practice.model';
import { FormControlService } from '../../+shared/forms/form-control.service';
import { AssignedPracticeTypeService } from '../../+item-practice/assigned-practice-type.service';

import { GenericControl, ControlType } from '../../+shared/forms/controls';
import { ControlOptions } from '../../+dynamic-view-v2/util';
import { PracticeInosService } from '../../+practice-inos/practice-inos.service';
import { ClinicTable } from '../../models/clinic-table.model';
import { ClinicHistoryService } from '../../+clinic-history/clinic-history.service';
import { DiagnosticMovementService } from '../../+clinic-history/diagnostic-movement/diagnostic-movement.service';
import { ClinicHistoryPharmacySchemeService } from '../../+clinic-history/pharmacy-scheme/clinic-history-pharmacy-scheme.service';
import { HcEvolutionSchemeService } from '../hc-evolution-scheme.service';
import { HcEvolutionPharmacyService } from '../hc-evolution-pharmacy.service';
import { PharmacySchemeItemService } from '../pharmacy-scheme-item.service';

@Component({
    selector: 'patient-schemes',
    templateUrl: './patient-schemes.component.html'
})
export class PatientSchemesComponent implements OnInit {

    @Output() showMedication: EventEmitter<any> = new EventEmitter<any>();
    showPharmacySchemeForm = false;
    reloadingSchemeItems= false;
    isReadOnlySchemeItems=true;
    showDetailScheme = false;

    constructor(
        private fb: FormBuilder,
        private commonService: CommonService,
        private utilityService: UtilityService,
        private toastyMessageService: ToastyMessageService,
        public activatedRoute: ActivatedRoute,
        public hcEvolutionSchemeService: HcEvolutionSchemeService,
        public pharmacySchemeItemService: PharmacySchemeItemService
    ) {
    }

    ngOnInit() {
        this.pharmacySchemeItemService.HcSchemeId = 0;
    }

    /** Esquema de medicacion **/
    onActionScheme(event: any) {
        switch (event.action) {
            case 'new':
                this.showPharmacySchemeForm = true;
                this.hcEvolutionSchemeService.isNew = true;
                break;
            case 'edit':
                this.showPharmacySchemeForm = true;
                this.hcEvolutionSchemeService.isNew = false;
                // this.hcEvolutionSchemeService.scheme = event.item;
                break;
            case 'detail':
                break;
            default:
                break;
        }
    }

    onActionSelected(id: any) {
        this.pharmacySchemeItemService.HcSchemeId = id;
        this.reloadingSchemeItems = true;
        this.showDetailScheme = true;
    }


    onActionMedicamentClick(event: any) {
        switch (event.action) {
            case 'new':
            case 'edit':
            case 'detail':
                break;
            case 'delete':
                break;
            default:
                break;
        }
    }
  
    updateReloadingSchemeItems(event: any) {
        this.reloadingSchemeItems = event.value;
    }

    viewBack() {
        this.showMedication.emit(false);
    }
}


