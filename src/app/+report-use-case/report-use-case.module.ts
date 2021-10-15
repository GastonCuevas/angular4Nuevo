import { NgModule } from '@angular/core';

import { ReportUseCaseFormComponent } from './report-use-case-form/report-use-case-form.component';
import { ReportUseCaseListComponent } from './report-use-case-list/report-use-case-list.component';
import { reportUseCaseRoutes } from './report-use-case.routing';
import { ReportUseCaseService } from './report-use-case.service';
import { AppModuleShared } from '../app.module.shared';
import { IntellReportUserService } from '../+intellReport-finalUser/intellReport-finalUser.service';


@NgModule({
    imports: [
        AppModuleShared,
        reportUseCaseRoutes
    ],
    exports: [],
    declarations: [
        ReportUseCaseFormComponent,
        ReportUseCaseListComponent
    ],
    providers: [
        ReportUseCaseService,
        IntellReportUserService
    ],
})
export class ReportUseCaseModule { }
