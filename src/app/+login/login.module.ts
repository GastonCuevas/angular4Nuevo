import { NgModule } from '@angular/core';

//import { AppModuleShared } from '../+shared/index';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginRoutingModule } from './login.routing';
import { LoginService } from './login.service';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    //   AppModuleShared,
    LoginRoutingModule,
  ],
  providers: [LoginService],
})
export class LoginModule {}
