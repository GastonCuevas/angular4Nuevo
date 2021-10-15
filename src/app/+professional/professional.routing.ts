import { AuthGuard } from './../+core/services/auth-guard.service';
import { RouterModule } from '@angular/router';
import { ProfessionalFormComponent } from './professional-form/professional-form.component';
import { ProfessionalListComponent } from './professional-list/professional-list.component';
import { ProfessionalDetailComponent } from './professional-detail/professional-detail.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router'

const routes: Routes = [
    { path: 'gestionProfesionales/profesionales', component: ProfessionalListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMPROFESI'} },
    { path: 'gestionProfesionales/profesionales/formulario', component: ProfessionalFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMPROFESI',action:'ALTA'} },
    { path: 'gestionProfesionales/profesionales/formulario/:id', component: ProfessionalFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMPROFESI',action:'MODI'} },
    { path: 'gestionProfesionales/profesionales/detalle/:id', component: ProfessionalDetailComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMPROFESI'} },
];

export const ProfessionalRoutes = RouterModule.forRoot(routes);