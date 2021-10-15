import { RouterModule } from '@angular/router';
import { AuthGuard } from './../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

import { PharmacyListComponent } from './pharmacy-list/pharmacy-list.component';
import { PharmacyReportsComponent } from './pharmacy-reports/pharmacy-reports.component';

const routes: Routes = [
	{ path: 'farmacia/movimientos', component: PharmacyReportsComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'LIQSOS'} },
	{ path: 'farmacia/entrega', component: PharmacyListComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'LIQSOS'} },
];

export const PharmacyRoutes = RouterModule.forRoot(routes)