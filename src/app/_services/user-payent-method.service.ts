import { environment } from 'environments/environment';
import { LocalStorageService } from './local-storage-service';
import { UserCredentialsEntity } from './../_models/entity/user-credentials-entity';
import { CreateUserPaymentMethodDTO } from './../_models/dto/create-user-payment-method-dto';
import { UserPaymentMethodListResultDTO } from './../_models/dto/user-payment-method-list-result-dto';
import { HttpUtilService } from './http-util.service';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/bindCallback';
import { ConfigEntity } from '../_models/entity/config-entity';
import { UserPaymentMethodListResponse } from '../_models/response/user-payment-method-list-response';
import { BeanUtils } from '../_util/BeanUtils';
import { AddPaymentMethodResponse } from '../_models/response/add-payment-method-response';
import { UrlConstants } from '../_models/constants/url-constants';
declare var Stripe:any;

@Injectable()
export class UserPaymentMethodService {

constructor(private httpUtil: HttpUtilService, private localStorageService: LocalStorageService) {
        //let configEntity: ConfigEntity = localStorageService.getItem(ConfigEntity);
        Stripe.setPublishableKey(environment.stripePublicApiKey);

}

    /**
     * Returns newly added payment method guid
     * @param number 
     * @param expirationMonth 
     * @param expirationYear 
     * @param cvv 
     */
    createPaymentMethod(number: string, expirationMonth: string, expirationYear: string, cvv: string): Observable<string> {

        let createUserPaymentMethod: CreateUserPaymentMethodDTO = new CreateUserPaymentMethodDTO();
        //set up the card data as an object
        let dataObj = {"number": number, "exp_month": expirationMonth, "exp_year": expirationYear, "cvc": cvv};

        const stripeCreateTokenAsObservable = Observable.bindCallback(Stripe.card.createToken);


        var callback = Observable.bindCallback(
            (
                data: any,
                responseHandler: (status: number, response: any) => void
            ) => Stripe.card.createToken(data, responseHandler),
            (status: number, response: any) => ({ status, response })
            );

        return callback(dataObj)
            .flatMap(({ status, response }) => {
                if (status === 200) {
                    let cardToken = response.id;
                    let createUserPaymentMethod: CreateUserPaymentMethodDTO = new CreateUserPaymentMethodDTO();
                    createUserPaymentMethod.token = cardToken;
                    createUserPaymentMethod.type = this.getCardType(number);
                    createUserPaymentMethod.expirationDate = expirationYear + expirationMonth;
                    createUserPaymentMethod.lastFour = number.substr(number.length - 4, number.length);

                    return this.postCreateUserPaymentMethod(createUserPaymentMethod);
                } else {
                    bootbox.alert(response.error);
                    return Observable.throw(response.error);
                }
            });

    }

    private postCreateUserPaymentMethod(createUserPaymentMethod: CreateUserPaymentMethodDTO): Observable<string> {
        return this.httpUtil
            .postRequest<AddPaymentMethodResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/payment-methods', createUserPaymentMethod, null, true).map(
                addPaymentMethodResponse => {
                  return  addPaymentMethodResponse.guid;
                });
    }

    getUserCards(): Observable<UserPaymentMethodListResultDTO> {
        return this.httpUtil
            .getRequest<UserPaymentMethodListResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/payment-methods', null, null, true)
                .map(userPaymentMethodListResponse => {
                    let userPaymentMethodListResultDTO: UserPaymentMethodListResultDTO =
                        BeanUtils.copyProperties(new UserPaymentMethodListResultDTO(), userPaymentMethodListResponse);
                        return userPaymentMethodListResultDTO;
                });

    }

    setPreferredPaymentMethod(guid: string): Observable<void> {

        return this.httpUtil
            .postRequest<void>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/payment-methods/' + guid + '/set-preferred', null, null, true);

    }

    deletePaymentMethod(guid: string): Observable<void> {
        return this.httpUtil
            .deleteRequest<void>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/payment-methods/' + guid, null, null, true);

    }

    public getCardType(number): string {
        // visa
        let re = new RegExp('^4');
        if (number.match(re) != null){
            return 'VISA';
        }

        // Mastercard
        re = new RegExp('^5[1-5]');
        if (number.match(re) != null) {
            return 'MASTERCARD';
        }

        // AMEX
        re = new RegExp('^3[47]');
        if (number.match(re) != null) {
            return 'AMEX';
        }

        // Discover
        re = new RegExp('^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)');
        if (number.match(re) != null) {
            return 'DISCOVER';
        }

        // Diners
        re = new RegExp('^3(?:0[0-5]|[68][0-9])[0-9]{11}$');
        if (number.match(re) != null) {
            return 'DINERS';
        }

        // JCB
        re = new RegExp('^35(2[89]|[3-8][0-9])');
        if (number.match(re) != null) {
            return 'JCB';
        }

        return '';
    }

    getCardImg(cardType: string) {
        let cardImgLocation = '';
        switch(cardType) {
            case 'VISA':
                cardImgLocation = 'images/cc-images/light-color/visa.png';
                break;
            case 'MASTERCARD':
                cardImgLocation = 'images/cc-images/light-color/mastercard.png';
                break;
            case 'AMEX':
                cardImgLocation = 'images/cc-images/light-color/amex.png';
                break;
            case 'DISCOVER':
                cardImgLocation = 'images/cc-images/light-color/discover.png';
                break;
            case 'DINERS':
                cardImgLocation = 'images/cc-images/light-color/diners.png';
                break;
            case 'JCB':
                cardImgLocation = 'images/cc-images/light-color/jcb.png';
                break;
        }

        return cardImgLocation;
    }

}