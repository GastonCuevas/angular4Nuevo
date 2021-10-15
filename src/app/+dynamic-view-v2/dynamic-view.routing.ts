import { RouterModule } from '@angular/router';
import { AuthGuard, RouteGuard } from './../+core/services';
import { Routes } from '../+shared/util';
import { DynamicViewListComponent } from './dynamic-view-list/dynamic-view-list.component';
import { AuxiliaryComponent } from './dynamic-view-list/auxiliary.component';

const routes: Routes = [
    { path: 'router-to-dynamic/:codigo', component: AuxiliaryComponent },
    { path: 'vista-dinamica-v2-aux/:codigo', component: AuxiliaryComponent },
    { path: 'vista-dinamica/:codigo', component: DynamicViewListComponent, canActivate: [AuthGuard,RouteGuard], data: {code: 'DYNAMIC', dynamic: true} },
];

export const dynamicViewRoutes = RouterModule.forRoot(routes);