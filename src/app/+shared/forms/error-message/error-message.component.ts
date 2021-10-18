import { Component, Input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

import { ControlBase } from '../';
import { ValidationService } from './../validation.service';

@Component({
    selector: 'app-control-error-message',
    template: `<span *ngIf="!showCustomMsg" [hidden]="!errorMessage" class="msg-error-input">{{ errorMessage }}</span>
                <span *ngIf="showCustomMsg" class="msg-error-input">{{ message }}</span>`,
	// styles: [':host { position: absolute; }']
})
export class ErrorMessageComponent {
    @Input() public control: ControlBase<any>;
	@Input() public form: FormGroupDirective;
    @Input() public show: boolean = false;
    @Input() public showCustomMsg: boolean = false;
	@Input() public message: string;

	get errorMessage() {
		if (this.show) return this.message || "Requerido.";
		if (!this.form || !this.control) return undefined;
        const c: any = this.form.form.get(this.control.key);
        if (!c) {
            console.log('key -> ', this.control.key, ' not found in form');
            return '';
        }
        for (const propertyName in c.errors) {
            if (c.errors.hasOwnProperty(propertyName)) {
                if(this.control.type != undefined && this.control.type === 'email' ) {
                    return ValidationService.getValidatorErrorMessage('email', this.control.minlength || this.control.maxlength);
                }
                if(propertyName == 'max' || propertyName == 'min') {
                    return ValidationService.getValidatorErrorMsg(propertyName, c.errors[propertyName]);
                }
                return ValidationService.getValidatorErrorMessage(propertyName, this.control.minlength || this.control.maxlength);
            }
        }
        return undefined;
    }
}
