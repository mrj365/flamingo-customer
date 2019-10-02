import { BeanUtils } from './../_util/BeanUtils';
import { UserCredentialsEntity } from './../_models/entity/user-credentials-entity';
import { NotificationResultDTO } from './../_models/dto/notification-result-dto';
import { NotificationListResultDTO } from './../_models/dto/notification-list-result-dto';
import { NotificationListResponse } from './../_models/response/notification-list-response';
import { UrlConstants } from './../_models/constants/url-constants';
import { HttpUtilService } from './http-util.service';
import { Injectable } from '@angular/core';
import {Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NotificationResponseDTO } from '../_models/response/dto/notification-response-dto';

@Injectable()
export class NotificationService {

    constructor(private httpUtil: HttpUtilService) { }

    getUserNotifications(): Observable<NotificationListResultDTO> {

        return this.httpUtil
            .getRequest<NotificationListResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/notifications', null, null, true)
                .map(notificationListResponse => {
                    let notificationListResultDTO: NotificationListResultDTO = new NotificationListResultDTO();

                    for(let notificationResponseDTO of notificationListResponse.notifications) {
                        let notificationResultDTO: NotificationResultDTO = 
                            BeanUtils.copyProperties( new NotificationResultDTO(), notificationResponseDTO) ;

                        notificationListResultDTO.notifications.push(notificationResultDTO);
                    }

                    return notificationListResultDTO;
                });
    }

    getMarkNotificationRead(notificationId: number): Observable<void> {

        return this.httpUtil
            .postRequest<void>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/notifications/' 
                + notificationId + '/mark-read', null, null, true);

    }

}