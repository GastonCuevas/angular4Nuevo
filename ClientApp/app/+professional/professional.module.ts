import { NgModule } from "@angular/core";

import { AppModuleShared } from "../app.module.shared";
import { ProfessionalRoutes } from './professional.routing';
import { ProfessionalListComponent } from './professional-list/professional-list.component';
import { ProfessionalFormComponent } from "./professional-form/professional-form.component";
import { ProfessionalDetailComponent } from "./professional-detail/professional-detail.component";
import { ProfessionalService } from './professional.service';

@NgModule({
    imports: [
		ProfessionalRoutes,
        AppModuleShared
    ],
    declarations: [
		ProfessionalFormComponent,
        ProfessionalListComponent,
        ProfessionalDetailComponent
    ],
	providers: [
		ProfessionalService
    ]
})

export class ProfessionalModule { }