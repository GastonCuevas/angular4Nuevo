import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PracticeInosDetailComponent } from './practice-inos-detail/practice-inos-detail.component';
import { PracticeInosFormComponent } from './practice-inos-form/practice-inos-form.component';
import { PracticeInosListComponent } from './practice-inos-list/practice-inos-list.component';
import { PracticeInosUploadFormComponent } from './practice-inos-upload-form/practice-inos-upload-form.component'; 
import { AuthGuard } from '../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
  { path: 'archivos/practicasInos/detalle/:id', component: PracticeInosDetailComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMINOS'} },
  { path: 'archivos/practicasInos/formulario', component: PracticeInosFormComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMINOS',action:'ALTA'} },
  { path: 'archivos/practicasInos/formulario/:id', component: PracticeInosFormComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMINOS',action:'MODI'} },
  { path: 'archivos/practicasInos', component: PracticeInosListComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMINOS'}},
  { path: 'archivos/practicasInos/formulario/upload/file', component: PracticeInosUploadFormComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMINOS'}}
];

export const practiceInosRoutes = RouterModule.forRoot(routes);