import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppModuleShared } from '../app.module.shared';
import { FormsModule } from '@angular/forms';
import { WardSectorService } from './ward-sector.service';
import { WardSectorFormComponent } from './ward-sector-form/ward-sector-form.component';
import { WardSectorListComponent } from './ward-sector-list/ward-sector-list.component';
import { WardSectorRoutes } from './ward-sector.routing';

@NgModule({
  imports: [
    WardSectorRoutes,
    AppModuleShared,
    FormsModule
  ],
  declarations: [
    WardSectorFormComponent, 
    WardSectorListComponent
  ],
  providers: [
    WardSectorService
  ]
})
export class WardSectorModule { }
