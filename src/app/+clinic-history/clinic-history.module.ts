import { NgModule } from '@angular/core';
import { AppModuleShared } from '../app.module.shared';

import { ClinicHistoryListComponent } from './clinic-history-list/clinic-history-list.component';
import { ClinicHistoryFormComponent } from './clinic-history-form/clinic-history-form.component';

import {
    ClinicHistoryPharmacySchemeFormComponent,
    ClinicHistoryPharmacySchemeListComponent,
    ClinicHistoryPharmacySchemeService
 } from './pharmacy-scheme';

import {
    DiagnosticMovementFormComponent,
    DiagnosticMovementListComponent,
    DiagnosticMovementService
} from './diagnostic-movement';

import { ClinicHistoryRoutes } from './clinic-history.routing';
import { ClinicHistoryService } from './clinic-history.service';
import { MedicationToCheckComponent } from './pharmacy-scheme/medication-to-check/medication-to-check.component';
import { PharmacyNewItemsFormComponent } from './pharmacy-scheme/pharmacy-new-items-form/pharmacy-new-items-form.component';

@NgModule({
    imports: [
        AppModuleShared,
        ClinicHistoryRoutes
    ],
    declarations: [
        ClinicHistoryListComponent,
        ClinicHistoryFormComponent,
        ClinicHistoryPharmacySchemeListComponent,
        ClinicHistoryPharmacySchemeFormComponent,
        DiagnosticMovementFormComponent,
        DiagnosticMovementListComponent,
        MedicationToCheckComponent,
        PharmacyNewItemsFormComponent
    ],
    providers: [
        ClinicHistoryService,
        ClinicHistoryPharmacySchemeService,
        DiagnosticMovementService
    ],
    exports: [
        ClinicHistoryPharmacySchemeListComponent,
        ClinicHistoryPharmacySchemeFormComponent,
        DiagnosticMovementFormComponent,
        DiagnosticMovementListComponent,
        MedicationToCheckComponent,
        PharmacyNewItemsFormComponent
    ]
})
export class ClinicHistoryModule { }
