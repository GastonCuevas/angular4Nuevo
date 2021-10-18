import 'jquery-ui-dist/jquery-ui.js';
// js for ckeditor
import 'materialize-css';

import { MaterializeModule } from 'angular2-materialize';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { ToastyModule } from 'ng2-toasty';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

// import { appReducer } from './app-store';
import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
// import { routing } from './app.routes';
import { CoreModule } from './+core/core.module';
import { DynamicFormComponent } from './+shared/forms/dynamic-form/dynamic-form.component';
import { DynamicFormControlComponent } from './+shared/forms/dynamic-form-control/dynamic-form-control.component';
import { ErrorMessageComponent } from './+shared/forms/error-message/error-message.component';
import { DynamicTableComponent } from './+shared/dynamic-table/dynamic-table.component';
import { ModalConfirmComponent } from './+shared/modal/modal-confirm/modal-confirm.component';

import { DynamicFilterComponent, ButtonFloatingComponent, PaginatorComponent } from './+shared/dynamic-table-v2';
// import { ImageToDataUrlModule } from 'ngx-image2dataurl';
import { InputAutoComplete, IACWithValidation, InputAutocomplete } from './+shared/input-auto-complete';

import { LoadingComponent } from './+shared/loading/loading.component';
import { LoadingGlobalComponent } from './+shared/loading-global/loading-global.component';
// import { IACRemoteData } from './+shared/iac-remote-data/iac-remote-data.component';
import { InputSearchComponent } from './+shared/input-with-search/input-search.component';

import { IntelligentReportComponent, DynamicComponent } from './+shared/intelligent-report';
// import { CKEditorModule } from 'ng2-ckeditor';
import { ButtonSubmitComponent } from './+shared/button-submit/button-submit.component';
import { NotFoundComponent } from './+shared/not-found/not-found.component';
import { ErrorComponent } from './+shared/error/error.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        DynamicFormComponent,
        DynamicFormControlComponent,
        ErrorMessageComponent,
        DynamicTableComponent,
        DynamicFilterComponent,
        ModalConfirmComponent,
        ButtonFloatingComponent,
        InputAutoComplete,
        InputAutocomplete,
        IACWithValidation,
        // IACRemoteData,
        LoadingComponent,
        LoadingGlobalComponent,
        InputSearchComponent,
        PaginatorComponent,
        IntelligentReportComponent,
        DynamicComponent,
        ButtonSubmitComponent,
        NotFoundComponent,
        ErrorComponent
    ],
    imports: [
        // Modules
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        MaterializeModule,
        ToastyModule.forRoot(),
        // routing,
        // ImageToDataUrlModule
        NguiAutoCompleteModule,
        // DataTablesModule,
        // CKEditorModule
    ],
    exports: [
        CommonModule,
        HttpModule,
        FormsModule,
        MaterializeModule,
        ReactiveFormsModule,
        NguiAutoCompleteModule,
        // ImageToDataUrlModule,
        DynamicFormComponent,
        DynamicFormControlComponent,
        ErrorMessageComponent,
        DynamicTableComponent,
        DynamicFilterComponent,
        ModalConfirmComponent,
        ButtonFloatingComponent,
        InputAutoComplete,
        InputAutocomplete,
        IACWithValidation,
        // IACRemoteData,
        LoadingComponent,
        InputSearchComponent,
        PaginatorComponent,
        // DataTablesModule,
        IntelligentReportComponent,
        DynamicComponent,
        // CKEditorModule,
        ButtonSubmitComponent,
        NotFoundComponent,
        ErrorComponent
    ],
    entryComponents: [IntelligentReportComponent, DynamicComponent]
})
export class AppModuleShared {
}
