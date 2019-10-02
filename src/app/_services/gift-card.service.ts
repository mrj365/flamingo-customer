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
import { PurchaseGiftCardDTO } from 'app/_models/dto/purchase-gift-card-dto';
import { PurchaseGiftCardRequest } from 'app/_models/request/purchase-gift-card-request';
import { PurchaseGiftCardReceiptResultDTO } from 'app/_models/dto/purchase-gift-card-receipt-result-dto';
import { GiftCardBalanceResultDTO } from 'app/_models/dto/gift-card-balance-result-dto';
import { RedeemGiftCardResultDTO } from 'app/_models/dto/redeem-gift-card-result-dto';
import { RedeemGiftCardDTO } from 'app/_models/dto/redeem-gift-card-dto';
import { Subject } from 'rxjs';
import { ApplyGiftCardDTO } from 'app/_models/dto/apply-gift-card-dto';
declare var Stripe:any;

@Injectable()
export class GiftCardService {

constructor(private httpUtil: HttpUtilService, private localStorageService: LocalStorageService) {
    Stripe.setPublishableKey(environment.stripePublicApiKey);
 }

 //This will be used to announce when balance
    private giftCardBalanceUpdateSource = new Subject<void>();

    giftCardUpdateResult$  = this.giftCardBalanceUpdateSource.asObservable();

    /**
     * Returns newly added payment method guid
     * @param number 
     * @param expirationMonth 
     * @param expirationYear 
     * @param cvv 
     */
    purchaseGiftCard(purchaseGiftCardDTO: PurchaseGiftCardDTO, idempotentUUID: string): Observable<PurchaseGiftCardReceiptResultDTO> {

        let createUserPaymentMethod: CreateUserPaymentMethodDTO = new CreateUserPaymentMethodDTO();
        //set up the card data as an object
        let dataObj = {"number": purchaseGiftCardDTO.number, "exp_month": purchaseGiftCardDTO.month, 
            "exp_year": purchaseGiftCardDTO.year, "cvc": purchaseGiftCardDTO.cvv};

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
                   let purchaseGiftCardRequest = BeanUtils.copyProperties(new PurchaseGiftCardRequest(), purchaseGiftCardDTO);
                   purchaseGiftCardRequest.paymentToken = response.id;
                   return this.postPurchaseGiftCard(purchaseGiftCardRequest, idempotentUUID);
                } else {
                    bootbox.alert(response.error);
                    return Observable.throw(response.error);
                }
            });

    }

    private postPurchaseGiftCard(purchaseGiftCardRequest: PurchaseGiftCardRequest, idempotentUUID: string): Observable<PurchaseGiftCardReceiptResultDTO> {
        let headers = new Headers();
        headers.append('idempotent-key', idempotentUUID);
        
        return this.httpUtil
            .postRequest<PurchaseGiftCardReceiptResultDTO>(UrlConstants.APP_BASE_URL + '/gift-cards', purchaseGiftCardRequest, headers, true);
    }

    public getGiftCardsBalance(): Observable<GiftCardBalanceResultDTO> {
        return this.httpUtil
            .getRequest<GiftCardBalanceResultDTO>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/gift-cards/balance', null, null, true);
    }

    public redeemGiftCard(redeemGiftCardDTO: RedeemGiftCardDTO): Observable<RedeemGiftCardResultDTO> {
        return this.httpUtil
            .postRequest<RedeemGiftCardResultDTO>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/gift-cards/redeem', redeemGiftCardDTO, null, true).map(redeemGiftCardResultDTO => {
                this.giftCardBalanceUpdateSource.next();
                return redeemGiftCardResultDTO;
            });
    }
}
