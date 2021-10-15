import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppModuleShared } from '../app.module.shared';
import { importRunRoutes } from './import-run.routing';
import { ImportRunFormComponent } from './import-run-form/import-run-form.component';
import { ImportFileService } from './import-file.service';

@NgModule({
  imports: [
    importRunRoutes,
    AppModuleShared
  ],
  declarations: [
    ImportRunFormComponent
  ],
  providers: [
    ImportFileService
  ]
})
export class ImportRunModule { }
