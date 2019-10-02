import { GoogleUserInfoResultDTO } from './../_models/dto/google-user-info-result-dto';
import { GoogleUserInfoResponse } from './../_models/response/google-user-info-response';
import { HttpUtilService } from './http-util.service';
import {Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class GoogleUserService {

    private googleUserInfoBaseURL = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=';

    constructor(private httpUtil: HttpUtilService) { }

    getUserInfo(googleUserAccessToken: string): Observable<GoogleUserInfoResultDTO> {

        let getGoogleUserInfoURL = this.googleUserInfoBaseURL + googleUserAccessToken;

        return this.httpUtil.getRequest<GoogleUserInfoResponse>(getGoogleUserInfoURL, null, null)
            .map(googleUserInfoResponse => {
                let googleUserInfoResultDTO: GoogleUserInfoResultDTO = new GoogleUserInfoResultDTO();
                googleUserInfoResultDTO.id = googleUserInfoResponse.id;
                googleUserInfoResultDTO.firstName = googleUserInfoResponse.given_name;
                googleUserInfoResultDTO.lastName = googleUserInfoResponse.family_name;
                googleUserInfoResultDTO.email = googleUserInfoResponse.email;
                googleUserInfoResultDTO.imgUrl = googleUserInfoResponse.picture;

                return googleUserInfoResultDTO;
            });

    }

}