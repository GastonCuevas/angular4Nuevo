import { AuthGuard } from './../+core/services/auth-guard.service';
import { RouterModule } from "@angular/router";
import { LookAndFeelListComponent } from "./look-and-feel-list/look-and-feel-list.component";
import { LookAndFeelFormComponent } from "./look-and-feel-form/look-and-feel-form.component";
import { RouteGuard } from '../+core/guard/route-guard.service';
import { Routes } from '../+shared/util/router';

const routes: Routes = [
    { path: "sisarchivos/lookandfeel", component: LookAndFeelListComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMCONFLAF'} },
    { path: "sisarchivos/lookandfeel/formulario", component: LookAndFeelFormComponent, canActivate: [AuthGuard,RouteGuard],data:{code:'ABMCONFLAF',action:'ALTA'} },
    { path: "sisarchivos/lookandfeel/formulario/:companyNumber/:code", component: LookAndFeelFormComponent, canActivate: [AuthGuard, RouteGuard],data:{code:'ABMCONFLAF',action:'MODI'} },
];

export const LookAndFeelRoutes = RouterModule.forRoot(routes)