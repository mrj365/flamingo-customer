import { LocalStorageService } from './local-storage-service';
import { UserCredentialsEntity } from './../_models/entity/user-credentials-entity';
import { ExceptionResponse } from './../_models/response/exception-response';
import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';
import { LocalStorageConstants } from '../_models/constants/local-storage-constants';

@Injectable()
export class HttpUtilService {

    private readonly UNIQUE_ID_PLACEHOLDER = '{unique-id}';

    public headers: Headers;
    public requestoptions: RequestOptions;
    public res: Response;
    public params: URLSearchParams;
    private router;
    private httpErrorMessageDisplayed: boolean = false;

    constructor(private http: Http, private injector: Injector, private localStorageService: LocalStorageService) { }

    public getRequest<T>(url: string, params: URLSearchParams, headers: Headers, addCurrentUserBasicAuth?: boolean): Observable<T> {

        if (!headers) {
            this.headers = new Headers();
        } else {
            this.headers = headers;
        }

        if (!params) {
            this.params = new URLSearchParams();
        } else {
            this.params = params;
        }

        if (addCurrentUserBasicAuth) {
            this.headers = this.addCurrentUserBasicAuth(this.headers);
        }

        this.headers.append('Content-type', 'application/json');

        this.requestoptions = new RequestOptions({
            method: RequestMethod.Get,
            url: this.replaceUniqueIdPlaceHolder(url),
            search: this.params,
            headers: this.headers
        });

        return this.http.request(new Request(this.requestoptions))
            .map(response => response.json() as T)
            .catch((error: any) => {     //catch Errors here using catch block
                this.handleError(error);
                    return Observable.throw(error);
            });
    }

    public postRequest<T>(url: string, data: any, headers: Headers, addCurrentUserBasicAuth?: boolean): Observable<T> {

        if(!headers){
            this.headers = new Headers();
        } else {
            this.headers = headers;
        }

        this.headers.append("Content-type", "application/json");

        if(addCurrentUserBasicAuth){
            this.headers = this.addCurrentUserBasicAuth(this.headers);
        }

        this.requestoptions = new RequestOptions({
            method: RequestMethod.Post,
            url: this.replaceUniqueIdPlaceHolder(url),
            headers: this.headers,
            body: JSON.stringify(data)
        });

        return this.http.request(new Request(this.requestoptions))
            .map(response => response.json() as T)
            .catch((error: any) => {     //catch Errors here using catch block
                this.handleError(error);
                return Observable.throw(error);
            });
    }

    public putRequest<T>(url: string, data: any, headers: Headers, addCurrentUserBasicAuth?: boolean): Observable<T> {

        if(!headers){
            this.headers = new Headers();
        } else {
            this.headers = headers;
        }

        this.headers.append("Content-type", "application/json");

        if(addCurrentUserBasicAuth){
            this.headers = this.addCurrentUserBasicAuth(this.headers);
        }

        this.requestoptions = new RequestOptions({
            method: RequestMethod.Put,
            url: this.replaceUniqueIdPlaceHolder(url),
            headers: this.headers,
            body: JSON.stringify(data)
        });

        return this.http.request(new Request(this.requestoptions))
            .map(response => response.json() as T)
            .catch((error: any) => {     //catch Errors here using catch block
                this.handleError(error);
                return Observable.throw(error);
            });
    }

    public deleteRequest<T>(url: string, data: any, headers: Headers, addCurrentUserBasicAuth?: boolean): any {

        if(!headers){
            this.headers = new Headers();
        } else {
            this.headers = headers;
        }

        this.headers.append("Content-type", "application/json");

        if(addCurrentUserBasicAuth){
            this.headers = this.addCurrentUserBasicAuth(this.headers);
        }

        this.requestoptions = new RequestOptions({
            method: RequestMethod.Delete,
            url: this.replaceUniqueIdPlaceHolder(url),
            headers: this.headers,
            body: JSON.stringify(data)
        });

        return this.http.request(new Request(this.requestoptions))
            .map(response => response.json() as T)
            .catch((error: any) => {     //catch Errors here using catch block
                this.handleError(error);
                return Observable.throw(error);
            });
    }



    private handleError(error: any): Promise<any> {
        this.logDebug('An error occurred: ' + JSON.stringify(error));

        let httpStatusCode = new Number(error.status);

        if( httpStatusCode == 504 ) {
            this.showDefaultException();
            return Promise.reject(error.message || error);
        } else if( httpStatusCode == 401 || httpStatusCode == 403) {
            this.logDebug('user is not logged in. About to redirect');
            let httpException = error.json() as ExceptionResponse;
            this.logDebug('Client exception: ' + JSON.stringify(httpException));
            if (this.router == null) {
                this.router = this.injector.get(Router);
            }

            this.router.navigateByUrl('/login');
        } else if( httpStatusCode == 429 ) { // Don't show exception for 429
            return Promise.reject(error.message || error);
        } else if( httpStatusCode == 404 ) {
            location.reload(); // Temporary Fix for new URLs
        } else if( httpStatusCode >= 400 && httpStatusCode <= 499) {
            this.showDefaultException();
            let httpException = error.json() as ExceptionResponse;
            this.logDebug('Client exception: ' + JSON.stringify(httpException));
        } else {
            let httpException = error.json() as ExceptionResponse;
            if (httpException.clientErrorMessage) {
                bootbox.alert(httpException.clientErrorMessage);
            } else {
                this.showDefaultException();
            }
            this.logDebug('Server exception: ' + JSON.stringify(httpException));
        }

        return Promise.reject(error.message || error);
    }

    /**
     * Add basic auth if the user is signed in
     * @param headers 
     */
    public addCurrentUserBasicAuth(headers: Headers): Headers {
         let credentials = this.localStorageService.getItem(UserCredentialsEntity);

        if (credentials) {
            let uniqueId = credentials.uniqueId;
            let deviceUniqueId = credentials.deviceUniqueId;
            let secret = credentials.secret;
            let base64EncodedCredentials =  btoa(uniqueId + '.' + deviceUniqueId + ':' + secret);

            headers.append('Authorization', 'Basic ' + base64EncodedCredentials);
        }

        return headers;
    }

    public replaceUniqueIdPlaceHolder(url: string): string {
        let replaceUniqueIdPlaceHolder = url.search(this.UNIQUE_ID_PLACEHOLDER);

        if(replaceUniqueIdPlaceHolder >= 0) {
            let credentials: UserCredentialsEntity = this.localStorageService.getItem(UserCredentialsEntity);
            url = url.replace(this.UNIQUE_ID_PLACEHOLDER, credentials.uniqueId);
        }

        return url;
    }

logDebug(logMessage: string) {
    if(console) {
      console.log(logMessage);
    }
  }

    private showDefaultException() {
        if(!this.httpErrorMessageDisplayed) {
            bootbox.alert('An exception occured while processing your request', () => this.resetHttpErrorMessage());
            this.httpErrorMessageDisplayed = true;
        }
    }

    private resetHttpErrorMessage() {
        this.httpErrorMessageDisplayed = false;
    }
}
