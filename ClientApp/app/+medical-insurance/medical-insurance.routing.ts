import { AuthGuard } from './../+core/services/auth-guard.service';
import { RouterModule } from "@angular/router";

import { MedicalInsuranceListComponent } from './medical-insurance-list/medical-insurance-list.component';
import { MedicalInsuranceFormComponent } from './medical-insurance-form/medical-insurance-form.component';
import { MedicalInsuranceDetailComponent } from './medical-insurance-detail/medical-insurance-detail.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
	{ path: "archivos/obraSocial", component: MedicalInsuranceListComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMOBRASOC'} },
	{ path: "archivos/obraSocial/formulario", component: MedicalInsuranceFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMOBRASOC', action:'ALTA'} },
	{ path: "archivos/obraSocial/formulario/:id", component: MedicalInsuranceFormComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMOBRASOC', action:'MODI'} },
    { path: "archivos/obraSocial/detalle/:id", component: MedicalInsuranceDetailComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMOBRASOC'} }
];

export const MedicalInsuranceRoutes = RouterModule.forRoot(routes)