type DataType = 'text' | 'number' | 'date' | 'button' | 'checkbox' | 'custom';
type FilterType = 'name' | 'text' | 'number' | 'select' | 'autocomplete' | 'date' | 'custom';
type BtnForColumn = { label: string, action: string, color: string, propHide?: string, tooltip?: string, };

export interface IColumn {
    header: string;
    property: string;
    dataType?: DataType;
    type?: DataType;
    searchProperty?: string;
    filterType?: FilterType;
    disableSorting?: boolean;
    hideInMobile?: boolean;
    btns?: Array<BtnForColumn>;
    propHideBtns?: string;
    width?: string;
    hideColumnBy?: string;
    defaultValue?: string;
    classes?: string;
}