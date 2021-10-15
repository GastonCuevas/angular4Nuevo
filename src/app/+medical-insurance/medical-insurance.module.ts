import { NgModule } from '@angular/core';

import { AppModuleShared } from './../app.module.shared';
import { MedicalInsuranceFormComponent } from "./medical-insurance-form/medical-insurance-form.component";
import { MedicalInsuranceListComponent } from "./medical-insurance-list/medical-insurance-list.component";
import { MedicalInsuranceDetailComponent } from "./medical-insurance-detail/medical-insurance-detail.component";
import { MedicalInsuranceRoutes } from './medical-insurance.routing';
import { MedicalInsuranceService } from './../+medical-insurance/medical-insurance.service';

@NgModule({
    declarations: [
		MedicalInsuranceListComponent,
        MedicalInsuranceFormComponent,
        MedicalInsuranceDetailComponent
    ],
    imports:[
        AppModuleShared,
        MedicalInsuranceRoutes
	],
	providers: [
		MedicalInsuranceService
	]
})
export class MedicalInsuranceModule{}