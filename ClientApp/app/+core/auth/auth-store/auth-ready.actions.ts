import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

export const AuthReadyActionTypes = {
    READY: '[AuthReady] True'
};

@Injectable()
export class AuthReadyActions {
    public ready(): Action {
        return {
            type: AuthReadyActionTypes.READY
        };
    }
}
