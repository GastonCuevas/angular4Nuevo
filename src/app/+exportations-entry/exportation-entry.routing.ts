import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExportationEntryFormComponent } from './../+exportations-entry/exportation-entry-form/exportation-entry-form.component';
import { ExportationEntryListComponent} from './../+exportations-entry/exportation-entry-list/exportation-entry-list.component';
import { ExportationEntryDetailComponent } from './exportation-entry-detail/exportation-entry-detail.component';
import { AuthGuard } from '../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';

const routes: Routes = [
    { path: 'sistema/exportaciones/entradas', component: ExportationEntryListComponent, canActivate: [AuthGuard, RouteGuard], data: { code: 'ABMEXPORTA' }},
    { path: 'sistema/exportaciones/entradas/formulario', component: ExportationEntryFormComponent, canActivate: [AuthGuard, RouteGuard], data: { code: 'ABMEXPORTA', action: 'ALTA' }},
    { path: 'sistema/exportaciones/entradas/formulario/:id', component: ExportationEntryFormComponent, canActivate: [AuthGuard, RouteGuard], data: { code: 'ABMEXPORTA', action: 'MODI' }},
    { path: 'sistema/exportaciones/entradas/detalle/:id', component: ExportationEntryDetailComponent, canActivate: [AuthGuard, RouteGuard], data: { code: 'ABMEXPORTA' }}
];

export const exportationEntryRoutes = RouterModule.forRoot(routes);