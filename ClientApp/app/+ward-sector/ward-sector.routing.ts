import { AuthGuard } from './../+core/services/auth-guard.service';
import { RouterModule } from '@angular/router';
import { WardSectorFormComponent } from './ward-sector-form/ward-sector-form.component';
import { WardSectorListComponent } from './ward-sector-list/ward-sector-list.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
    { path: 'camas/sectorsala', component: WardSectorListComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMSECSALA'} },
    { path: 'camas/sectorsala/formulario', component: WardSectorFormComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMSECSALA',action:'ALTA'} },
    { path: 'camas/sectorsala/formulario/:id', component: WardSectorFormComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMSECSALA',action:'MODI'} }
];

export const WardSectorRoutes = RouterModule.forRoot(routes);