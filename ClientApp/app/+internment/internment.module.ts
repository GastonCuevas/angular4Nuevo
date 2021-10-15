import { NgModule } from '@angular/core';
import { AppModuleShared } from "../app.module.shared";

import { internmentRoutes } from './internment.routing';
import { InternmentListComponent } from './internment-list/internment-list.component';
import { InternmentFormComponent } from './internment-form/internment-form.component';
import { InternmentDetailComponent } from './internment-detail/internment-detail.component';
import { InternmentService } from './internment.service';
import { FormControlService } from '../+shared/forms/form-control.service';
import { HcEvolutionFormComponent } from './hc-evolution-form/hc-evolution-form.component';
import { HcEvolutionService } from './hc-evolution.service';
import { ClinicHistoryModule } from '../+clinic-history/clinic-history.module';
import { DiagnosticMovementService } from '../+clinic-history/diagnostic-movement/index';
import { ClinicHistoryPharmacySchemeService } from '../+clinic-history/pharmacy-scheme/index';
import { TreatingProfessionalService } from './treating-professional.service';
import { TreatingProfessionalFormComponent } from './treating-professional-form/treating-professional-form.component';
import { InternmentHighHospitalizationFormComponent } from './internment-high-hospitalization-form/internment-high-hospitalization-form.component';

@NgModule({
    imports: [
        internmentRoutes,
        AppModuleShared,
        ClinicHistoryModule
    ],
    declarations: [
        InternmentListComponent,
        InternmentFormComponent,
        InternmentDetailComponent,
        HcEvolutionFormComponent,
        TreatingProfessionalFormComponent,
        InternmentHighHospitalizationFormComponent
    ],
    providers: [
        InternmentService,
        DiagnosticMovementService,
        FormControlService,
        ClinicHistoryPharmacySchemeService,
        HcEvolutionService,
        TreatingProfessionalService
    ]
})
export class InternmentModule { }
