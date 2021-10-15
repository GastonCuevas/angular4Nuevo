import { NgModule } from '@angular/core';

import { AppModuleShared } from '../app.module.shared'; 
import { ExportationFormComponent } from './exportation-form/exportation-form.component';
// import { ExportationListComponent } from './exportation-list/exportation-list.component';
import { ExportationDetailComponent} from './exportation-detail/exportation-detail.component';
import { ExportationUploadFormComponent } from './exportation-upload-form/exportation-upload-form.component';
import { ExportationCloneFormComponent } from './exportation-clone-form/exportation-clone-form.component';
// import { ExportationDetailListComponent } from './../+exportations-detail/exportation-detail-list/exportation-detail-list.component';
// import { ExportationDetailFormComponent } from './../+exportations-detail/exportation-detail-form/exportation-detail-form.component';
// import { ExportationEntryListComponent } from './../+exportations-entry/exportation-entry-list/exportation-entry-list.component';
import { ExportationDetailService } from './../+exportations-detail/exportation-detail.service';
import { ExportationEntryService } from './../+exportations-entry/exportation-entry.service';
import { exportationRoutes } from './exportation.routing';
import { ExportationService } from './exportation.service';
import { ExportationDetailModule } from './../+exportations-detail/exportation-detail.module';
import { ExportationEntryModule } from './../+exportations-entry/exportation-entry.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { ExportationDetailListComponent } from '../+exportations-detail/exportation-detail-list/exportation-detail-list.component';
import { ExportationEntryListComponent } from '../+exportations-entry/exportation-entry-list/exportation-entry-list.component';

@NgModule({
    imports: [
        AppModuleShared, 
        exportationRoutes,
        ExportationDetailModule,
        ExportationEntryModule,
        CKEditorModule 
    ],
    exports: [],
    declarations: [
        ExportationFormComponent,
        // ExportationListComponent,
        ExportationDetailComponent,
        // ExportationDetailListComponent,
        // ExportationDetailFormComponent,
        // ExportationEntryListComponent,
        ExportationUploadFormComponent,
        ExportationCloneFormComponent,
        ExportationDetailListComponent,
        ExportationEntryListComponent,
    ],
    providers: [
        ExportationService,
        ExportationDetailService,
        ExportationEntryService
        
    ],
})
export class ExportationModule { }
