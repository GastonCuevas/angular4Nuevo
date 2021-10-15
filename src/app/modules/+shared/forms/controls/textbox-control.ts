import { ControlBase } from './control-base';

export class TextboxControl extends ControlBase<string> {
    constructor(options: any = {}) {
        super(options);
        this.type = options.type || 'text';
    }
}
