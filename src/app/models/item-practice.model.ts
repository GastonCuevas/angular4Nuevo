import { AssignedPracticeType } from "./assigned-practice-type.model";
import { ItemType } from "./item-type.model";

export class ItemPractice {
  numint: number;
  name: string;
  type: number;
  table?: number;
  description: string;
  bydefault: string;
  option: boolean;
  itemType: ItemType;
  assignedPractices: Array<AssignedPracticeType>;
  order: number;

  constructor(
    numint: number = 0,
    name: string,
    type: number,
    description: string,
    bydefault: string,
    option: boolean,
    order: number,
    assignedPractices: Array<AssignedPracticeType> = new Array<AssignedPracticeType>(),
    itemType: ItemType = new ItemType(0, ''),
    table?: number
  ) {
    this.numint = numint;
    this.name = name;
    this.type = type;
    this.table = table;
    this.description = description;
    this.bydefault = bydefault;
    this.option = option;
    this.itemType = itemType;
    this.order = order;
    this.assignedPractices = assignedPractices;
  }
}
