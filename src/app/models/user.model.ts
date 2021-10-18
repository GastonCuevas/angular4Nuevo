import { UserPermissionGroup } from './user-permission-group.model';

export class User {
  public number: number;
  public login: string;
  public name: string;
  public enabled: boolean;
  public isRoot: boolean;
  public url: string;
  public email: string;
  public groups: Array<any>;
  public userPermissions: Array<UserPermissionGroup>;

  constructor(
    number: number = 0,
    login: string,
    name: string,
    enabled: boolean = true,
    isRoot: boolean = false,
    url: string,
    email: string,
    groups: Array<any> = [],
    userPermissions: Array<UserPermissionGroup> = new Array<UserPermissionGroup>()
  ) {
    this.number = number;
    this.login = login;
    this.name = name;
    this.enabled = enabled;
    this.isRoot = isRoot;
    this.url = url;
    this.email = email;
    this.groups = groups;
    this.userPermissions = userPermissions;
  }
}
