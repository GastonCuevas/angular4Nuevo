import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExportationFormComponent } from './exportation-form/exportation-form.component';
import { ExportationListComponent } from './exportation-list/exportation-list.component';
import { ExportationDetailComponent} from './exportation-detail/exportation-detail.component';
import { ExportationDetailListComponent } from './../+exportations-detail/exportation-detail-list/exportation-detail-list.component';
// import { ExportationDetailFormComponent } from '../+exportations-detail/exportation-detail-form/exportation-detail-form.component';
import { ExportationEntryListComponent } from '../+exportations-entry/exportation-entry-list/exportation-entry-list.component';
import { ExportationUploadFormComponent } from '../+exportations/exportation-upload-form/exportation-upload-form.component';
import { ExportationCloneFormComponent } from '../+exportations/exportation-clone-form/exportation-clone-form.component';
import { AuthGuard } from '../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';
const routes: Routes = [
  { path: 'sistema/exportaciones/formulario', component: ExportationFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMEXPORTA',action:'ALTA'} },
  { path: 'sistema/exportaciones', component: ExportationListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMEXPORTA'} },
  { path: 'sistema/exportaciones/formulario/:id', component: ExportationFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMEXPORTA',action:'MODI'} },
  { path: 'sistema/exportaciones/detail/:id', component: ExportationDetailComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMEXPORTA'} },
  { path: 'sistema/exportaciones/detalles/:id', component: ExportationDetailListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMEXPORTA',action:'MODI'} },
  { path: 'sistema/exportaciones/entradas/:id', component: ExportationEntryListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMEXPORTA',action:'MODI'}},
  { path: 'sistema/exportaciones/formulario/upload/file', component: ExportationUploadFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMEXPORTA',action:'MODI'}},
  { path: 'sistema/exportaciones/clone/formulario/:id/:change', component: ExportationCloneFormComponent, canActivate: [AuthGuard, RouteGuard], data: { code: 'ABMEXPORTA', action:'ALTA'}}
];

export const exportationRoutes = RouterModule.forRoot(routes);
