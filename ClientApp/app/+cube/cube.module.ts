import { NgModule } from "@angular/core";
import { AppModuleShared } from "../app.module.shared";

import { CubeRoutes } from './cube.routing';
import { CubeFormComponent } from './cube-form/cube-form.component';
import { CubeAnalysisComponent } from './cube-analysis/cube-analysis.component';
import { CubeService } from './cube.service';

@NgModule({
	imports: [
		CubeRoutes,
		AppModuleShared
	],
	declarations: [
		CubeFormComponent,
		CubeAnalysisComponent,
	],
	providers: [
		CubeService
	]
})

export class CubeModule { }