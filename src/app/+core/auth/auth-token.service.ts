import { ProfileActions } from './auth-store/profile.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { JwtHelper } from 'angular2-jwt';

import { AppState } from './../../app-store';
import { ProfileModel } from './models/profile-model';
import { LoginResponseModel } from '../../models/login/login-response-model';
import { AuthTokenModel } from './models/auth-tokens-model';
import { AuthTokenActions } from './auth-store/auth-token.actions';
import { LoggedInActions } from './auth-store/logged-in.actions';
import { AuthReadyActions } from './auth-store/auth-ready.actions';
import { StorageService } from '../services/storage.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenService {
    baseUrl = 'api/user';
    jwtHelper = new JwtHelper();

    constructor(
        private store: Store<AppState>,
        private authTokenActions: AuthTokenActions,
        private loggedInActions: LoggedInActions,
        private profileActions: ProfileActions,
        private authReadyActions: AuthReadyActions,
        private storageService: StorageService
    ) { }

    setTokens(response: LoginResponseModel) {
        console.log('setTokens ->', response);
        const now = new Date();
        const expirationDate = new Date(response.token.expiration_date!);
        console.log('now -> ', now.toLocaleString());
        console.log('expirationDate -> ', expirationDate.toLocaleString());
        this.setTokensDone(response.token);
        this.storageService.setItem('isRoot', response.isRoot);
        this.storageService.setItem('auth-tokens', response.token);
    }

    deleteTokens() {
        this.store.dispatch(this.profileActions.delete());
        this.store.dispatch(this.authTokenActions.delete());
        this.store.dispatch(this.loggedInActions.notLoggedIn());
        sessionStorage.clear();
        this.storageService.clear();
    }

    startupTokenRefresh() {
        const token: AuthTokenModel = this.storageService.getItem('auth-tokens');
        if (!token) return null;
        console.log('startupTokenRefresh');
        this.setTokensDone(token);
        return this.getTokenExpireTime(token);
    }

    getTokenExpireTime(token: AuthTokenModel): Observable<number> | null {
        console.log('getTokenExpireTime');
        const now = new Date();
        const expirationDate = new Date(token.expiration_date!);
        console.log('now -> ', now.toLocaleString());
        console.log('expirationDate -> ', expirationDate.toLocaleString());
        const expiresIn = expirationDate.getTime() - now.getTime();
        console.log('expires in -> ', expiresIn);
        console.log('interval -> ', token.expires_in! - 60);
        if (expiresIn <= 0) return null;
        const dueTime = Math.max(expiresIn - 60000, 0);
        now.setMilliseconds(dueTime);
        console.log('call in ->', now.toLocaleString());
        setInterval(() => { var d = new Date(); console.log('interval set ', d.toLocaleString()) }, 120 * 1000);
        return Observable.timer(dueTime, (token.expires_in! - 60) * 1000);
    }

    private setTokensDone(token: AuthTokenModel) {
        const profile: ProfileModel = this.jwtHelper.decodeToken(token.access_token || '');
        this.store.dispatch(this.profileActions.load(profile));
        this.store.dispatch(this.authTokenActions.load(token));
        this.store.dispatch(this.loggedInActions.loggedIn());
        this.store.dispatch(this.authReadyActions.ready());
    }
}
