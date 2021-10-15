import { CanActivate } from '@angular/router';
import { Routes, RouterModule } from '@angular/router';
    
import { LoginFormComponent } from './login-form/login-form.component';

const routes:  Routes = [
    { path: 'login', component: LoginFormComponent }
];

export const loginRoutes = RouterModule.forRoot(routes);