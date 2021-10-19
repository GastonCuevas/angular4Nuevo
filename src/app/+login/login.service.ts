import { LoginUpdatePasswordModel } from './../models/login/login-update-password.model';
import { Injectable } from '@angular/core';
// import { AuthTokenService } from '../+core/auth/auth-token.service';
// import { UtilityService, StorageService, RequestService } from '../+core/services/index';
import { LoginModel } from '../models/login/login-model';
import { LoginResponseModel } from '../models/login/login-response-model';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class LoginService {
  baseUrl = '/api/user';
  response = new Subject<LoginResponseModel | null>();

  constructor() // private requestService: RequestService = new ,
  // private authTokens: AuthTokenService,
  // private utilityService: UtilityService,
  // private storageService: StorageService
  {}

  login(loginModel: LoginModel) {
    // return this.requestService.post(`${this.baseUrl}/login`, loginModel)
    //     .map(response => {
    //         this.response.next(response);
    //     });
  }

  updatePassword(
    loginUpdatePasswordModel: LoginUpdatePasswordModel,
    token: string
  ) {
    // const headers = {
    //     Authorization: `Bearer ${token}`
    // };
    // return this.requestService.post(`${this.baseUrl}/updatePassword`, loginUpdatePasswordModel, null, headers);
  }

  refreshToken() {
    // return this.requestService.get(`${this.baseUrl}/refreshToken`)
    //     .map(response => {
    //         this.response.next(response);
    //     });
  }

  logout(userId: number) {
    // return this.requestService.post(`${this.baseUrl}/logout`, userId)
    //     .map(response => {
    //         this.response.next(null);
    //         this.authTokens.deleteTokens();
    //         this.utilityService.navigateToLogin();
    // });
  }
}
