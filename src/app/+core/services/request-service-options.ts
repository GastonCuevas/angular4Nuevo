import { RequestMethod } from '@angular/http';

export class RequestServiceOptions {
    public method: RequestMethod;
    public url: string;
    public headers: any = {};
    public params = {};
    public data = {};
}
