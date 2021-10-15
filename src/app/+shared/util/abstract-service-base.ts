import { GenericControl } from "../";
import { IColumn } from "./";

export abstract class AbstractServiceBase {

    columns: IColumn[];
    controlsToFilter: GenericControl[];
    [name: string]: any
}