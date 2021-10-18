import { AuthTokenModel } from '../../+core/auth/models/auth-tokens-model';
import { LoginResult } from '../../models/login/LoginResult.model';

export class LoginResponseModel {
  number: number;
  userName: string;
  name: string;
  isRoot: boolean;
  token: AuthTokenModel;
  status: LoginResult;

  constructor(
    number: number,
    userName: string,
    name: string,
    isRoot: boolean,
    token: AuthTokenModel,
    status: LoginResult
  ) {
    this.number = number;
    this.userName = userName;
    this.name = name;
    this.isRoot = isRoot;
    this.token = token;
    this.status = status;
  }
}
