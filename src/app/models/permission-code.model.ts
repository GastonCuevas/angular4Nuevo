export class PermissionCodeModel {
  fatherCode: string;
  actionList: Array<any>;
  hiddenActions: boolean = false;

  constructor(
    fatherCode: string,
    actionList: Array<any>,
    hiddenActions: boolean
  ) {
    this.fatherCode = fatherCode;
    this.actionList = actionList;
    this.hiddenActions = hiddenActions;
  }
}
