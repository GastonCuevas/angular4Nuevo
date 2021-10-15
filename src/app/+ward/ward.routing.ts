import { AuthGuard } from './../+core/services/auth-guard.service';
import { RouterModule } from '@angular/router';
import { WardListComponent } from './ward-list/ward-list.component';
import { WardFormComponent } from './ward-form/ward-form.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
    { path: 'camas/salas', component: WardListComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMSALAS'} },
    { path: 'camas/salas/formulario', component: WardFormComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMSALAS',action:'ALTA'} },
    { path: 'camas/salas/formulario/:id', component: WardFormComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMSALAS',action:'MODI'} }
];

export const WardRoutes = RouterModule.forRoot(routes);