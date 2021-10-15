import { AuthGuard } from './../+core/services/auth-guard.service';
import { RouterModule } from '@angular/router';
import { InternmentListComponent } from './internment-list/internment-list.component';
import { InternmentFormComponent } from './internment-form/internment-form.component';
import { InternmentDetailComponent } from './internment-detail/internment-detail.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
  { path: 'camas/internaciones', component: InternmentListComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'#INTR02401'}},
  { path: 'camas/internaciones/formulario', component: InternmentFormComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'#INTR02401',action:'ALTA'}},
	{ path: 'camas/internaciones/formulario/:id', component: InternmentFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'#INTR02401',action:'MODI'}},
  { path: 'camas/internaciones/detalle/:id', component: InternmentDetailComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'#INTR02401'}},
];

export const internmentRoutes = RouterModule.forRoot(routes);