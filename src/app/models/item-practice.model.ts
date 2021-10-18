import { AssignedPracticeType } from './assigned-practice-type.model';
import { ItemType } from './item-type.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export class ItemPractice {
  numint: number;
  name: string;
  type: number;
  description: string;
  bydefault: string;
  option: boolean;
  assignedPractices: Array<AssignedPracticeType>;
  order: number;
  table?: number;
  itemType: ItemType;

  constructor(
    numint: number = 0,
    name: string,
    type: number,
    description: string,
    bydefault: string,
    option: boolean,
    assignedPractices: Array<AssignedPracticeType> = new Array<AssignedPracticeType>(),
    order: number,
    table?: number,
    itemType: ItemType = new ItemType(0, '')
  ) {
    this.numint = numint;
    this.name = name;
    this.type = type;
    this.description = description;
    this.bydefault = bydefault;
    this.option = option;
    this.order = order;
    this.table = table;
    this.itemType = itemType;
    this.assignedPractices = assignedPractices;
  }
}
