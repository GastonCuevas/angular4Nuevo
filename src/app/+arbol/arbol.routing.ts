
import { AuthGuard } from '../+core/services/auth-guard.service';
import { RouterModule } from '@angular/router';
import { ArbolListComponent } from './arbol-list/arbol-list.component';
import { ArbolFormComponent } from './arbol-form/arbol-form.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';
const routes: Routes = [
  { path: "sisarchivos/arbol", component: ArbolListComponent, canActivate: [AuthGuard,RouteGuard]},
  { path: "sisarchivos/arbol/formulario", component: ArbolFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMARBOL',action:'ALTA'} },
];

export const ArbolRoutes = RouterModule.forRoot(routes);