import { UserPermissionAction } from "./user-permission-action.model";

export class UserPermissionGroup {
  userId: number;
  useCase: string;
  name?: string;
  enabled?: boolean;
  operationState?: number;
  hiddenActions?: boolean;
  actions: Array<UserPermissionAction>;

  constructor(userId: number, useCase: string, name?: string, enabled?: boolean, operationState?: number, hiddenActions?: boolean) {
    this.userId = userId;
    this.useCase = useCase;
    this.name = name;
    this.enabled = enabled;
    this.operationState = operationState;
    this.hiddenActions = hiddenActions;
    this.actions = new Array<UserPermissionAction>();
  }
}
