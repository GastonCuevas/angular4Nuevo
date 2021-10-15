import { AbstractControl, FormControl } from "@angular/forms";

export class ValidationService {

    public static emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";

    public static getValidatorErrorMessage(code: string, fieldLength: number | undefined) {
        const config: any = {
            required: 'Requerido.',
            minlength: 'La longitud mínima es de ' + fieldLength,
            maxlength: 'La longitud maxima es de ' + fieldLength,
            email: 'Dirección de email Inválido',
            invalidPassword: 'La contraseña debe tener al menos 6 caracteres y contener un número.',
            MatchPassword: 'Las contraseñas no coinciden.',
            invalidNumber: 'Formato de número incorrecto',
			pattern: 'Formato Inválido',
            duplicate: 'Ya existe este valor',
        };
        return config[code];
    }

    static getValidatorErrorMsg(code: string, errorDetail: any) {
        const config: any = {
            required: 'Requerido.',
            // minlength: 'La longitud mínima es de ' + fieldLength,
            // maxlength: 'La longitud maxima es de ' + fieldLength,
            email: 'Dirección de email Inválido',
            invalidPassword: 'La contraseña debe tener al menos 6 caracteres y contener un número.',
            MatchPassword: 'Las contraseñas no coinciden.',
            invalidNumber: 'Formato de número incorrecto',
			pattern: 'Formato Inválido',
            duplicate: 'Ya existe este valor',
            min: `El valor debe ser mayor que ${errorDetail[code]}`,
            max: `El valor debe ser menor que ${errorDetail[code]}`,
        };
        return config[code];
    }

    public static emailValidator(control: any) {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return undefined;
        } else {
            return { invalidEmailAddress: true };
        }
    }

    public static passwordValidator(control: any): any {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!"@#$%^&*]{6,100}$/)) {
            return undefined;
        } else {
            return { invalidPassword: true };
        }
    }

    public static matchPasswordValidator(AC: AbstractControl): any {
        let password = AC.get('password')!.value;
        let confirmPassword = AC.get('confirmPassword')!.value;

        if (password != confirmPassword) {
            AC.get('confirmPassword')!.setErrors({ MatchPassword: true })
            return { MatchPassword: true };
        } else {
            AC.get('confirmPassword')!.setErrors(null);
            return  undefined;
        }
    }

    public static numberValidator(control: AbstractControl): any {
        if(control.value)
            return control.value.toString().match(/^[0-9]+(\.[0-9]{1,2})?$/) ? undefined : { invalidNumber: true };

    }
}