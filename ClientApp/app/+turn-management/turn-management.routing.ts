import { RouterModule } from '@angular/router';
import { AuthGuard } from './../+core/services/auth-guard.service';
import { TurnManagementComponent } from './main/turn-management.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
    { path: 'archivos/turnos', component: TurnManagementComponent, canActivate: [AuthGuard] }
];

export const TurnManagementRoutes = RouterModule.forRoot(routes);
