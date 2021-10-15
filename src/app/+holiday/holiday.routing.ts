import { RouterModule } from '@angular/router';
import { HolidayFormComponent } from './holiday-form/holiday-form.component';
import { HolidayListComponent } from './holiday-list/holiday-list.component';
import { AuthGuard } from '../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
    { path: 'archivos/feriados', component: HolidayListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMHOLIDAY'} },
    { path: 'archivos/feriados/formulario', component: HolidayFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMHOLIDAY',action:'ALTA'} },
    { path: 'archivos/feriados/formulario/:id', component: HolidayFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMHOLIDAY',action:'MODI'} },
];

export const holidayRoutes = RouterModule.forRoot(routes);