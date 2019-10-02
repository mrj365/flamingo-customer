import { ObjectCreatedIdResponse } from './../_models/response/object-created-id-response';
import { InitializeReoccurringAppointmentRequest } from './../_models/request/initialize-reoccurring-appointment-request';
import { AppointmentWReoccurringListResultDTO } from './../_models/dto/appointment-w-reoccurring-list-result-dto';
import { AppointmentReoccurringListResponse } from './../_models/response/appointment-reoccurring-list-response';
import { AppointmentDetailsResponse } from './../_models/response/appointment-details-response';
import { AppointmentResultDTO } from './../_models/dto/appointment-result-dto';
import { AppointmentListResponse } from './../_models/response/appointment-list-response';
import { LocalStorageService } from './local-storage-service';
import { UserCredentialsEntity } from './../_models/entity/user-credentials-entity';
import { ShoppingCartDTO } from './../_models/dto/shopping-cart-dto';
import { AppointmentListResultDTO } from './../_models/dto/appointment-list-result-dto';
import { UrlConstants } from './../_models/constants/url-constants';
import { UpdateAppointmentPaymentMethodRequest } from './../_models/request/update-appointment-payment-method-request';
import { UserService } from './user.service';
import { UpdateAppointmentAddressRequest } from './../_models/request/update-appointment-address-request';
import { UpdateAppointmentNoteRequest } from './../_models/request/update-appointment-note-request';
import { OrderItemDTO } from './../_models/dto/order-item-dto';
import { ReserveAppointmentDTO } from './../_models/dto/reserve-appointment-dto';
import { MapLocationDTO } from './../_models/dto/map-location-dto';
import { LocalStorageConstants } from './../_models/constants/local-storage-constants';
import { HttpUtilService } from './http-util.service';
import { Injectable } from '@angular/core';
import {Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UserAppointmentFilterEnum } from '../_models/_enums/user-appointment-filter-enum.enum';
import { ShoppingCartService } from './shopping-cart.service';
import { LocationService } from './location.service';
import { BeanUtils } from '../_util/BeanUtils';
import { AppointmentDetailsResultDTO } from '../_models/dto/appointment-details-result-dto';
import { CancelAppointmentReqeuest } from '../_models/request/cancel-appointment-reqeuest';
import { ApplyGiftCardDTO } from 'app/_models/dto/apply-gift-card-dto';
import { Subject } from 'rxjs';


@Injectable()
export class UserAppointmentService {

    private giftCardBalanceUpdateSource = new Subject<void>();
    giftCardUpdateResult$  = this.giftCardBalanceUpdateSource.asObservable();

    constructor(private httpUtil: HttpUtilService,
        private shoppingCartService: ShoppingCartService,
        private locationService: LocationService,
        private localStorageService: LocalStorageService) { }

    getUserAppointments(userAppointmentFilterEnum: UserAppointmentFilterEnum, page: number): Observable<AppointmentListResultDTO> {

        let params: URLSearchParams = new URLSearchParams();
        params.set('filter', UserAppointmentFilterEnum[userAppointmentFilterEnum]);
        params.set('page', page + '');

        return this.httpUtil
            .getRequest<AppointmentListResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/appointments', params, null, true)
                .map(appointmentListResponse => {
                    let appointmentListResultDTO: AppointmentListResultDTO = 
                        BeanUtils.copyProperties(new AppointmentListResultDTO(), appointmentListResponse);
                    return appointmentListResultDTO;
                });

    }

    getUserAppointmentsWithReoccurring(filter: string, page: number): Observable<AppointmentListResultDTO> {

        let params: URLSearchParams = new URLSearchParams();
        params.set('filter', filter);
        params.set('page', page + '');

        return this.httpUtil
            .getRequest<AppointmentListResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/appointments/v2', params, null, true)
                .map(appointmentListResponse => {
                    let appointmentListResultDTO: AppointmentListResultDTO = 
                        BeanUtils.copyProperties(new AppointmentListResultDTO(), appointmentListResponse);
                    return appointmentListResultDTO;
                });

    }

    getUserAppointment(appointmentId: number): Observable<AppointmentDetailsResultDTO> {

        return this.httpUtil
            .getRequest<AppointmentDetailsResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/appointments/' + appointmentId, null, null, true)
                .map(appointmentDetailsResponse => {
                    let appointmentDetailsResultDTO: AppointmentDetailsResultDTO = 
                        BeanUtils.copyProperties(new AppointmentDetailsResultDTO(), appointmentDetailsResponse);
                    return appointmentDetailsResultDTO;
                });
    }

    initializeReoccurringAppointment(appointmentId: number, startDate: string): Observable<number> {
        let initializeReoccurringAppointmentRequest: InitializeReoccurringAppointmentRequest = new InitializeReoccurringAppointmentRequest();
        initializeReoccurringAppointmentRequest.dateOfReoccurringAppointment = startDate;

        return this.httpUtil
            .postRequest<ObjectCreatedIdResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/reoccurring-appointments/'
                + appointmentId + '/initialize', initializeReoccurringAppointmentRequest, null, true).map(createdResponse => {              
                    return createdResponse.id;
            });
    }

    updateAppointmentNote(appointmentId: number, note: string, updateType: string, idempotentUUID: string): Observable<void> {
        let headers = new Headers();
        headers.append('idempotent-key', idempotentUUID);

        let updateAppointmentNoteRequest: UpdateAppointmentNoteRequest = new UpdateAppointmentNoteRequest(note, updateType);

        return this.httpUtil
            .putRequest<void>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/appointments/'
                + appointmentId + '/note', updateAppointmentNoteRequest, headers, true);
    }

    updateAppointmentAddress(appointmentId: number, mapLocationDTO: MapLocationDTO, updateType: string, idempotentUUID: string) {
        let headers = new Headers();
        headers.append('idempotent-key', idempotentUUID);

        let updateAppointmentAddressRequest: UpdateAppointmentAddressRequest = new UpdateAppointmentAddressRequest(mapLocationDTO, updateType);

        return this.httpUtil
            .putRequest<void>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/appointments/'
                + appointmentId + '/address', updateAppointmentAddressRequest, headers, true);
    }

    updateAppointmentPaymentMethod(appointmentId: number, guid: string, idempotentUUID: string, updateType: string): Observable<void> {
        let headers = new Headers();
        headers.append('idempotent-key', idempotentUUID);

        let updateAppointmentPaymentMethodRequest: UpdateAppointmentPaymentMethodRequest = new UpdateAppointmentPaymentMethodRequest(updateType, guid);

        return this.httpUtil
            .putRequest<void>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/appointments/' 
                + appointmentId + '/payment-method', updateAppointmentPaymentMethodRequest, headers, true);
        
    }

    cancelAppointment(appointmentId: number, updateType: string, idempotentUUID: string): Observable<void> {
        let headers = new Headers();
        headers.append('idempotent-key', idempotentUUID);

        let cancelAppointmentRequest  = new CancelAppointmentReqeuest(updateType);
        return this.httpUtil
            .postRequest<void>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/appointments/'
                + appointmentId + '/cancel', cancelAppointmentRequest, headers, true);
    }

    applyGiftCard(appointmentId: number, applyGiftCardDTO: ApplyGiftCardDTO, idempotentUUID: string): Observable<void> {
        let headers = new Headers();
        headers.append('idempotent-key', idempotentUUID);

        return this.httpUtil
            .postRequest<void>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/appointments/' 
                + appointmentId + '/apply-gift-card-balance', applyGiftCardDTO, headers, true).map(result => {
                    this.giftCardBalanceUpdateSource.next(); // Publish event to notify listeners that a gift card has been applied
                    return result;
                });
        
    }
    

}