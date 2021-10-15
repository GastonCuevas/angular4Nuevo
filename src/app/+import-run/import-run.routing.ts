import { RouterModule } from '@angular/router';
import { ImportRunFormComponent } from './import-run-form/import-run-form.component';
import { AuthGuard } from '../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
  { path: 'sistema/importRun', component: ImportRunFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'RUNIMPORT'} },
];

export const importRunRoutes = RouterModule.forRoot(routes);