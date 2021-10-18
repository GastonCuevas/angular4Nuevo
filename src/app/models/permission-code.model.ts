export class PermissionCodeModel {
  fatherCode: string;
  actionList: Array<any>;
  hiddenActions: boolean;

  constructor(fatherCode: string, actionList: Array<any>, hiddenActions: boolean = false) {
    this.fatherCode = fatherCode;
    this.actionList = actionList;
    this.hiddenActions = hiddenActions;
  }
}
