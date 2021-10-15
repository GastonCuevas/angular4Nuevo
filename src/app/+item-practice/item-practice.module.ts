import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemPracticeListComponent } from './item-practice-list/item-practice-list.component';
import { ItemPracticeFormComponent } from './item-practice-form/item-practice-form.component';
import { AssignedPracticeTypeService } from './assigned-practice-type.service';
import { ItemPracticeService } from './item-practice.service';
import { AppModuleShared } from './../app.module.shared';
import { itemPracticeRoutes } from './item-practice.routing';

@NgModule({
  imports: [
    itemPracticeRoutes,
    AppModuleShared
  ],
  declarations: [
    ItemPracticeListComponent, 
    ItemPracticeFormComponent
  ],
  providers: [
    ItemPracticeService,
    AssignedPracticeTypeService
  ],
})
export class ItemPracticeModule { }
