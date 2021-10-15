import { HcTableItem } from "./hc-table-item.model";

export class HcTable {
    number: number;
    name: string;
    description: string;
    hcTableItems: Array<HcTableItem> = new Array<HcTableItem>();

    constructor(){
    }
}