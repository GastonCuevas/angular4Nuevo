import { NgModule } from "@angular/core";

import { AppModuleShared } from "../app.module.shared";
import { TurnConsultationRoutes } from './turn-consultation.routing';
import { TurnConsultationListComponent } from './turn-consultation-list/turn-consultation-list.component';
import { TurnConsultationFormComponent } from './turn-consultation-form/turn-consultation-form.component';
import { TurnConsultationService } from './turn-consultation.service';


@NgModule({
	imports: [
		TurnConsultationRoutes,
		AppModuleShared
	],
	declarations: [
		TurnConsultationListComponent,
		TurnConsultationFormComponent,
	],
	providers: [
		TurnConsultationService
	]
})

export class TurnConsultationModule { }