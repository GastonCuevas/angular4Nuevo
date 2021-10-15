import { NgModule } from '@angular/core';
import { AppModuleShared } from '../app.module.shared';

import { PracticeInosDetailComponent } from './practice-inos-detail/practice-inos-detail.component';
import { PracticeInosFormComponent } from './practice-inos-form/practice-inos-form.component';
import { PracticeInosListComponent } from './practice-inos-list/practice-inos-list.component';
import { PracticeInosUploadFormComponent } from './practice-inos-upload-form/practice-inos-upload-form.component';
import { practiceInosRoutes } from './practice-inos.routing';
import { PracticeInosService } from './practice-inos.service';

@NgModule({
    imports: [
        practiceInosRoutes,
        AppModuleShared
    ],
    exports: [],
    declarations: [
        PracticeInosDetailComponent,
        PracticeInosFormComponent,
        PracticeInosListComponent,
        PracticeInosUploadFormComponent
    ],
    providers: [
        PracticeInosService
    ],
})
export class PracticeInosModule { }
