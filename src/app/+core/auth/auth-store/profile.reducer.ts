import { Action } from '@ngrx/store';
import { ProfileModel } from '../models/profile-model';
import { ProfileActionTypes } from './profile.actions';

const initialState: ProfileModel = {
    aud: null,
    exp: null,
    given_name: null,
    iat: null,
    iss: null,
    jti: null,
    nameid: null,
    nfb: null,
    sub: null,
};

export function profileReducer(state = initialState, action: Action): ProfileModel {
    switch (action.type) {
        case ProfileActionTypes.LOAD:
            return action.payload;

        case ProfileActionTypes.DELETE:
            return initialState;

        default:
            return state;
    }
}
