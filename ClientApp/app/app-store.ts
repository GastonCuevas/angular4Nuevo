import { ActionReducer, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { storeFreeze } from 'ngrx-store-freeze';
import { authReducer, AuthState } from './+core/auth/auth-store/auth.store';

export interface AppState {
    auth: AuthState;
}

const reducers = {
    auth: authReducer
};

const developmentReducer: ActionReducer<AppState> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<AppState> = combineReducers(reducers);

export function appReducer(state: any, action: any) {
    // if (process.env.ENV === 'Production') {
        return productionReducer(state, action);
    // } else {
    //     return developmentReducer(state, action);
    // }
}
