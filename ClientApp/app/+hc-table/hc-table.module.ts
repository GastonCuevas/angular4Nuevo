import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcTableListComponent } from './hc-table-list/hc-table-list.component';
import { HcTableFormComponent } from './hc-table-form/hc-table-form.component';
import { hcTableRoutes } from './hc-table.routing';
import { AppModuleShared } from '../app.module.shared';
import { HcTableItemService } from './hc-table-item.service';
import { HcTableService } from './hc-table.service';
import { HcTableItemFormComponent } from './hc-table-item-form/hc-table-item-form.component';

@NgModule({
  imports: [
    hcTableRoutes,
    AppModuleShared
  ],
  declarations: [
    HcTableListComponent, 
    HcTableFormComponent, 
    HcTableItemFormComponent
  ],
  providers: [
    HcTableService,
    HcTableItemService
  ],
})
export class HcTableModule { }
