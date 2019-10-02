import { FacebookUserResultDTO } from './../_models/dto/facebook-user-result-dto';
import { FacebookUserResponse } from './../_models/response/facebook-user-response';
import { HttpUtilService } from './http-util.service';
import {Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class FacebookUserService {

    private facebookGraphURL = 'https://graph.facebook.com/me?access_token=';
    private facebookUserInfoQueryString = 'fields=first_name,last_name,email,picture';

    constructor(private httpUtil: HttpUtilService) { }


    getUserInfo(facebookUserId: string, facebookUserAccessToken: string): Observable<FacebookUserResultDTO> {

        let getFacebookUserInfoURL = this.facebookGraphURL + facebookUserAccessToken 
            + '&' + this.facebookUserInfoQueryString;

        return this.httpUtil.getRequest<FacebookUserResponse>(getFacebookUserInfoURL, null, null)
            .map(facebookUserResponse => {
                let facebookUserResultDTO: FacebookUserResultDTO = new FacebookUserResultDTO();
                facebookUserResultDTO.id = facebookUserResponse.id;
                facebookUserResultDTO.firstName = facebookUserResponse.first_name;
                facebookUserResultDTO.lastName = facebookUserResponse.last_name;
                facebookUserResultDTO.email = facebookUserResponse.email;
                facebookUserResultDTO.imgUrl = facebookUserResponse.picture.data.url;

                return facebookUserResultDTO;
            });

    }

}
