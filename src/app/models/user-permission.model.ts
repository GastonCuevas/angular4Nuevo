export class UserPermission {
    userNumber?: number;
    useCaseNumber?: string;
    description?: string;
    enabled?: boolean;
    operationState?: number;

    constructor(userNumber?: number, useCaseNumber?: string, description?: string, enabled?: boolean, operationState?: number) {
        this.userNumber = userNumber;
        this.useCaseNumber = useCaseNumber;
        this.description = description;
        this.enabled = enabled;
        this.operationState = operationState;
    }
}