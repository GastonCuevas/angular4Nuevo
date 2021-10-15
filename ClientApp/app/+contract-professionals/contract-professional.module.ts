import { NgModule } from '@angular/core';
import { AppModuleShared } from '../app.module.shared';

import { ContractProfessionalsRoutes } from './contract-professional.routing';
import { ContractProfessionalListComponent } from './contract-professional-list/contract-professional-list.component';
import { ContractProfessionalFormComponent } from './contract-professional-form/contract-professional-form.component';
import { ContractProfessionalService } from './contract-professional.service';

import { ContractProfessionalScheduleListComponent } from './contract-professional-schedule-list/contract-professional-schedule-list.component';
import { ContractProfessionalScheduleFormComponent } from './contract-professional-schedule-form/contract-professional-schedule-form.component';
import { ContractProfessionalScheduleService } from './contract-professional.schedule.service';

import { ContractProfessionalMedicalInsuranceListComponent } from './contract-professional-medical-insurance-list/contract-professional-medical-insurance-list.component';
import { ContractProfessionalMedicalInsuranceFormComponent } from './contract-professional-medical-insurance-form/contract-professional-medical-insurance-form.component';
import { ContractProfessionalMedicalInsuranceService } from "./contract-professional-medical-insurance.service";

import { ContractProfessionalAbsenceListComponent } from './contract-professional-absence-list/contract-professional-absence-list.component';
import { ContractProfessionalAbsenceFormComponent } from './contract-professional-absence-form/contract-professional-absence-form.component';
import { ContractProfessionalAbsenceService } from "./contract-professional-absence.service";
import { PracticesToCheckComponent } from './practices-to-check/practices-to-check.component';
import { ContractProfessionalPracticesFormComponent } from './contract-professional-practices-form/contract-professional-practices-form.component';
import { ContractProfessionalConceptListComponent } from './contract-professional-concept-list/contract-professional-concept-list.component';
import { ContractProfessionalConceptService } from './contract-professional-concept.service';
import { ContractProfessionalConceptFormComponent } from './contract-professional-concept-form/contract-professional-concept-form.component';

@NgModule({
    imports: [
		ContractProfessionalsRoutes,
        AppModuleShared
    ],
    declarations: [
        ContractProfessionalListComponent,
        ContractProfessionalFormComponent,
        ContractProfessionalScheduleListComponent,
        ContractProfessionalScheduleFormComponent,
        ContractProfessionalAbsenceListComponent,
        ContractProfessionalAbsenceFormComponent,
        ContractProfessionalMedicalInsuranceListComponent,
        ContractProfessionalMedicalInsuranceFormComponent,
        ContractProfessionalPracticesFormComponent,
        PracticesToCheckComponent,
        ContractProfessionalConceptListComponent,
        ContractProfessionalConceptFormComponent
    ],
    providers: [
        ContractProfessionalService,
        ContractProfessionalScheduleService,
        ContractProfessionalAbsenceService,
        ContractProfessionalMedicalInsuranceService,
        ContractProfessionalConceptService
    ]
})
export class ContractProfessionalModule { }