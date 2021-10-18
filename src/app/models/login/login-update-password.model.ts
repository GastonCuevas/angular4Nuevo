export class LoginUpdatePasswordModel {
  userNumber: number;
  password: string;
  // confirmPassword: string;

  constructor(userNumber: number = 0, password: string = '') {
    this.userNumber = userNumber;
    this.password = password;
  }
}
