import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs/Observable';

import { UtilityService } from '../services';
import { PermissionService } from '../services/permission.service';
import { RouteData } from '../../+shared/util';
// import { RoutesList } from './routes-list';

@Injectable()
export class RouteGuard implements CanActivate {

    constructor(
        private permissionService: PermissionService,
        private utilityService: UtilityService
    ) {
        // this.authService.startupTokenRefresh()
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        /*
        * * when the user is root, he has permission to all the routes
        */
        const isRoot = this.permissionService.isRoot();
        if (isRoot) return true;

        return this.verifyPermissions(route);
    }

    private verifyPermissions(route: ActivatedRouteSnapshot): boolean {
        let data: RouteData = route.data;
        if (!data.code) {
            this.utilityService.navigateToError();
            return false;
        }

        if(data.dynamic) {
            const urlCode: string = route.params.codigo;
            if (urlCode) data = {code: urlCode};
        }

        let isAuth = false;
        if (data.code) isAuth = this.permissionService.hasPermission(data.code, data.action );
        if (!isAuth) this.utilityService.navigateToError();
        return isAuth;
    }

}
