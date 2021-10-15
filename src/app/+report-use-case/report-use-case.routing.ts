import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ReportUseCaseFormComponent } from './report-use-case-form/report-use-case-form.component';
import { ReportUseCaseListComponent } from './report-use-case-list/report-use-case-list.component';
import { AuthGuard } from '../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';
const routes: Routes = [
  { path: 'sistema/reportUsec/formulario/:code', component: ReportUseCaseFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMREPUSEC',action:'MODI'} },
  { path: 'sistema/reportUsec', component: ReportUseCaseListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMREPUSEC'}}
];

export const reportUseCaseRoutes = RouterModule.forRoot(routes);