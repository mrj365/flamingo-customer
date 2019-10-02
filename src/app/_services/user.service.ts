import { RequestResetPasswordRequest } from './../_models/request/request-reset-password-request';
import { ResetPasswordRequest } from './../_models/request/reset-password-request';
import { UserSavedSearchAddressUpdateRequest } from './../_models/request/user-saved-search-address-update-request';
import { ObjectCreatedIdResponse } from './../_models/response/object-created-id-response';
import { UpdateLastSearchedAddressRequest } from './../_models/request/update-last-searched-address-request';
import { UserAddressEntity } from './../_models/entity/user-address-entity';
import { UploadFileResultDTO } from './../_models/dto/upload-file-result-dto';
import { UploadFileResponse } from './../_models/response/upload-file-response';
import { BeanUtils } from './../_util/BeanUtils';
import { LocalStorageService } from './local-storage-service';
import { UrlConstants } from './../_models/constants/url-constants';
import { UserCredentialsEntity } from './../_models/entity/user-credentials-entity';
import { UserEntity } from './../_models/entity/user-entity';
import { UserResultDTO } from './../_models/dto/user-result-dto';
import { MapLocationDTO } from './../_models/dto/map-location-dto';
import { GoogleMapsUtil } from './../_util/google-maps-util';
import { UpdateUserRequest } from './../_models/request/update-user-request';
import { UpdateUserDTO } from './../_models/dto/update-user-dto';
import { LocalStorageConstants } from './../_models/constants/local-storage-constants';
import { BooleanResultResponse } from './../_models/response/boolean-result-response';
import { HttpUtilService } from './http-util.service';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UserResponse } from '../_models/response/user-response';
import { AuthenticationService } from './authentication.service';
import { RegistrationTypeEnum } from '../_models/_enums/registration-type-enum.enum';

@Injectable()
export class UserService {

    constructor(private http: Http, private httpUtil: HttpUtilService, private localStorageService: LocalStorageService, private authenticationService: AuthenticationService) { }


    getUser(): Observable<UserResultDTO> {

        return this.httpUtil.getRequest<UserResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}', null, null, true).map(userResponse =>
         {  
            let userResultDTO: UserResultDTO = BeanUtils.copyProperties(new UserResultDTO(), userResponse);
            return userResultDTO;
         });

    }

    setLocalUser() {

        if(this.authenticationService.isUserLoggedIn()) {
            this.httpUtil.getRequest<UserResultDTO>(UrlConstants.APP_BASE_URL + '/users/{unique-id}', null, null, true).subscribe(
                user => {
                    let localUser: UserEntity = BeanUtils.copyProperties(new UserEntity(), user);
                    this.localStorageService.setItem(localUser);
            });
        }
    }

    getLocalUser(): UserResultDTO {
        let userResultDTO: UserResultDTO = new UserResultDTO();
        let localUser: UserEntity = this.localStorageService.getItem(UserEntity);
        
        if (localUser) {
            userResultDTO = localUser.getUserResultDTO();
        }

        return userResultDTO;

    }

      /**
   * If behalf of user cookie is present log in on behalf of user
   */
  behalfOf() {
    let cookie = this.getCookie('behalfOfUser');

    if(cookie) {
      this.authenticationService.logout();
      this.authenticationService.loginOnBehalfOf(cookie);
    }
  }

  getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

    checkUserExistsWithRegistationId(registrationId: string, registrationType: RegistrationTypeEnum): Observable<boolean> {
        return this.httpUtil.getRequest<BooleanResultResponse>(UrlConstants.APP_BASE_URL + '/users/check-user-exists?registration-id=' + registrationId
        +'&registration-type=' + RegistrationTypeEnum[registrationType], null, null)
            .map(booleanResultResponse => {
                return booleanResultResponse.result;
            });
    }

    updateUser(updateUserDTO: UpdateUserDTO): Observable<void> {

        let updateUserRequest: UpdateUserRequest = BeanUtils.copyProperties(new UpdateUserRequest(), updateUserDTO);

        return this.httpUtil.putRequest<void>(UrlConstants.APP_BASE_URL + '/users/{unique-id}',
           updateUserRequest , null, true);
    }

    createUserSavedSearchAddress(place: google.maps.places.PlaceResult, locationName: string): Observable<number> {
        let mapLocationDTO: MapLocationDTO = GoogleMapsUtil.parsePlaceToMapLocation(place);
        let userSavedSearchAddressUpdateRequest: UserSavedSearchAddressUpdateRequest = BeanUtils.copyProperties(new UserSavedSearchAddressUpdateRequest(), mapLocationDTO);

        userSavedSearchAddressUpdateRequest.name = locationName;

        return this.httpUtil.postRequest<ObjectCreatedIdResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/saved-search-addresses',
             userSavedSearchAddressUpdateRequest, null, true).map(
                createSavedSearchAddressIdResponse =>
                {
                    return createSavedSearchAddressIdResponse.id;
                });
    }

    updateUserSavedSearchAddress(place: google.maps.places.PlaceResult, userSavedSearchAddressId: number, userSavedSearchAddressName: string): Observable<void> {
        let mapLocationDTO: MapLocationDTO = GoogleMapsUtil.parsePlaceToMapLocation(place);
        let savedSearchAddressUpdateRequest: UserSavedSearchAddressUpdateRequest = BeanUtils.copyProperties(new UserSavedSearchAddressUpdateRequest(), mapLocationDTO);

        savedSearchAddressUpdateRequest.name = userSavedSearchAddressName;

        return this.httpUtil.putRequest<void>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/saved-search-addresses/'
            + userSavedSearchAddressId, savedSearchAddressUpdateRequest, null, true);
    }

    deleteUserSavedSearchAddress(userSavedSearchAddressId: number): Observable<void> {
        return this.httpUtil.deleteRequest<void>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/saved-search-addresses/'
            + userSavedSearchAddressId, null, null, true);
    }

    uploadImg(data: FormData, fileType: string): Observable<UploadFileResultDTO> {

        let headers = new Headers();

        /** No need to include Content-Type in Angular 4 */
        // headers.append('Content-Type', 'multipart/form-data');
        // headers.append('Content-Type', fileType);
        // headers.append('Accept', 'application/json');
        this.httpUtil.addCurrentUserBasicAuth(headers);
        let options = new RequestOptions({
            headers: headers
        });
        
        return this.http.post(UrlConstants.APP_BASE_URL + '/users/{unique-id}/profile-img?name=' + 'elfie.png', data, options)
            .map(res => res.json() as UploadFileResponse)
            .catch(error => Observable.throw(error));
    }

    updateLastSearchedAddres() {
        if(this.authenticationService.isUserLoggedIn()) {
            let userAddressEntity: UserAddressEntity = this.localStorageService.getItem(UserAddressEntity);
            let updateLastSearchedAddressRequest: UpdateLastSearchedAddressRequest = BeanUtils.copyProperties(new UpdateLastSearchedAddressRequest(), userAddressEntity);

            this.httpUtil.putRequest<UserResultDTO>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/last-searched-location', updateLastSearchedAddressRequest, null, true).subscribe();
        }
    }

    requestPasswordReset(email: string): Observable<boolean> {

        let requestResetPasswordRequest: RequestResetPasswordRequest = new RequestResetPasswordRequest();
        requestResetPasswordRequest.email = email;

        return this.httpUtil.postRequest<BooleanResultResponse>(UrlConstants.APP_BASE_URL + '/users/request-password-reset',
             requestResetPasswordRequest, null, false).map(
                booleanResultResponse =>
                {
                    return booleanResultResponse.result;
                });
    }

    resetPassword(token: string, password: string): Observable<void> {

        let resetPasswordRequest: ResetPasswordRequest = new ResetPasswordRequest();
        resetPasswordRequest.token = token;
        resetPasswordRequest.password = password;

        return this.httpUtil.postRequest<void>(UrlConstants.APP_BASE_URL + '/users/reset-password',
             resetPasswordRequest, null, false);
    }

}