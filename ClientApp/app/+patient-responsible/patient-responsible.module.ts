import { NgModule } from '@angular/core';

import { AppModuleShared } from '../app.module.shared';
import { PatientResponsibleFormComponent } from './patient-responsible-form/patient-responsible-form.component';
import { PatientResponsibleListComponent } from './patient-responsible-list/patient-responsible-list.component';
import { PatientResponsibleDetailComponent } from './patient-responsible-detail/patient-responsible-detail.component';
import { PatientResponsibleService } from './patient-responsible.service';
import { PatientResponsibleRoutes } from './patient-responsible.routing';

@NgModule({
	imports: [
		AppModuleShared,
		PatientResponsibleRoutes
	],
	declarations: [
		PatientResponsibleFormComponent,
		PatientResponsibleListComponent,
		PatientResponsibleDetailComponent
	],
	providers: [
		PatientResponsibleService
	],
})
export class PatientResponsibleModule { }
