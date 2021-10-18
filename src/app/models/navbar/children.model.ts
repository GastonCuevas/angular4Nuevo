import { Configuration } from "./configuration.model";
import { Item } from "./item.model";

export class Children {
    configuration: Configuration;
    items: Array<Item>;
    name: string;
    orden: number;

    constructor(
        configuration?: Configuration,
        items?: Array<Item>,
        name?: string,
        orden?: number, ) {
        this.configuration = configuration || new Configuration();
        this.items = items || new Array<Item>();
        this.name = name || "";
        this.orden = orden || NaN;
    }
}
