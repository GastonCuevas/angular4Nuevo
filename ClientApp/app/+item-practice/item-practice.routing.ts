import { AuthGuard } from "../+core/services/auth-guard.service";
import { RouterModule } from "@angular/router";

import { ItemPracticeListComponent } from "./item-practice-list/item-practice-list.component";
import { ItemPracticeFormComponent } from "./item-practice-form/item-practice-form.component";
import { RouteGuard } from "../+core/guard/route-guard.service";
import { Routes } from '../+shared/util/router';
const routes: Routes = [
    { path: "archivos/practicasItems", component: ItemPracticeListComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMPRAITEM'} },
    { path: "archivos/practicasItems/formulario", component: ItemPracticeFormComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMPRAITEM', action:'ALTA'} },
    { path: "archivos/practicasItems/formulario/:id", component: ItemPracticeFormComponent, canActivate: [AuthGuard,RouteGuard], data:{code:'ABMPRAITEM', action:'MODI'} }
];

export const itemPracticeRoutes = RouterModule.forRoot(routes)