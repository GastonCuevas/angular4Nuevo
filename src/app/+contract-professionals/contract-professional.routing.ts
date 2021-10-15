import { AuthGuard } from './../+core/services/auth-guard.service';
import { RouterModule } from '@angular/router';
import { ContractProfessionalListComponent } from './contract-professional-list/contract-professional-list.component';
import { ContractProfessionalFormComponent } from './contract-professional-form/contract-professional-form.component';

import { ContractProfessionalAbsenceListComponent } from './contract-professional-absence-list/contract-professional-absence-list.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util';

const routes: Routes = [
    { path: 'gestionProfesionales/contratos', component: ContractProfessionalListComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMPROCONT'} },
    { path: 'gestionProfesionales/contratos/:profesionalId', component: ContractProfessionalListComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMPROCONT'} },
    { path: 'gestionProfesionales/contratos/:profesionalId/formulario', component: ContractProfessionalFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMPROCONT', action:'ALTA'} },
    { path: 'gestionProfesionales/contratos/:profesionalId/formulario/:id', component: ContractProfessionalFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMPROCONT', action:'MODI'} },
    { path: 'gestionProfesionales/contratos/:profesionalId/clone/:id', component: ContractProfessionalFormComponent, canActivate: [AuthGuard, RouteGuard], data: { code: 'ABMPROCONT', action:'ALTA'} },
    { path: 'gestionProfesionales/contratos/ausencias/:contratoId', component: ContractProfessionalAbsenceListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMPROCONT', action:'MODI'} }
];

export const ContractProfessionalsRoutes = RouterModule.forRoot(routes);