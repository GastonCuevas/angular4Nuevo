export class ActionUseCase {
    userId?: number;
    useCase?: string;
    name?: string;
    enabled?: boolean;
    hiddenActions?: boolean;
    actions: Array<any>;

    constructor(useCase?: string, name?: string, enabled?: boolean, hiddenActions?: boolean) {
        this.useCase = useCase;
        this.name = name;
        this.enabled = enabled;
        this.hiddenActions = hiddenActions;
        this.actions = new Array<any>();
    }
}