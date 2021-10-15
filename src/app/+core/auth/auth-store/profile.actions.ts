import { Action } from '@ngrx/store';
import { ProfileModel } from '../models/profile-model';
import { Injectable } from '@angular/core';

export const ProfileActionTypes = {
    LOAD: '[Profile] Load',
    DELETE: '[Profile] Delete'
};

@Injectable()
export class ProfileActions {
    public load(payload: ProfileModel): Action {
        return {
            type: ProfileActionTypes.LOAD,
            payload
        };
    }
    public delete(): Action {
        return {
            type: ProfileActionTypes.DELETE
        };
    }
}
