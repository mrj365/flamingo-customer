import { BeanUtils } from './../_util/BeanUtils';
import { ConfigEntity } from './../_models/entity/config-entity';
import { ConfigResponse } from './../_models/response/config-response';
import { UrlConstants } from './../_models/constants/url-constants';
import { LocalStorageConstants } from './../_models/constants/local-storage-constants';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { LocalStorageService } from './local-storage-service';
import { environment } from 'environments/environment';



@Injectable()
export class ConfigService {

    settingsLocation = environment.settingsLocation;

    constructor(private http: Http, private localStorageService: LocalStorageService) { }

    /**
     * This is called when angular is initialized
     * the httputil is not used here because exceptions 
     * must be handled in a different way during app initialization
     */
    setConfig(): Promise<void> {
        return this.http
            .get(UrlConstants.APP_BASE_URL_COMMON + this.settingsLocation)
            .map((res: Response) => res.json())
            .toPromise()
            .then((configResponse: ConfigResponse) => {
                let config: ConfigEntity = BeanUtils.copyProperties(new ConfigEntity(), configResponse);
                this.localStorageService.setItem(config);
                })
            .catch((err: any) => Promise.resolve());
    }

    getRemoteConfig(): Promise<ConfigEntity> {
        return this.http
            .get(UrlConstants.APP_BASE_URL_COMMON + this.settingsLocation)
            .map((res: Response) => res.json())
            .toPromise()
            .then((configResponse: ConfigResponse) => {
                let config: ConfigEntity = BeanUtils.copyProperties(new ConfigEntity(), configResponse);
                return config;
                })
            .catch((err: any) => Promise.resolve());
    }

    /**
     * The app configuration is retrieved at startup and stored in local storage
     * The local storage value can then be read using this method
     */
    getLocalConfig(): ConfigEntity {
        let config: ConfigEntity =  this.localStorageService.getItem(ConfigEntity);

        return config;
    }

    getJson(url): ConfigResponse {
        let configEntityStr = null;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        
        xhr.onload = function() {
            let status = xhr.status;
            if (status === 200) {
                configEntityStr = xhr.responseText;
                
               // return configResponse
            } else {
                //callback(status, xhr.response);
                configEntityStr = "{}";
            }
        };
        xhr.send();

        while(!configEntityStr) {
            //wait for response
        }

        let configResponse: ConfigResponse = JSON.parse(configEntityStr);
        return configResponse;
        
    };
}
