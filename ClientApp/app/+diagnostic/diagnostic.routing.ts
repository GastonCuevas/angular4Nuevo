import { RouterModule } from '@angular/router';
import { AuthGuard, RouteGuard } from './../+core/services';
import { Routes } from '../+shared/util';
import { DiagnosticListComponent } from './diagnostic-list/diagnostic-list.component';
import { DiagnosticFormComponent } from './diagnostic-form/diagnostic-form.component';
import { DiagnosticUploadComponent } from './diagnostic-upload-form/diagnostic-upload-form.component';
import { DiagnosticDetailComponent } from './diagnostic-detail/diagnostic-detail.component';

const routes: Routes = [
    { path: 'archivos/diagnosticos', component: DiagnosticListComponent, canActivate: [AuthGuard,RouteGuard], data: {code:'ABMDIAGNOS'} },
    { path: 'archivos/diagnosticos/formulario', component: DiagnosticFormComponent, canActivate: [AuthGuard,RouteGuard], data: {code:'ABMDIAGNOS', action:'ALTA'} },
    { path: 'archivos/diagnosticos/formulario/:id', component: DiagnosticFormComponent, canActivate: [AuthGuard,RouteGuard], data: {code:'ABMDIAGNOS', action:'MODI'} },
    { path: 'archivos/diagnosticos/formulario/upload/file', component: DiagnosticUploadComponent, canActivate: [AuthGuard,RouteGuard], data: {code:'ABMDIAGNOS', action:'ALTA'} },
    { path: 'archivos/diagnosticos/detalle/:id', component: DiagnosticDetailComponent, canActivate: [AuthGuard,RouteGuard], data: {code:'ABMDIAGNOS'} }
];

export const DiagnosticRoutes = RouterModule.forRoot(routes);