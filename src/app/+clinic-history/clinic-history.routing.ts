import { RouterModule } from '@angular/router';
import { ClinicHistoryListComponent } from './clinic-history-list/clinic-history-list.component';
import { ClinicHistoryFormComponent } from './clinic-history-form/clinic-history-form.component';
import { AuthGuard } from '../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util';

const routes: Routes = [
	{ path: 'historiaclinica/listado', component: ClinicHistoryListComponent, canActivate: [AuthGuard, RouteGuard], data: {code: 'ABMHISTORI'} },
	{ path: 'historiaclinica/listado/:patientId', component: ClinicHistoryListComponent, canActivate: [AuthGuard, RouteGuard], data: {code: 'ABMHISTORI'} },
	{ path: 'historiaclinica/formulario/nuevo/:patientMovementId', component: ClinicHistoryFormComponent, canActivate: [AuthGuard,RouteGuard], data: {code: 'ABMHISTORI', action: 'ALTA'} },
	{ path: 'historiaclinica/formulario/editar/:id', component: ClinicHistoryFormComponent,canActivate: [AuthGuard, RouteGuard], data: {code: 'ABMHISTORI', action: 'MODI'} },
];

export const ClinicHistoryRoutes = RouterModule.forRoot(routes);