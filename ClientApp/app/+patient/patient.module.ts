import { NgModule } from '@angular/core';

import { AppModuleShared } from '../app.module.shared';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientService } from './patient.service';
import { PatientRoutes } from './patient.routing';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { PatientMedicalInsuranceFormComponent } from './patient-medical-insurance-form/patient-medical-insurance-form.component';
import { PatientMedicalInsuranceService } from './patient-medical-insurance.service';
import { ResponsiblePatientFormComponent } from './responsible-patient-form/responsible-patient-form.component';
import { ResponsiblePatientService } from './responsible-patient.service';

@NgModule({
    imports: [
		PatientRoutes,
        AppModuleShared
    ],
    declarations: [
        PatientFormComponent,
        PatientListComponent,
        PatientDetailComponent,
        PatientMedicalInsuranceFormComponent,
        ResponsiblePatientFormComponent
    ],
    providers: [
        PatientService,
        PatientMedicalInsuranceService,
        ResponsiblePatientService
    ]
})

export class PatientModule { }