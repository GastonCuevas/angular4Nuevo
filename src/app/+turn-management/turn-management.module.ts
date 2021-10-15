import { NgModule } from '@angular/core';
import { AppModuleShared } from './../app.module.shared';

import { TurnManagementComponent } from './main/turn-management.component';
import { FilterFormComponent } from './filter-form/filter-form.component';
import { ConsultationModalComponent } from './consultation-modal/consultation-modal.component';
import { ProfessionalSchedulesComponent } from './professional-schedules/professional-schedules.component';
import { TMCalendarComponent } from './calendar/tm-calendar.component';
import { TurnListComponent } from './turn-list/turn-list.component';
import { TurnFormComponent } from './turn-form/turn-form.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientMedicalInsuranceFormComponent } from './patient-form/pmi-form/pmi-form.component';
import { PMIListComponent } from './patient-form/pmi-list/pmi-list.component';

import { TurnManagementService } from './turn-management.service';
import { TurnManagementRoutes } from './turn-management.routing';

import { FullCalendarModule } from 'ng-fullcalendar';

@NgModule({
    imports: [
        AppModuleShared,
        FullCalendarModule,
        TurnManagementRoutes,
    ],
    declarations: [
        TurnManagementComponent,
        FilterFormComponent,
        ConsultationModalComponent,
        ProfessionalSchedulesComponent,
        TMCalendarComponent,
        TurnListComponent,
        TurnFormComponent,
        PatientFormComponent,
        PatientMedicalInsuranceFormComponent,
        PMIListComponent
    ],
    providers: [
        TurnManagementService
    ],
})
export class TurnManagementModule { }
