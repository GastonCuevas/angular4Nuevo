import { NgModule } from '@angular/core';

import { AppModuleShared } from './../app.module.shared';
import { LoginFormComponent } from './login-form/login-form.component';
import { loginRoutes } from './login.routing';
import { LoginService } from './login.service';

@NgModule({
    declarations: [LoginFormComponent],
    imports: [
        AppModuleShared,
        loginRoutes
	],
	providers: [
		LoginService
	]
})
export class LoginModule{}