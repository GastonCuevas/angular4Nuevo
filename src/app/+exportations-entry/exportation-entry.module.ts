import { NgModule } from '@angular/core';
import { AppModuleShared } from '../app.module.shared';

import { exportationEntryRoutes } from './exportation-entry.routing';
import { ExportationEntryFormComponent } from './exportation-entry-form/exportation-entry-form.component';
import { ExportationEntryDetailComponent } from './exportation-entry-detail/exportation-entry-detail.component';
import { ExportationEntryService } from './exportation-entry.service';

@NgModule({
    imports: [
        AppModuleShared,
        exportationEntryRoutes
    ],
    exports: [
        ExportationEntryFormComponent
    ],
    declarations: [
        ExportationEntryFormComponent,
        ExportationEntryDetailComponent
    ],
    providers: [
        ExportationEntryService
    ],
})
export class ExportationEntryModule { }
