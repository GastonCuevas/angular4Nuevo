import { ControlBase } from "./control-base";

export type DropdownOptionType = Array<{ key: string, value: string }> | void;

export class ControlDropdown extends ControlBase<string> {
    public options: DropdownOptionType = [];

    constructor(options: any = {}) {
        super(options);
        if(options.source){
            options.source
                .subscribe((opt: Array<any>) => {
                    this.options = opt
                })
        }else{
            this.options = options.options || [];
        }
    }
}
