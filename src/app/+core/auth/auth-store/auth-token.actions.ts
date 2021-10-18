import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { AuthTokenModel } from '../models/auth-tokens-model';

export const AuthTokenActionTypes = {
    LOAD: '[AuthToken] Load',
    DELETE: '[AuthToken] Delete'
};

@Injectable()
export class AuthTokenActions {
    public delete(): Action {
        return {
            type: AuthTokenActionTypes.DELETE
        };
    }
    public load(payload: AuthTokenModel): Action {
        return {
            type: AuthTokenActionTypes.LOAD,
            payload
        };
    }
}
