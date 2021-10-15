import { NgModule } from '@angular/core';
import { AppModuleShared } from "../app.module.shared";
import { ArbolRoutes } from './arbol.routing';
import { ArbolFormComponent } from './arbol-form/arbol-form.component';
import { ArbolListComponent } from './arbol-list/arbol-list.component';

@NgModule({
  imports: [
    ArbolRoutes,
    AppModuleShared
  ],
  declarations: [

  ArbolFormComponent,

  ArbolListComponent],
  providers: [
  ]
})
export class ArbolModule { }
