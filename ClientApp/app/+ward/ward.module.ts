import { WardService } from './ward.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WardFormComponent } from './ward-form/ward-form.component';
import { WardListComponent } from './ward-list/ward-list.component';
import { WardRoutes } from './ward.routing';
import { AppModuleShared } from '../app.module.shared';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    WardRoutes,
    AppModuleShared,
    FormsModule
  ],
  declarations: [
    WardFormComponent, 
    WardListComponent
  ],
  providers: [
    WardService
  ]
})
export class WardModule { }
