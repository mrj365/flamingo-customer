import { LocalStorageConstants } from './../_models/constants/local-storage-constants';
import { UploadFileResponse } from './../_models/response/upload-file-response';
import { RequestOptions, Http, RequestMethod, Headers } from '@angular/http';
import { UploadFileResultDTO } from './../_models/dto/upload-file-result-dto';
import { ConfigEntity } from './../_models/entity/config-entity';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UrlConstants } from '../_models/constants/url-constants';
import { environment } from 'environments/environment';

@Injectable()
export class ImageService {

constructor(private http: Http) { }


  getImgUrl(str): string {
    let imgUrl = '';

    if (!str) {
      return 'images/md-placholder.png';
    }

    if(str.substring(0, 4) === 'http' || str.substring(0, 4) === 'www.'){
      imgUrl = str;
    } else {
      if (str.substring(0, 1) === '/') {
        str = str.substring(1, str.length);
      }

    //let config: ConfigEntity = this.configService.getLocalConfig();
    imgUrl = environment.staticImgPath + str;
  }
  return imgUrl;
}

  uploadImg(data: FormData, fileType: string): Observable<UploadFileResultDTO> {

    let headers = new Headers();

    /** No need to include Content-Type in Angular 4 */
    // headers.append('Content-Type', 'multipart/form-data');
    // headers.append('Content-Type', fileType);
    // headers.append('Accept', 'application/json');
    this.addCurrentUserBasicAuth(headers);
    let options = new RequestOptions({
        headers: headers
    });
    
    return this.http.post(UrlConstants.APP_BASE_URL + '/uploads?name=' + 'elfie.png', data, options)
        .map(res => res.json() as UploadFileResponse)
        .catch(error => Observable.throw(error));
  }

  /**
     * Add basic auth if the user is signed in
     * @param headers 
     */
    private addCurrentUserBasicAuth(headers: Headers): Headers {
        let credentials = JSON.parse(localStorage.getItem(LocalStorageConstants.CURRENT_USER_KEY));

        if (credentials) {
            let uniqueId = credentials.uniqueId;
            let deviceUniqueId = credentials.deviceUniqueId;
            let secret = credentials.secret;
            let base64EncodedCredentials =  btoa(uniqueId + '.' + deviceUniqueId + ':' + secret);

            headers.append('Authorization', 'Basic ' + base64EncodedCredentials);
        }

        return headers;
    }

}