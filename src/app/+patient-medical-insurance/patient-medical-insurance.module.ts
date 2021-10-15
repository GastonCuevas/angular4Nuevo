import { NgModule } from '@angular/core';

import { AppModuleShared } from '../app.module.shared';
import { PatientMedicalInsuranceListComponent } from './patient-medical-insurance-list/patient-medical-insurance-list.component';
import { PatientMedicalInsuranceFormComponent } from './patient-medical-insurance-form/patient-medical-insurance-form.component';
import { patientMedicalInsuranceRoutes } from './patient-medical-insurance.routing';
import { PatientMedicalInsuranceService } from './patient-medical-insurance.service';

@NgModule({
    imports: [
        AppModuleShared,
        patientMedicalInsuranceRoutes
    ],
    exports: [],
    declarations: [
        PatientMedicalInsuranceListComponent,
        PatientMedicalInsuranceFormComponent
    ],
    providers: [
        PatientMedicalInsuranceService
    ],
})
export class PatienteMedicalInsuranceModule { }
