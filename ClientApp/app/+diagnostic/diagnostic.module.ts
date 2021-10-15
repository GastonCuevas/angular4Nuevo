import { NgModule } from "@angular/core";

import { AppModuleShared } from "../app.module.shared";
import { DiagnosticRoutes } from './diagnostic.routing';
import { DiagnosticListComponent } from './diagnostic-list/diagnostic-list.component';
import { DiagnosticFormComponent } from './diagnostic-form/diagnostic-form.component';
import { DiagnosticDetailComponent } from './diagnostic-detail/diagnostic-detail.component';
import { DiagnosticUploadComponent } from './diagnostic-upload-form/diagnostic-upload-form.component';
import { DiagnosticService } from './diagnostic.service';

@NgModule({
	imports: [
		DiagnosticRoutes,
		AppModuleShared
	],
	declarations: [
		DiagnosticListComponent,
		DiagnosticFormComponent,
		DiagnosticDetailComponent,
		DiagnosticUploadComponent],
	providers: [
		DiagnosticService
	]
})
export class DiagnosticModule {}