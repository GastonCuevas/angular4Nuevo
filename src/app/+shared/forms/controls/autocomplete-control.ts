import { ControlBase } from "./control-base";

type DropdownOptionType = Array<{ key: string, value: string }> | void;

export class AutocompleteControl extends ControlBase<string> {
    public options: DropdownOptionType = [];
    public functionForData: any;

    constructor(options: any = {}) {
        super(options);
        if(options.source){
            this.functionForData = options.source;
        }else{
            this.options = options.options || [];
        }
    }
}
