import { AssignedPracticeType } from "./assigned-practice-type.model";
import { ItemType } from "./item-type.model";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

export class ItemPractice {
    numint: number = 0;
    name: string;
    type: number;
    table?: number;
    description: string;
    bydefault: string;
    option: boolean;
    itemType?: ItemType = new ItemType();
    assignedPractices = new Array<AssignedPracticeType>();
    order: number;
}