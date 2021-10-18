import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

export const LoggedInActionTypes = {
    LOGGED_IN: '[LoggedIn] True',
    NOT_LOGGED_IN: '[LoggedIn] False'
};

@Injectable()
export class LoggedInActions {
    public loggedIn(): Action {
        return {
            type: LoggedInActionTypes.LOGGED_IN
        };
    }
    public notLoggedIn(): Action {
        return {
            type: LoggedInActionTypes.NOT_LOGGED_IN
        };
    }
}
