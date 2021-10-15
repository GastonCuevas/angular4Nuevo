import { LoginRouteGuard } from './login-route-guard.service';
import { CanActivate } from '@angular/router';
import { Routes, RouterModule } from '@angular/router';
    
import { LoginFormComponent } from './login-form/login-form.component';

const routes:  Routes = [
    { path: 'login', component: LoginFormComponent, canActivate:[LoginRouteGuard]}
];

export const loginRoutes = RouterModule.forRoot(routes);