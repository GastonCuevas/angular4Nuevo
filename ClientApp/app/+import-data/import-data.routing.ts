import { RouterModule } from '@angular/router';
import { ImportDataFormComponent } from './import-data-form/import-data-form.component';
import { ImportDataListComponent } from './import-data-list/import-data-list.component';
import { ImportDataFieldFormComponent } from './import-data-field-form/import-data-field-form.component';
import { AuthGuard } from '../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
  { path: 'sistema/importData', component: ImportDataListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMIMPORT'} },
  { path: 'sistema/importData/formulario', component: ImportDataFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMIMPORT',action:'ALTA'} },
  { path: 'sistema/importData/formulario/:id', component: ImportDataFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMIMPORT',action:'MODI'} },
  { path: 'sistema/importData/formulario/:id/:table', component: ImportDataFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMIMPORT',action:'MODI'} },
  { path: 'sistema/importData/formulario/:id/field', component: ImportDataFieldFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMIMPORT',action:'MODI'} },
  { path: 'sistema/importData/formulario/:id/field/:fieldid', component: ImportDataFieldFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMIMPORT',action:'MODI'} }
];

export const importDataRoutes = RouterModule.forRoot(routes);