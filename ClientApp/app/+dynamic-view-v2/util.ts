export class Column {
    header: string;
    property: string;
    disableFilter?: boolean;
    disableSorting?: boolean;
}

export class Sort {
    sortBy: string;
    ascending: boolean;
}



export class ElementFilter {
    value: any;
    typeFilter: string;
    css?: string;

    constructor(typeFilter: string, css?: string) {
        this.value = '';
        this.typeFilter = typeFilter;
        this.css = css ? css : '';
    }
}

// clases utiles 
export class EntityPropertyTable {
    number: number;
    label: string;
    propertyName: string;
    tableName: string;
    type: string;
    order: number;
    required: boolean;
    controlType: string;
    foraignTable: string;
    foraignField: string;
    foraignKey: string;
    class: string;
    hideInTable: boolean;
}

export class Property {
    label: string;
    name: string;
    value: any;
    type: string;
    modified: boolean;
    controlType: string;
    order: number;
    required: boolean;
    foraignTable: string;
    foraignField: string;
    foraignKey: string;
    class: string;

    constructor(ept?: EntityPropertyTable) {
        if (ept) {
            this.label = ept.label ? ept.label : '';
            this.name = ept.propertyName ? ept.propertyName.toLowerCase() : '';
            this.value = null;
            this.type = ept.type ? ept.type.toLowerCase() : '';
            this.modified = false;
            this.controlType = ept.controlType ? ept.controlType.toLowerCase() : '';
            this.order = ept.order ? ept.order : 0;
            this.required = ept.required ? ept.required : false;
            this.foraignTable = ept.foraignTable ? ept.foraignTable.toLowerCase() : '';
            this.foraignField = ept.foraignField ? ept.foraignField.toLowerCase() : '';
            this.foraignKey = ept.foraignKey ? ept.foraignKey.toLowerCase() : '';
            this.class = ept.class ? ept.class : '';
        }
    }
}

export class GenericObject {
    tableName: string;
    useCase: string;
    entityProperties: Array<Property> = new Array<Property>();
}

export class ControlType {
    /* the values of de types must be in lowecasa */
    public static TEXT: string = 'text';
    public static NUMBER: string = 'number';
    public static SELECT: string = 'select';
    public static AUTOCOMPLETE: string = 'autocomplete';
    public static RADIO: string = 'radio';
}

export class Parameter {
    entityProperties: Array<EntityPropertyTable>;
    tableName: string;
    useCaseCode: string;
    title: string;
    idItemProperty: string;
}

export class ControlOptions {
    value: any;
    key: string;
    label: string;
    placeholder: string;
    required: boolean;
    minlength: number | undefined;
    maxlength: number | undefined;
    order: number;
    type: string;
    class: string;
    materialize: string;
    options: Array<any>;
    source: any;
}