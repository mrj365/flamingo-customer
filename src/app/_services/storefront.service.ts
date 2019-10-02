import { LocalStorageService } from './local-storage-service';
import { UserCredentialsEntity } from './../_models/entity/user-credentials-entity';
import { ServiceProviderListResultDTO } from './../_models/dto/service-provider-list-result-dto';
import { StorefrontResultDTO } from './../_models/dto/storefront-result-dto';
import { StorefrontAvailabilityResultDTO } from './../_models/dto/storefront-availability-result-dto';
import { HttpUtilService } from './http-util.service';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UrlConstants } from '../_models/constants/url-constants';

@Injectable()
export class StorefrontService {

constructor(private httpUtil: HttpUtilService, private localStorageService: LocalStorageService) { }

    // getAvailableTimeSlots(storefrontId: number, serviceProviderId: number, serviceDateStart: Date, serviceDateEnd: Date,
    //     mobile: boolean, slotsNeeded: number, reservedAppointmentId: number): Observable<StorefrontAvailabilityResultDTO> {

    //     let params: URLSearchParams = new URLSearchParams();
    //     params.set('service-provider-id', serviceProviderId + '');
    //     params.set('service-date-start', this.getFormattedDate(serviceDateStart));
    //     params.set('service-date-end', this.getFormattedDate(serviceDateEnd));

    //     return this.httpUtil.getRequest<StorefrontAvailabilityResultDTO>(UrlConstants.APP_BASE_URL + '/storefronts/' + storefrontId + '/availability', params, null, true);

    // }

    /**
     * Formats date to formate yyyy-MM-dd
     */
    private getFormattedDate(date: Date): string {
        return date.getFullYear() + '-' + this.formateNumberTo2Digit(date.getMonth() + 1)  + '-' + this.formateNumberTo2Digit(date.getDate());
    }

    private formateNumberTo2Digit(num: number): string {
        return ('0' + num).slice(-2);
    }

    getStorefront(storefrontId: number): Observable<StorefrontResultDTO> {

        return this.httpUtil.getRequest<StorefrontResultDTO>(UrlConstants.APP_BASE_URL + '/storefronts/' + storefrontId, null, null, true);

    }

    getStorefrontServiceProviders(storefrontId: number): Observable<ServiceProviderListResultDTO> {
        return this.httpUtil.getRequest<ServiceProviderListResultDTO>(UrlConstants.APP_BASE_URL + '/storefronts/'
            + storefrontId + '/service-providers', null, null, true);

    }

}

