export class Configuration {
    codRam?: string;
    icon: Array<string>;
    label: string;

    constructor(codRam?: string, icon?: Array<string>, label?: string) {
        this.codRam = codRam;
        this.icon = icon ? icon : new Array<string>();
        this.label = label ? label : "";
    }
}