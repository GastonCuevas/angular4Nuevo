import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AuthGuard } from './+core/services/auth-guard.service';
import { ErrorComponent } from './+shared/error/error.component';



const routes: Routes = [
    { path: 'error', component: ErrorComponent },
    { path: '', redirectTo: '', pathMatch: 'full', canActivate:[AuthGuard] },
];

export const routing = RouterModule.forRoot(routes);
