import { RouterModule } from '@angular/router';
import { AuthGuard } from './../+core/services/auth-guard.service';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
    { path: 'administrador/usuarios', component: UserListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMUSUARIO'} },
    { path: 'administrador/usuarios/formulario', component: UserFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMUSUARIO',action:'ALTA'} },
    { path: 'administrador/usuarios/formulario/:id', component: UserFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMUSUARIO',action:'MODI'} },
    { path: 'administrador/usuarios/detalle/:id', component: UserDetailComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMUSUARIO'} }
];

export const UserRoutes = RouterModule.forRoot(routes);
