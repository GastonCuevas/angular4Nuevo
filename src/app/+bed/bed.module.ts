import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BedFormComponent } from './bed-form/bed-form.component';
import { BedListComponent } from './bed-list/bed-list.component';
import { AppModuleShared } from '../app.module.shared';
import { FormsModule } from '@angular/forms';
import { BedRoutes } from './bed.routing';
import { BedService } from './bed.service';
import { RouteGuard } from '../+core/guard/route-guard.service';

@NgModule({
  imports: [
    BedRoutes,
    AppModuleShared,
    FormsModule
  ],
  declarations: [
    BedFormComponent, 
    BedListComponent
  ],
  providers: [
    BedService,
    RouteGuard
  ]
})
export class BedModule { }
