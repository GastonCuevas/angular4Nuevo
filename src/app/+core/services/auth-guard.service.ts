import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppState } from './../../app-store';
import { UtilityService } from './utility.service';
import { AuthTokenService } from '../auth/auth-token.service';
import { isListLikeIterable } from '@angular/core/src/change_detection/change_detection_util';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private utilityService: UtilityService,
        private authService: AuthTokenService
    ) {
        // this.authService.startupTokenRefresh()
    }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        let isLogged = false
        this.store.select(state => state).subscribe(appState => isLogged = appState.auth.loggedIn )
        if (!isLogged){
            this.utilityService.navigateToLogin()
        }
        return isLogged;
    }
}
