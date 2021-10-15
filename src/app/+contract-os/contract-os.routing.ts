import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ContractOsListComponent } from './contract-os-list/contract-os-list.component';
import { ContractOsFormComponent } from './contract-os-form/contract-os-form.component';
import { ContractOsDetailComponent } from './contract-os-detail/contract-os-detail.component';
import { AuthGuard } from '../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util';

const routes: Routes = [
	{ path: 'archivos/contratosOs', component: ContractOsListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMOSCONT'} },
	{ path: 'archivos/contratosOs/formulario', component: ContractOsFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMOSCONT',action:'ALTA'} },
	{ path: 'archivos/contratosOs/formulario/:id', component: ContractOsFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMOSCONT',action:'MODI'} },
	{ path: 'archivos/contratosOs/formulario/:id/:change', component: ContractOsFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMOSCONT',action:'MODI'} },
	{ path: 'archivos/contratosOs/detalle/:id', component: ContractOsDetailComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMOSCONT'} },
];

export const ContractOsRoutes = RouterModule.forRoot(routes);