import { RouterModule } from '@angular/router';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { AuthGuard } from '../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
    { path: 'archivos/pacientes', component: PatientListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMPACIENS'} },
    { path: 'archivos/pacientes/formulario', component: PatientFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMPACIENS',action:'ALTA'} },
    { path: 'archivos/pacientes/formulario/:id', component: PatientFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMPACIENS',action:'MODI'} },
    { path: 'archivos/pacientes/detalle/:id', component: PatientDetailComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMPACIENS'} }
    
];

export const PatientRoutes = RouterModule.forRoot(routes);