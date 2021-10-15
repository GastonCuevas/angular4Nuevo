import { NgModule } from '@angular/core';
import { AppModuleShared } from '../app.module.shared';

import { ExportationDetailListComponent } from './exportation-detail-list/exportation-detail-list.component';
import { ExportationDetailFormComponent } from './exportation-detail-form/exportation-detail-form.component';
import { ExportationDetailDetailViewComponent } from './exportation-detail-detailView/exportation-detail-detailView.component';
import { ExportationListComponent } from './../+exportations/exportation-list/exportation-list.component';
import { ExportationDetailService } from './exportation-detail.service';
import { exportationDetailRoutes } from './exportation-detail.routing';

import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
    imports: [
        AppModuleShared,
        exportationDetailRoutes,
        CKEditorModule
    ],
    exports: [
    ],
    declarations: [
        ExportationDetailFormComponent,
        ExportationListComponent,
        ExportationDetailDetailViewComponent
    ],
    providers: [
        ExportationDetailService
    ],
})
export class ExportationDetailModule { }
