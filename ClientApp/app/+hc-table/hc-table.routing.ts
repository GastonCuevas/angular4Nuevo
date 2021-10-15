import { AuthGuard } from "../+core/services/auth-guard.service";
import { RouterModule } from "@angular/router";
import { HcTableListComponent } from "./hc-table-list/hc-table-list.component";
import { HcTableFormComponent } from "./hc-table-form/hc-table-form.component";
import { HcTableItemFormComponent } from "./hc-table-item-form/hc-table-item-form.component";
import { RouteGuard } from "../+core/guard/route-guard.service";
import { Routes } from '../+shared/util/router';
const routes: Routes = [
    { path: "archivos/tablasHc", component: HcTableListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMHCTAB'} },
    { path: "archivos/tablasHc/formulario", component: HcTableFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMHCTAB',action:'ALTA'} },
    { path: "archivos/tablasHc/formulario/:id", component: HcTableFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMHCTAB',action:'MODI'} },
    { path: "archivos/tablasHc/formulario/:id/item", component: HcTableItemFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMHCTAB',action:'MODI'} },
    { path: "archivos/tablasHc/formulario/:id/item/:itemId", component: HcTableItemFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMHCTAB',action:'MODI'} }
];

export const hcTableRoutes = RouterModule.forRoot(routes)