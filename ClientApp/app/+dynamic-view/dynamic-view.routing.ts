import { RouterModule } from '@angular/router';

import { AuthGuard, RouteGuard } from './../+core/services';
import { Routes } from '../+shared/util';
import { DynamicListComponent } from './dynamic-list/dynamic-list.component';
import { AuxiliaryComponent } from './dynamic-list/auxiliary.component';

const routes: Routes = [
    { path: 'dinamica/vista/:codigo', component: AuxiliaryComponent,canActivate: [AuthGuard] },
    { path: 'dynamic-view/:codigo', component: DynamicListComponent,canActivate: [AuthGuard, RouteGuard], data: {code: 'DYNAMIC', dynamic: true} },
];

export const dynamicViewRoutes = RouterModule.forRoot(routes);