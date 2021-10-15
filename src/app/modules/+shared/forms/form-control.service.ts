import { Injectable } from "@angular/core";
import { Validators, FormControl, FormGroup } from '@angular/forms';

import { ControlBase, GenericControl } from './controls';
import { ValidatorFn } from "@angular/forms/src/directives/validators";


@Injectable()
export class FormControlService {

    public toControlGroup(controls: Array<ControlBase<any>>, validatorFn?: ValidatorFn) {
        const group: any = {};

        controls.forEach(control => {
            const validators: any = [];
            // Required
            if (control.required) {
                validators.push(Validators.required);
            }
            // Minlength
            if (control.minlength) {
                validators.push(Validators.minLength(control.minlength));
            }
            // Maxlength
            if (control.maxlength) {
                validators.push(Validators.maxLength(control.maxlength));
            }

            group[control.key] = new FormControl(control.value, validators);
        });

        return new FormGroup(group,validatorFn);
    }

    toFormGroup(controls: Array<GenericControl>): FormGroup {
        let group: any = {};

        controls.forEach(control => {
            const validators: any = [];
            // Required
            if (control.required) validators.push(Validators.required);
            // Minlength
            if (control.minlength) validators.push(Validators.minLength(control.minlength));
            // Maxlength
            if (control.maxlength) validators.push(Validators.maxLength(control.maxlength));

            group[control.key] = new FormControl(control.value, validators);
        });
        return new FormGroup(group);
    }

}