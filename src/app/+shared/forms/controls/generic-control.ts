import { Observable } from "rxjs/Observable";

export type ControlType = 'name' | 'text' | 'number' | 'select' | 'autocomplete' | 'date' | 'checkbox' | 'time' | 'memo';
export type FilterType = 'name ' | 'text' | 'number' | 'select' | 'autocomplete' | 'date' | 'custom';
type Combo = { number: any; name: string };

export class GenericControl {
    value?: any;
    key: string = '';
    label: string = '';
    placeholder?: string;
    required?: boolean;
    minlength?: number;
    maxlength?: number;
    order?: number;
    type: ControlType = 'text';
    filterType?: FilterType;
    class?: string;
    materialize?: string;
    options?: Array<Combo>;
    functionForData?: Observable<any>;
    datePickerOptions?: any;
    timePickerOptions?: any;
    searchProperty?: string;
    sign?: string;
    parameter?: boolean;
}