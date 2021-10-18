import { Http, Response, RequestMethod, RequestOptions, URLSearchParams } from '@angular/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { AuthTokenService } from '../auth/auth-token.service';
import { ErrorMessageComponent } from './../../+shared/forms/error-message/error-message.component';
import { RequestServiceOptions } from './request-service-options';
import { UtilityService } from './utility.service';
import { StorageService } from './storage.service';

@Injectable()
export class RequestService {

    constructor(
        private http: Http,
        private utilityService: UtilityService,
        private authTokens: AuthTokenService,
        private storageService: StorageService
    ) { }

    get(url: string, params?: any, headers?: any): Observable<any> {
        const options = new RequestServiceOptions();
        options.method = RequestMethod.Get;
        options.url = url;
        options.params = params;
        options.headers = headers;
        return this.request(options);
    }

    post(url: string, data?: any, params?: any, headers?: any): Observable<any> {
        const options = new RequestServiceOptions();
        options.method = RequestMethod.Post;
        options.url = url;
        options.params = params;
        options.data = data;
        options.headers = headers;
        return this.request(options);
    }

    postFormData(url: string, data?: FormData, params?: any) {
        const token = this.getToken();
        return Observable.fromPromise(new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('POST', url);
            if (token) {
                request.setRequestHeader('Authorization', `Bearer ${token}`);
            }
            request.onreadystatechange = (aEvt) => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        resolve(request.response)
                    } else {
                        reject(request.response)
                    }
                }
            };
            request.send(data);
        })).map((r) => {
            return r;
        });
    }

    putFormData(url: string, data?: FormData, params?: any) {
        const token = this.getToken();
        return Observable.fromPromise(new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('PUT', url);
            if (token) {
                request.setRequestHeader('Authorization', `Bearer ${token}`);
            }
            request.onreadystatechange = (aEvt) => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        resolve(request.response)
                    } else {
                        reject(request.response)
                    }
                }
            };
            request.send(data);
        })).map((r) => {
            return r;
        });
    }

    put(url: string, data?: any, params?: any, headers?: any): Observable<any> {
        if (!data) {
            data = params;
            params = {};
        }

        const options = new RequestServiceOptions();
        options.method = RequestMethod.Put;
        options.url = url;
        options.params = params;
        options.data = data;
        options.headers = headers;
        return this.request(options);
    }

    delete(url: string, headers?: any): Observable<any> {
        const options = new RequestServiceOptions();
        options.method = RequestMethod.Delete;
        options.url = url;
        options.headers = headers;
        return this.request(options);
    }

    private request(options: RequestServiceOptions): Observable<any> {
        options.method = (options.method || RequestMethod.Get);
        options.url = (options.url || '');
        options.headers = (options.headers || {});
        options.params = (options.params || {});
        options.data = (options.data || {});

        this.addContentType(options);
        this.addAuthToken(options);

        const requestOptions = this.buildRequestOption(options);

        return this.http.request(options.url, requestOptions)
            .catch((error: any) => {
                this.handleErrors(error);
                return Observable.throw(error._body == "" ? error._body : error.json());
            })
            .map(resp => {
                return resp._body == "" ? resp._body : resp.json()
            });
    }

    private addContentType(options: RequestServiceOptions): RequestServiceOptions {
        if (!options.headers['Content-Type']) {
            options.headers['Content-Type'] = 'application/json; charset=UTF-8';
        }
        return options;
    }

    private addAuthToken(options: RequestServiceOptions): RequestServiceOptions {
        const token = this.getToken();
        if (token) {
            options.headers.Authorization = `Bearer ${token}`;
        }
        return options;
    }

    private buildRequestOption(options: RequestServiceOptions): RequestOptions {
        const requestOptions = new RequestOptions();
        requestOptions.method = options.method;
        requestOptions.url = options.url;
        requestOptions.headers = options.headers;
        requestOptions.params = this.buildUrlSearchParams(options.params);
        requestOptions.body = JSON.stringify(options.data);

        return requestOptions;
    }

    private buildUrlSearchParams(params: any): URLSearchParams {
        const searchParams = new URLSearchParams();
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                searchParams.append(key, params[key]);
            }
        }
        return searchParams;
    }

    private handleErrors(error: any) {
        switch (error.status) {
            case 401:
            case 403:
                this.authTokens.deleteTokens();
                this.utilityService.navigateToLogin();
                break;
            default:
                console.error("ERROR", error.json());
                break;
        }
    }

    private getToken() {
        const token = this.storageService.getItem('auth-tokens');
        return !token ? null : token.access_token;
    }

    upFileServer(url: string, file: any): Observable<any> {
        const token = this.getToken();
        return Observable.fromPromise(new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            const formData = new FormData();

            formData.append('file', file);
            request.open('POST', url);
            if (token) {
                request.setRequestHeader('Authorization', `Bearer ${token}`);
            }

            request.onreadystatechange = (aEvt) => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        resolve(request.response)
                    } else {
                        reject(request.response)
                    }
                }
            };
            request.send(formData);
        })).map((r) => {
            return r;
        });
    }
}