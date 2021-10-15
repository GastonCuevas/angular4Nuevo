import { AuthGuard } from './../+core/services/auth-guard.service';
import { RouterModule } from '@angular/router';
import { ConceptListComponent } from './concept-list/concept-list.component';
import { ConceptFormComponent } from './concept-form/concept-form.component';
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
    { path: 'sisarchivos/conceptos', component: ConceptListComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMCONCEPT'} },
    { path: 'sisarchivos/conceptos/formulario', component: ConceptFormComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMCONCEPT',action:'ALTA'} },
    { path: 'sisarchivos/conceptos/formulario/:id', component: ConceptFormComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMCONCEPT',action:'MODI'} }
];

export const ConceptRoutes = RouterModule.forRoot(routes);