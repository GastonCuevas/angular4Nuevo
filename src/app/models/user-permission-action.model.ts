export class UserPermissionAction {
  code: string;
  name: string;
  enabled: boolean;
  fatherCode: string;

  constructor(
    code: string,
    name: string,
    enabled: boolean,
    fatherCode: string
  ) {
    this.code = code;
    this.name = name;
    this.enabled = enabled;
    this.fatherCode = fatherCode;
  }
}
