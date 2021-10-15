import { Route } from "@angular/router";

type ActionRouteType = 'ALTA' | 'MODI' | 'ELIM' | 'IMPR';
type RouteDataWithRequired = {code: string, action?: ActionRouteType, dynamic?: boolean};
interface CustomRoute  extends Route {
    data?: RouteDataWithRequired;
}

export type Routes = CustomRoute[];
export type RouteData = {code?: string, action?: ActionRouteType, dynamic?: boolean, [name: string]: any};
