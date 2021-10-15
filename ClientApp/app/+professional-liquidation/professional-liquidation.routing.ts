import { RouterModule } from "@angular/router";
import { AuthGuard } from './../+core/services';

import { ProfessionalLiquidationComponent } from "./liquidation/professional-liquidation.component";
import { ProfessionalHistoryComponent } from "./history/professional-history.component";
import { RouteGuard } from "../+core/guard/route-guard.service";
import { Routes } from '../+shared/util/router';

const routes: Routes = [
    { path: "liquidacion/profesionales", component: ProfessionalLiquidationComponent, canActivate: [AuthGuard, RouteGuard], data: { code: 'LIQPRO' } },
    { path: "liquidacion/historial", component: ProfessionalHistoryComponent, canActivate: [AuthGuard, RouteGuard], data: { code: 'LIQPROF' } }
];

export const ProfessionalLiquidationRoutes = RouterModule.forRoot(routes)