import { BedMovementService } from './bed-movement.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BedCardComponent } from './bed-card/bed-card.component';
import { AppModuleShared } from '../app.module.shared';
import { BedMovementListComponent } from './bed-movement-list/bed-movement-list.component';
import { BedMovementRoutes } from './bed-movement.routing';
import { BedMovementCardDetailComponent } from './bed-movement-card-detail/bed-movement-card-detail.component';

@NgModule({
  imports: [
    AppModuleShared,
    BedMovementRoutes
  ],
  declarations: [
    BedCardComponent,
    BedMovementListComponent,
    BedMovementCardDetailComponent
  ],
  providers: [
    BedMovementService,
  ]
})
export class BedMovementModule { }
