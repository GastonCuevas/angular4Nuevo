import { LoggedInActionTypes } from './logged-in.actions';
import { Action } from '@ngrx/store';

const initalState = false;

export const loggedInReducer = (state :any, action: Action): boolean => {
    switch (action.type) {
        case LoggedInActionTypes.LOGGED_IN:
            return true;

        case LoggedInActionTypes.NOT_LOGGED_IN:
            return false;

        default:
            return state;
    }
};
