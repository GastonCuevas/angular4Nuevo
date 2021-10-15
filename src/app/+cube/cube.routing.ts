import { AuthGuard } from './../+core/services/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { CubeAnalysisComponent } from './cube-analysis/cube-analysis.component';
import { CubeFormComponent } from './cube-form/cube-form.component';
import { RouteGuard } from '../+core/guard/route-guard.service';



const routes: Routes = [
    { path: 'archivos/cubo', component: CubeFormComponent, canActivate: [AuthGuard, RouteGuard], data: { code: 'ACUBO' } },
    { path: 'archivos/cubo-analisis/:code', component: CubeAnalysisComponent, canActivate: [AuthGuard, RouteGuard], data: { code: 'ACUBO' } },
];

export const CubeRoutes = RouterModule.forRoot(routes);