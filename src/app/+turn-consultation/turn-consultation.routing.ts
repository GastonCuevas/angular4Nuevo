import { AuthGuard } from './../+core/services/auth-guard.service';
import { RouterModule } from '@angular/router';
import { TurnConsultationListComponent } from './turn-consultation-list/turn-consultation-list.component';
import { TurnConsultationFormComponent } from './turn-consultation-form/turn-consultation-form.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';
const routes: Routes = [
    { path: 'archivos/turnos-consulta', component: TurnConsultationListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'CONSUTURNO'} },
    { path: 'archivos/turnos-consulta/formulario/:id', component: TurnConsultationFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'CONSUTURNO',action:'MODI'} },
];

export const TurnConsultationRoutes = RouterModule.forRoot(routes);