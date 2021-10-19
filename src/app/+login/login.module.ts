import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LookAndFeelService } from '../+core/services/look-and-feel.service';

//import { AppModuleShared } from '../+shared/index';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginRoutingModule } from './login.routing';
import { LoginService } from './login.service';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    //   AppModuleShared,
    CommonModule,
    LoginRoutingModule,
  ],
  providers: [LoginService, LookAndFeelService],
})
export class LoginModule {}
