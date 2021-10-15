import { IService } from "../../interface/service.interface";

export class ElementFilter {
    typeFilter: string;
    css?: string;
    source?: IService;
    

    constructor(typeFilter: string, css?: string, source?: IService) {
        this.typeFilter = typeFilter;
        this.css = css ? css : '';
        this.source = source ? source : undefined;
    }
}