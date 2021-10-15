import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExportationDetailFormComponent } from './exportation-detail-form/exportation-detail-form.component';
import { ExportationDetailListComponent } from './exportation-detail-list/exportation-detail-list.component';
import { ExportationDetailDetailViewComponent } from './exportation-detail-detailView/exportation-detail-detailView.component';
import { ExportationListComponent } from './../+exportations/exportation-list/exportation-list.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { AuthGuard } from '../+core/services/auth-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
 // { path: 'sistema/exportaciones/detalles', component: ExportationDetailListComponent },
  { path: 'sistema/exportaciones/detalles/formulario', component: ExportationDetailFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMEXPORTA',action:'ALTA'}},
  { path: 'sistema/exportaciones/detalles/formulario/:id', component: ExportationDetailFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMEXPORTA',action:'MODI'}},
  { path: 'sistema/exportaciones', component: ExportationListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMEXPORTA'}},
  { path: 'sistema/exportaciones/detalles/detalleVista/:id', component: ExportationDetailDetailViewComponent, canActivate: [AuthGuard, RouteGuard],data:{code:'ABMEXPORTA'}}  
];

export const exportationDetailRoutes = RouterModule.forRoot(routes);