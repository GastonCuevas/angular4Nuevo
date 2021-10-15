import { NgModule } from '@angular/core';

import { AppModuleShared } from './../app.module.shared';
import { PharmacyRoutes } from './pharmacy.routing';
import { PharmacyService } from './pharmacy.service';
import { PharmacyListComponent } from './pharmacy-list/pharmacy-list.component';
import { PharmacyPatientsComponent} from './pharmacy-patients/pharmacy-patients.component';
import { PharmacySchemesComponent } from './pharmacy-schemes/pharmacy-schemes.component';
import { PharmacySchemeDetailComponent } from './pharmacy-scheme-detail/pharmacy-scheme-detail.component';
import { PharmacySummaryComponent } from './pharmacy-summary/pharmacy-summary.component';
import { PharmacyReportsComponent } from './pharmacy-reports/pharmacy-reports.component';

@NgModule({
    imports:[
        AppModuleShared,
        PharmacyRoutes
	],
    declarations: [
        PharmacyReportsComponent,
        PharmacySchemeDetailComponent,
        PharmacyListComponent,
        PharmacyPatientsComponent,
        PharmacySchemesComponent,
        PharmacySummaryComponent
    ],
	providers: [
		PharmacyService
	]
})
export class PharmacyModule{}