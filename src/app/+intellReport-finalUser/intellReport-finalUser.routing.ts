import { AuthGuard } from './../+core/services/auth-guard.service';
import { RouterModule } from '@angular/router';
import { IntellReportFinalUserFormComponent } from './intell-report-final-user-form/intell-report-final-user-form.component';
import { IntellReportViewHTMLComponent } from './intell-report-viewHTML/intell-report-viewHTML.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';



const routes: Routes = [
    { path: 'administradorArchivos/intellReport', component: IntellReportFinalUserFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'INTELLIREP'} },
    { path: 'administradorArchivos/intellReport/:code', component: IntellReportFinalUserFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'INTELLIREP'} },
    { path: 'administradorArchivos/intellReport/:code/:tableName', component: IntellReportFinalUserFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'INTELLIREP'} },
    { path: 'administradorArchivos/intellReport/vistaprevia/:id', component: IntellReportViewHTMLComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'INTELLIREP'} }
];

export const intellReportRoutes = RouterModule.forRoot(routes);