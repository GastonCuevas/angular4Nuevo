import { NgModule } from "@angular/core";

import { AppModuleShared } from "../app.module.shared";
import { IntellReportFinalUserFormComponent } from './intell-report-final-user-form/intell-report-final-user-form.component';
import { IntellReportViewHTMLComponent } from './intell-report-viewHTML/intell-report-viewHTML.component';
import { SafeHtmlPipe } from './intell-report-viewHTML/safe-html.pipe'
import { intellReportRoutes } from './intellReport-finalUser.routing';

import { DynamicComponent } from './dynamic-component/dynamic.component';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
    imports: [
        AppModuleShared,
        intellReportRoutes,
        CKEditorModule
    ],
    declarations: [
        IntellReportFinalUserFormComponent,
        IntellReportViewHTMLComponent,
        SafeHtmlPipe,
        DynamicComponent
    ],
    providers: [
    ]
})

export class IntellReportModule { }