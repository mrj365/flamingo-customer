import { LocalStorageConstants } from './../_models/constants/local-storage-constants';
import { UUIDUtil } from './../_util/uuid-util';
import { UserResultDTO } from './../_models/dto/user-result-dto';
import { UpdateLastSearchedAddressRequest } from './../_models/request/update-last-searched-address-request';
import { ShoppingCartEntity } from './../_models/entity/shopping-cart-entity';
import { UserLastSearchedLocationResultDTO } from './../_models/dto/user-last-searched-location-result-dto';
import { BeanUtils } from './../_util/BeanUtils';
import { UserService } from './user.service';
import { UserAddressEntity } from './../_models/entity/user-address-entity';
import { LocalStorageService } from './local-storage-service';
import { UserCredentialsEntity } from './../_models/entity/user-credentials-entity';
import { UserLoginResult } from './../_models/dto/user-login-result';
import { UserLoginDTO } from './../_models/dto/user-login-dto';
import { UrlConstants } from './../_models/constants/url-constants';
import { UserLoginResponse } from './../_models/response/user-login-response';
import { UserRegisterResponse } from './../_models/response/user-register-response';
import { CreateUserDTO } from './../_models/dto/create-user-dto';
import { HttpUtilService } from './http-util.service';
import { Injectable } from '@angular/core';
import {Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { RegistrationTypeEnum } from '../_models/_enums/registration-type-enum.enum';
import { CreateUserRequest } from '../_models/request/create-user-request';
import { UserEntity } from '../_models/entity/user-entity';
import { Subject } from 'rxjs/Subject';
import { UserSavedSearchAddressEntity } from '../_models/entity/user-saved-search-address-entity';
import * as Raven from 'raven-js';

@Injectable()
export class AuthenticationService {

    /**
     * This user will be passed from the login page to the registration 
     * page for a smoother login flow.
     */
    public userToCreate: CreateUserDTO;

    public session: string;

    // private userLogin: UserLogin;
    constructor(private httpUtil: HttpUtilService, private localStorageService: LocalStorageService) { }

    /**
     * Log in user. Log in the user using one of the selected registration types (email, FB, google)
     * @param uuid - email, fbId, googleId
     * @param credentials  - password, fbToken, googleToken
     * @param registrationType 
     */
    login(uuid: string, credentials: string, registrationType: RegistrationTypeEnum): Observable<UserLoginResult> {
        
        let userLogin = new UserLoginDTO;
        userLogin.deviceUniqueId = this.generateUUID();
        userLogin.os = 'WEB';
        userLogin.registrationType = RegistrationTypeEnum[registrationType];
        userLogin.registrationId = uuid;
        userLogin.credential = credentials;

        return this.httpUtil.postRequest<UserLoginResponse>(UrlConstants.APP_BASE_URL + '/users/login', userLogin, null)
            .map(userLoginResponse => {
                let userLoginResult: UserLoginResult = new UserLoginResult();
                if(userLoginResponse.success) {                    
                    userLoginResult.secret = userLoginResponse.secret;
                    userLoginResult.uniqueId = userLoginResponse.uniqueId;
                    userLoginResult.success = true;

                    let credentials = new UserCredentialsEntity();
                    credentials.uniqueId = userLoginResponse.uniqueId;
                    credentials.deviceUniqueId = userLogin.deviceUniqueId;
                    credentials.secret = userLoginResponse.secret;
                    
                    this.localStorageService.setItem(credentials);

                    let localUser: UserEntity = BeanUtils.copyProperties(new UserEntity(), userLoginResponse);
                    this.localStorageService.setItem(localUser);

                    if(userLoginResponse.lastSearchedAddress) {
                        this.setLastSearchedAddress(userLoginResponse.lastSearchedAddress);
                    } else {
                        let userAddress = this.localStorageService.getItem(UserAddressEntity);
                        if(userAddress) {
                            this.updateLastSearchedAddres();
                        }
                    }
                } else {
                    userLoginResult.success = false;
                }

                    return userLoginResult;
                });

    }

    updateLastSearchedAddres() {
        let userAddressEntity: UserAddressEntity = this.localStorageService.getItem(UserAddressEntity);
        let updateLastSearchedAddressRequest: UpdateLastSearchedAddressRequest = BeanUtils.copyProperties(new UpdateLastSearchedAddressRequest(), userAddressEntity);

        this.httpUtil.putRequest<UserResultDTO>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/last-searched-location', updateLastSearchedAddressRequest, null, true).subscribe();
    }

    /**
     * Set users last searcehd location when they log in
     * @param lastSearchedAddress 
     */
    private setLastSearchedAddress(lastSearchedAddress: UserLastSearchedLocationResultDTO) {
        if(lastSearchedAddress) {
            let userAddressEntity: UserAddressEntity = new UserAddressEntity();
            userAddressEntity.address1 = lastSearchedAddress.address1;
            userAddressEntity.address2 = lastSearchedAddress.address2;
            userAddressEntity.city = lastSearchedAddress.city;
            userAddressEntity.state = lastSearchedAddress.state;
            userAddressEntity.zip = lastSearchedAddress.zip;
            userAddressEntity.latitude = lastSearchedAddress.latitude;
            userAddressEntity.longitude = lastSearchedAddress.longitude;
            userAddressEntity.formattedAddress = lastSearchedAddress.address1 + ' ' +
            lastSearchedAddress.city + ' ' + lastSearchedAddress.state + ' ' + lastSearchedAddress.zip;
            
            this.localStorageService.setItem(userAddressEntity);
        }
    }

    register(createUserDTO: CreateUserDTO): Observable<void> {

        let createUserRequest = new CreateUserRequest();
        createUserRequest.deviceUniqueId = this.generateUUID();
        createUserRequest.os = 'WEB';
        createUserRequest.registrationType = RegistrationTypeEnum[createUserDTO.registrationType];
        createUserRequest.firstName = createUserDTO.firstName;
        createUserRequest.lastName = createUserDTO.lastName;
        createUserRequest.phone = createUserDTO.phone;
        createUserRequest.profileImageBase64 = createUserDTO.profileImageBase64;
        createUserRequest.email = createUserDTO.email;
        createUserRequest.registrationId = createUserDTO.registrationId;
        createUserRequest.credential = createUserDTO.credential;

        return this.httpUtil.postRequest<UserRegisterResponse>(UrlConstants.APP_BASE_URL + '/users', createUserRequest, null)
            .map(registerResponse => {
                    let credentials = new UserCredentialsEntity();
                    credentials.deviceUniqueId = createUserRequest.deviceUniqueId;
                    credentials.uniqueId = registerResponse.uniqueId;
                    credentials.secret = registerResponse.secret;

                    this.localStorageService.setItem(credentials);

                    let userAddress = this.localStorageService.getItem(UserAddressEntity);
                    if(userAddress) {
                        this.updateLastSearchedAddres();
                    }

                    Raven.setUserContext({
                      id: credentials.uniqueId
                    });

                    return;
                });


    }

    logout() {
        // remove user from local storage to log user out
        this.localStorageService.remove(UserEntity);
        this.localStorageService.remove(ShoppingCartEntity);
        this.localStorageService.remove(UserCredentialsEntity);
        this.localStorageService.remove(UserSavedSearchAddressEntity);
        this.localStorageService.remove(UserAddressEntity);
        localStorage.removeItem(LocalStorageConstants.ADMIN_SESSION_ID);
    }

    isUserLoggedIn(): boolean {
        let userLoggedIn = false;
        let credentialsEntity = this.localStorageService.getItem(UserCredentialsEntity);

        if (credentialsEntity && credentialsEntity.uniqueId) {
            userLoggedIn = true;
        }

        return userLoggedIn;
    }

    generateUUID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    isAdminUserLoggedIn(): boolean {
        let userLoggedIn = false;
        let credentialsEntity = this.localStorageService.getItem(UserCredentialsEntity);

        if (credentialsEntity && credentialsEntity.onBehalfOf) {
            userLoggedIn = true;
        }

        return userLoggedIn;
    }

    loginOnBehalfOf(cookie: string): void {
        let userLoginResponse: UserLoginResponse = JSON.parse(cookie);
        this.session = userLoginResponse.adminSessId;
        localStorage.setItem(LocalStorageConstants.ADMIN_SESSION_ID, userLoginResponse.adminSessId);

        let credentials = new UserCredentialsEntity();
        credentials.uniqueId = userLoginResponse.uniqueId;
        credentials.deviceUniqueId = userLoginResponse.deviceUniqueId;
        credentials.secret = userLoginResponse.secret;
        credentials.onBehalfOf = userLoginResponse.behalfOfUser;
        
        this.localStorageService.setItem(credentials);

        let localUserEntity: UserEntity = BeanUtils.copyProperties(new UserEntity(), userLoginResponse);
        this.localStorageService.setItem(localUserEntity);

        if(userLoginResponse.lastSearchedAddress) {
            this.setLastSearchedAddress(userLoginResponse.lastSearchedAddress);
        }

        // Clean up cookie
        document.cookie = 'behalfOfUser=; Max-Age=-99999999;';
        
    }
}