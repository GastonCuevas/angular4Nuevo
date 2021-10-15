import { NgModule } from '@angular/core';
import { ImportDataFormComponent } from './import-data-form/import-data-form.component';
import { importDataRoutes } from './import-data.routing';
import { AppModuleShared } from '../app.module.shared';
import { ImportDataListComponent } from './import-data-list/import-data-list.component';
import { ImportDataService } from './import-data.service';
import { ImportDataFieldFormComponent } from './import-data-field-form/import-data-field-form.component';
import { ImportFieldService } from './import-field.service';

@NgModule({
  imports: [
    importDataRoutes,
    AppModuleShared
  ],
  declarations: [
    ImportDataFormComponent,
    ImportDataListComponent,
    ImportDataFieldFormComponent
  ],
  providers: [
    ImportDataService,
    ImportFieldService
  ]
})
export class ImportDataModule { }
