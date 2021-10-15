
import { AuthGuard } from '../+core/services/auth-guard.service';
import { RouterModule } from '@angular/router';

import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';
import { SystemLogListComponent } from './system-log-list/system-log-list.component';
const routes: Routes = [
  { path: "sisarchivos/logs", component: SystemLogListComponent, canActivate: [AuthGuard,RouteGuard]},
];

export const SystemLogRoutes = RouterModule.forRoot(routes);