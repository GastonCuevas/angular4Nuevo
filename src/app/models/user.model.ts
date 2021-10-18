import { UserPermissionGroup } from "./user-permission-group.model";

export class User {
  public number: number = 0;
  public login: string = '';
  public name: string = '';
  public enabled: boolean = true;
  public isRoot: boolean = false;
  public url: string = '';
  public email: string = '';
  public groups: Array<any> = [];
  public userPermissions: Array<UserPermissionGroup> = new Array<UserPermissionGroup>();

  public constructor() {
  }
}
