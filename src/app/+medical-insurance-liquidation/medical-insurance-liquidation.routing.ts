import { RouterModule } from '@angular/router';
import { AuthGuard } from './../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';
import { MILiquidationComponent } from './mi-liquidation/mi-liquidation.component';
import { MedicalInsuranceLiquidationListComponent } from './medical_insurance_liquidation_list/medical-insurance-liquidation-list.component';
import { MedicalInsuranceCollectedComponent } from './medical_insurance_collected/medical-insurance-collected.component';

const routes: Routes = [
	{ path: 'liquidacion/os', component: MedicalInsuranceLiquidationListComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'LIQSOS'} },
	{ path: 'liquidacion/os/liquidate', component: MILiquidationComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'LIQOS'} },
	{ path: 'liquidacion/os/cobro', component: MedicalInsuranceCollectedComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'COLIQOS'} },
];

export const MedicalInsuranceLiquidationRoutes = RouterModule.forRoot(routes)