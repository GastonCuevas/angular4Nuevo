import { Component, OnInit } from '@angular/core';
import { ValidatorFn } from '@angular/forms';

import { LoginService } from './../login.service';
import { ControlBase, TextboxControl, ValidationService } from '../../+shared';
import { LoginModel } from '../../models/login/login-model';
import { LoginResult } from '../../models/login/LoginResult.model';
import { LoginUpdatePasswordModel } from '../../models/login/login-update-password.model';
import { UtilityService, ToastyMessageService, LookAndFeelService } from '../../+core/services';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

    loginControls: Array<ControlBase<any>>;
    updatePasswordControls: Array<ControlBase<any>>;
    requiredUpdatePassword = false;
    errorMessageForm: string;
    updatePasswordModel = new LoginUpdatePasswordModel();
    mathPasswordValidator: ValidatorFn = ValidationService.matchPasswordValidator;
    isloading = false;
    token: string;
    logo = 'images/navbar-logo.png';

    constructor(
        private loginService: LoginService,
        private utilityService: UtilityService,
        private toastService: ToastyMessageService,
        public look: LookAndFeelService
    ) { }

    ngOnInit() {
        this.createLoginForm();
        this.createConfirmForm();
    }

    createLoginForm() {
        const controls: Array<ControlBase<any>> = [
            new TextboxControl({
                key: 'userName',
                label: 'Usuario',
                order: 1,
                required: true,
                type: 'text',
            }),

            new TextboxControl({
                key: 'password',
                label: 'Contraseña',
                order: 2,
                required: true,
                type: 'password',
            })
        ];
        this.loginControls = controls;
    }

    createConfirmForm() {
        const controls: Array<ControlBase<any>> = [
            new TextboxControl({
                key: 'password',
                label: 'Contraseña',
                order: 1,
                required: true,
                type: 'password'
            }),

            new TextboxControl({
                key: 'confirmPassword',
                label: 'Confirmar Contraseña',
                order: 2,
                required: true,
                type: 'password'
            })
        ];
        this.updatePasswordControls = controls;
    }

    onLogin(loginModel: LoginModel): void {
        this.isloading = true;
        this.loginService.login(loginModel)
            .finally(() => this.isloading = false)
            .subscribe(
            response => {
                this.utilityService.navigateToHome();
            },
            error => {
                this.errorMessageForm = '';
                switch (error.status) {
                    case LoginResult.LoginFirstTime:
                        this.token = error.token.access_token;
                        this.requiredUpdatePassword = true;
                        this.updatePasswordModel.userNumber = error.number;
                        break;
                    case LoginResult.NotInputUserAndPass:
                        this.errorMessageForm = 'Ingrese Usuario y Contraseña';
                        break;
                    case LoginResult.UserWithOutPermission:
                        this.errorMessageForm = 'Usuario sin permisos';
                        break;
                    case LoginResult.InvalidUser:
                        this.errorMessageForm = 'Usuario incorrecto';
                        break;
                    case LoginResult.InvalidPassword:
                        this.errorMessageForm = 'Contraseña incorrecta';
                        break;
                    case LoginResult.LoginDisabled:
                        this.errorMessageForm = 'Usuario deshabilitado';
                        break;
                    default:
                        this.toastService.showMessageToast('Error', 'Ocurrio un error desconocido', 'error', 5000);
                        break;
                }
            });
    }

    onUpdatePassword(model: LoginUpdatePasswordModel) {
        this.isloading = true;
        this.updatePasswordModel.password = model.password;
        this.loginService.updatePassword(this.updatePasswordModel, this.token)
            .finally(() => this.isloading = false)
            .subscribe((response: any) => {
                this.utilityService.navigateToLogin();
            },
            error => {
                this.toastService.showMessageToast('Error', 'Ocurrio un error desconocido', 'error', 5000);
            });
    }
}
