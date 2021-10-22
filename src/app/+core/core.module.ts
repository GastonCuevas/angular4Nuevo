import { Route } from '@angular/compiler/src/core';
import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders,
} from '@angular/core';

// import { AuthTokenService } from './auth/auth-token.service';
// import { LoggedInActions } from './auth/auth-store/logged-in.actions';
// import { ProfileActions } from './auth/auth-store/profile.actions';
// import { AuthTokenActions } from './auth/auth-store/auth-token.actions';
// import { AuthReadyActions } from './auth/auth-store/auth-ready.actions';
import { UtilityService } from './services/utility.service';
import { StorageService } from './services/storage.service';
// import { AuthGuard } from './services/auth-guard.service';
import { LoginRouteGuard } from './../+login/login-route-guard.service';
import { RequestService } from './services/request.service';
// import { ToastyMessageService } from './services/toasty-message.service';
// import { CommonService } from './services/common.service';
// import { LoadingGlobalService } from './services/loading-global.service';
// import { ErrorHandler } from '@angular/core';
// import { AppErrorHandlerService } from './services/app-error-handler.service';
// import { LookAndFeelService } from './services/look-and-feel.service';
// import { PermissionService } from './services/permission.service';

@NgModule({
  imports: [],
  exports: [],
  providers: [],
})
export class CoreModule {
  // forRoot allows to override providers
  // https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-for-root
  public static forRoot(): ModuleWithProviders<Route> {
    return {
      ngModule: CoreModule,
      providers: [LoginRouteGuard, RequestService],
    };
  }
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
