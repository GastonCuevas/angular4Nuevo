import { BedMovementListComponent } from './bed-movement-list/bed-movement-list.component';
import { AuthGuard } from './../+core/services/auth-guard.service';
import { RouterModule } from '@angular/router';
import { BedMovementCardDetailComponent } from './bed-movement-card-detail/bed-movement-card-detail.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util';
const routes: Routes = [
    { path: 'camas/movimientos', component: BedMovementListComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'INFOMOVCAM'} },
    { path: 'camas/movimientos/:camaId', component: BedMovementCardDetailComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'INFOMOVCAM'} },
];

export const BedMovementRoutes = RouterModule.forRoot(routes);