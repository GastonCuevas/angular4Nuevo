import { InternmentSelectedListComponent } from './internment-selected-list/internment-selected-list.component';
import { RouterModule } from '@angular/router';
import { MedicationDeliveryDetailComponent } from './medication-delivery-detail/medication-delivery-detail.component';
import { ReturnMedicationListComponent } from './return-medication-list/return-medication-list.component';
import { AuthGuard } from '../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
    { path: 'historiaclinica/consumo', component: InternmentSelectedListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMHCFARMA'} },
    { path: 'historiaclinica/consumo/detail', component: MedicationDeliveryDetailComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMHCFARMA'} },
    { path: 'historiaclinica/consumo/returnMedication/:internmentId', component: ReturnMedicationListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMHCFARMA',action:'MODI'} }
];

export const HcEvolutionPharmacyRoutes = RouterModule.forRoot(routes);