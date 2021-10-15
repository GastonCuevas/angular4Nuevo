import { BedListComponent } from './bed-list/bed-list.component';
import { AuthGuard } from './../+core/services/auth-guard.service';
import { RouterModule } from '@angular/router';
import { BedFormComponent } from './bed-form/bed-form.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util';

const routes: Routes = [
    { path: 'camas/camas', component: BedListComponent, canActivate: [AuthGuard,RouteGuard], data: {code: 'ABMCAMAS'} },
    { path: 'camas/camas/formulario', component: BedFormComponent, canActivate: [AuthGuard,RouteGuard], data: {code: 'ABMCAMAS', action: 'ALTA'} },
    { path: 'camas/camas/formulario/:id', component: BedFormComponent, canActivate: [AuthGuard,RouteGuard], data: {code:'ABMCAMAS',action: 'MODI'} }
];

export const BedRoutes = RouterModule.forRoot(routes);
