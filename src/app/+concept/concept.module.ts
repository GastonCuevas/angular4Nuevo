import { ConceptService } from './concept.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConceptFormComponent } from './concept-form/concept-form.component';
import { ConceptListComponent } from './concept-list/concept-list.component';
import { ConceptRoutes } from './concept.routing';
import { AppModuleShared } from '../app.module.shared';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ConceptRoutes,
    AppModuleShared,
    FormsModule
  ],
  declarations: [
    ConceptFormComponent, 
    ConceptListComponent
  ],
  providers: [
    ConceptService
  ]
})
export class ConceptModule { }
