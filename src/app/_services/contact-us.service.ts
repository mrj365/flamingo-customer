import { UrlConstants } from './../_models/constants/url-constants';
import { ContactUsDTO } from './../_models/dto/contact-us-dto';
import { HttpUtilService } from './http-util.service';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { ContactUsRequest } from '../_models/request/contact-us-request';

@Injectable()
export class ContactUsService {

constructor(private httpUtil: HttpUtilService) { }

    contactUs(contactUsDTO: ContactUsDTO): Observable<void> {
        let contactUsRequest: ContactUsRequest = new ContactUsRequest(contactUsDTO);

        return this.httpUtil.postRequest<void>(UrlConstants.APP_BASE_URL_COMMON + '/contact-us', contactUsRequest, null);
    }

}