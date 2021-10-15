import { ElementFilter } from '../+shared/dynamic-table/element-filter.model';
type BtnForColumn = { label: string, action: string, color: string, propHide?: string };

export interface IColumn {
    idProperty?: any,
    type?: any,
    header: string,
    property: string,
    searchProperty?: string;
    elementFilter?: ElementFilter,
    disableSorting?: boolean;
    btns?: Array<BtnForColumn>;
    propHideBtns?: string;
    width?: string;
    hideColumnBy?: string;
    defaultValue?: string;
    classes?: string;
    disabled?: boolean;
}