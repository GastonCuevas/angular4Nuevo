import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PatientResponsibleFormComponent } from './patient-responsible-form/patient-responsible-form.component';
import { PatientResponsibleListComponent } from './patient-responsible-list/patient-responsible-list.component';
import { PatientResponsibleDetailComponent } from './patient-responsible-detail/patient-responsible-detail.component';
import { AuthGuard } from '../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';
const routes: Routes = [
  { path: 'archivos/pacientesResponsable', component: PatientResponsibleListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMRESPONS'} },
  { path: 'archivos/pacientesResponsable/formulario', component: PatientResponsibleFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMRESPONS',action:'ALTA'} },
  { path: 'archivos/pacientesResponsable/formulario/:id', component: PatientResponsibleFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMRESPONS',action:'MODI'} },
  { path: 'archivos/pacientesResponsable/detalle/:id', component:  PatientResponsibleDetailComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMRESPONS'}}
];

export const PatientResponsibleRoutes = RouterModule.forRoot(routes);