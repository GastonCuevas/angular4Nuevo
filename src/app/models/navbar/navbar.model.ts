import { Item } from "./item.model";
import { Configuration } from "./configuration.model";
import { Children } from "./children.model";

export class Navbar {
    children: Array<Navbar>;
    code: string;
    configuration: Configuration;
    name: string;
    leaves: Array<Item>;
    order: number;

    constructor(
        children: Array<any>,
        code: string,
        configuration: Configuration,
        name: string,
        leaves: Array<Item>,
        order: number
    ) {
        this.children = children || new Array<any>();
        this.code = code || '';
        this.configuration = configuration || new Configuration();
        this.name = name || '';
        this.order = order;
        this.leaves = leaves || new Array<Item>();
    }
}