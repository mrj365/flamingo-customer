import { UserOrderCustomizationItemsDTO } from './../_models/dto/user-order-customization-items-dto';
import { UserOrderCustomizationGroupResultDTO } from './../_models/dto/user-order-customization-group-result-dto';
import { CalendarResultDTO } from './../_models/dto/date/calendar-result-dto';
import { ServiceQuantityRequest } from './../_models/request/service-quantity-request';
import { StorefrontAvailabilityResultDTO } from './../_models/dto/storefront-availability-result-dto';
import { AuthenticationService } from './authentication.service';
import { Subject } from 'rxjs/Subject';
import { ShoppingCartResponse } from './../_models/response/shopping-cart-response';
import { BeanUtils } from './../_util/BeanUtils';
import { ShoppingCartEntity } from './../_models/entity/shopping-cart-entity';
import { LocalStorageService } from './local-storage-service';
import { UserCredentialsEntity } from './../_models/entity/user-credentials-entity';
import { ShoppingCartDTO } from './../_models/dto/shopping-cart-dto';
import { UpdateShoppingCartServiceProviderRequest } from './../_models/request/update-shopping-cart-service-provider-request';
import { UpdateShoppingCartUpdateAddressRequest } from './../_models/request/update-shopping-cart-update-address-request';
import { UpdateShoppingCartPaymentMethod } from './../_models/request/update-shopping-cart-payment-method';
import { UpdateShoppingCartNoteRequest } from './../_models/request/update-shopping-cart-note-request';
import { UpdateShoppingCartAppointmentDateTimeRequest } from './../_models/request/update-shopping-cart-appointment-date-time-request';
import { SyncShoppingCartRequest } from './../_models/request/sync-shopping-cart-request';
import { MapLocationDTO } from './../_models/dto/map-location-dto';
import { ReserveAppointmentDTO } from './../_models/dto/reserve-appointment-dto';
import { LocalStorageConstants } from './../_models/constants/local-storage-constants';
import { HttpUtilService } from './http-util.service';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UserAddressEntity } from '../_models/entity/user-address-entity';
import { ShoppingCartCompleteOrderResponse } from '../_models/response/shopping-cart-complete-order-response';
import { ShoppingCartCompleteOrderResultDTO } from '../_models/dto/shopping-cart-complete-order-result-dto';
import { UrlConstants } from '../_models/constants/url-constants';
import { environment } from 'environments/environment';
import { ApplyGiftCardDTO } from 'app/_models/dto/apply-gift-card-dto';

@Injectable()
export class ShoppingCartService {

    //This will be used to announce when the shopping cart has been updated 
    private shoppingCartUpdateResultSource = new Subject<ShoppingCartDTO>();

    shippingCartUpdateResult$  = this.shoppingCartUpdateResultSource.asObservable();

    constructor(private httpUtil: HttpUtilService, private localStorageService: LocalStorageService, private authenticationService: AuthenticationService) {

        this.setShoppingCart();
    }

    announceCartUpdate(shoppingCartDTO: ShoppingCartDTO) {
        this.shoppingCartUpdateResultSource.next(shoppingCartDTO);
    }

    setShoppingCart() {
        if(this.authenticationService.isUserLoggedIn()) { // If the user is logged in, set their shopping cart
            this.httpUtil.getRequest<ShoppingCartResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/shopping-cart', null, null, true).subscribe(
                shoppingCartResponse => {
                    let shoppingCartEntity: ShoppingCartEntity = BeanUtils.copyProperties(new ShoppingCartEntity(), shoppingCartResponse);
                    let shoppingCartDTO: ShoppingCartEntity = BeanUtils.copyProperties(new ShoppingCartDTO(), shoppingCartEntity);
                    this.localStorageService.setItem(shoppingCartEntity);
                    this.announceCartUpdate(shoppingCartDTO);
                });
        } else { // If the user is not logged create a new local shopping cart of one doesn't exist
            let shoppingCartEntity: ShoppingCartEntity = this.localStorageService.getItem(ShoppingCartEntity);

            if (!shoppingCartEntity) {
                shoppingCartEntity = new ShoppingCartEntity();
                this.localStorageService.setItem(shoppingCartEntity);
                let shoppingCartDTO: ShoppingCartEntity = BeanUtils.copyProperties(new ShoppingCartDTO(), shoppingCartEntity);
                this.announceCartUpdate(shoppingCartDTO);
            }
        }
    }

    getShoppingCart(): ShoppingCartDTO {
        let shoppingCartEntity: ShoppingCartEntity =  this.localStorageService.getItem(ShoppingCartEntity);

        // If not shopping cart exists, create a new empty cart
        if (!shoppingCartEntity) {
            shoppingCartEntity = new ShoppingCartEntity();
            this.localStorageService.setItem(shoppingCartEntity);
        }

        let shoppingCartDTO: ShoppingCartDTO = BeanUtils.copyProperties(new ShoppingCartDTO(), shoppingCartEntity);

        return shoppingCartDTO;
    }

    addOrUpdateService(storefrontId: number, serviceId: number, quantity: number, serviceProviderId: number): Observable<ShoppingCartDTO> {
        let syncShoppingCartRequest: SyncShoppingCartRequest = new SyncShoppingCartRequest();
        let serviceQuantityRequest: ServiceQuantityRequest = new ServiceQuantityRequest();
        let userAddressEntity: UserAddressEntity = this.localStorageService.getItem(UserAddressEntity);
        let mapLocationDTO: MapLocationDTO = BeanUtils.copyProperties(new MapLocationDTO, userAddressEntity);
        let shoppingCartEntity: ShoppingCartEntity = this.localStorageService.getItem(ShoppingCartEntity);

        // Clear existing services if services are being added from a new storefront
        if( storefrontId !== shoppingCartEntity.storefrontId) {
            shoppingCartEntity.services = [];
        }

        syncShoppingCartRequest.storefrontId = storefrontId;
        syncShoppingCartRequest.serviceProviderId = serviceProviderId;
        syncShoppingCartRequest.address1 = mapLocationDTO.address1;
        syncShoppingCartRequest.address2 = mapLocationDTO.address2;
        syncShoppingCartRequest.city = mapLocationDTO.city;
        syncShoppingCartRequest.state = mapLocationDTO.state;
        syncShoppingCartRequest.zip = mapLocationDTO.zip;
        syncShoppingCartRequest.latitude = mapLocationDTO.latitude;
        syncShoppingCartRequest.longitude = mapLocationDTO.longitude;

        let serviceUpdated: boolean = false; 

        for (let service of shoppingCartEntity.services) {
            if (service.id === serviceId) {
                service.quantity = quantity;
                serviceUpdated = true;
            }
            let serviceQuantityRequest: ServiceQuantityRequest = new ServiceQuantityRequest();
            serviceQuantityRequest.serviceId = service.id;
            serviceQuantityRequest.quantity = service.quantity;
            syncShoppingCartRequest.services.push(serviceQuantityRequest);
        }

        if (!serviceUpdated) {
            serviceQuantityRequest.serviceId = serviceId;
            serviceQuantityRequest.quantity = quantity;
            syncShoppingCartRequest.services.push(serviceQuantityRequest);
        }

        return this.httpUtil.postRequest<ShoppingCartDTO>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/shopping-cart/sync',
            syncShoppingCartRequest, null, true).map(
            shoppingCartDTO => {
                localStorage.setItem(LocalStorageConstants.SHOPPING_CART_KEY, JSON.stringify(shoppingCartDTO));
                this.announceCartUpdate(shoppingCartDTO);
                return shoppingCartDTO;
            });
    }

    addPickupService(storefrontId: number): Observable<ShoppingCartDTO> {
        let syncShoppingCartRequest: SyncShoppingCartRequest = new SyncShoppingCartRequest();
        let serviceQuantityRequest: ServiceQuantityRequest = new ServiceQuantityRequest();
        let userAddressEntity: UserAddressEntity = this.localStorageService.getItem(UserAddressEntity);
        let mapLocationDTO: MapLocationDTO = BeanUtils.copyProperties(new MapLocationDTO, userAddressEntity);
        let shoppingCartEntity: ShoppingCartEntity = this.localStorageService.getItem(ShoppingCartEntity);

        syncShoppingCartRequest.storefrontId = storefrontId;
        syncShoppingCartRequest.address1 = mapLocationDTO.address1;
        syncShoppingCartRequest.address2 = mapLocationDTO.address2;
        syncShoppingCartRequest.city = mapLocationDTO.city;
        syncShoppingCartRequest.state = mapLocationDTO.state;
        syncShoppingCartRequest.zip = mapLocationDTO.zip;
        syncShoppingCartRequest.latitude = mapLocationDTO.latitude;
        syncShoppingCartRequest.longitude = mapLocationDTO.longitude;

        return this.httpUtil.postRequest<ShoppingCartDTO>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/shopping-cart/sync',
            syncShoppingCartRequest, null, true).map(
            shoppingCartDTO => {
                localStorage.setItem(LocalStorageConstants.SHOPPING_CART_KEY, JSON.stringify(shoppingCartDTO));
                this.announceCartUpdate(shoppingCartDTO);
                return shoppingCartDTO;
            });
    }

    removeService(storefrontId: number, serviceId: number): Observable<ShoppingCartDTO> {
        //If cart is empty, do nothing
        if (this.isCartEmpty()) {
            return Observable.of(this.getShoppingCart());
        }

        let syncShoppingCartRequest: SyncShoppingCartRequest = new SyncShoppingCartRequest();
        let mapLocationDTOStr: string = localStorage.getItem(LocalStorageConstants.USER_ADDRESS);
        let mapLocationDTO: MapLocationDTO = JSON.parse(mapLocationDTOStr);

        syncShoppingCartRequest.storefrontId = storefrontId;

        let cartString: string = localStorage.getItem(LocalStorageConstants.SHOPPING_CART_KEY);
        let shoppingCart: ShoppingCartDTO =  JSON.parse(cartString);

        // Check to see if this service is already in the cart. If it is, remove it
        for (let i = shoppingCart.services.length - 1; i >= 0; i--) {
            if (shoppingCart.services[i].id === serviceId) {
                shoppingCart.services.splice(i, 1);
            } else {
                let serviceQuantityRequest: ServiceQuantityRequest = new ServiceQuantityRequest();
                serviceQuantityRequest.serviceId = shoppingCart.services[i].id
                serviceQuantityRequest.quantity = shoppingCart.services[i].quantity;
                syncShoppingCartRequest.services.push(serviceQuantityRequest);
            }
        }

        return this.httpUtil.postRequest<ShoppingCartResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/shopping-cart/sync', syncShoppingCartRequest, null, true).map(
            shoppingCartResponse => {
                let shoppingCartEntity: ShoppingCartEntity = BeanUtils.copyProperties(new ShoppingCartEntity(), shoppingCartResponse);
                this.localStorageService.setItem(shoppingCartEntity);

                let shoppingCartDTO: ShoppingCartDTO = BeanUtils.copyProperties(new ShoppingCartDTO(), shoppingCartResponse);
                this.announceCartUpdate(shoppingCartDTO);
                return shoppingCartDTO;
            });
    }

    updateAppointmentNote(note: string): Observable<ShoppingCartDTO> {
        let updateShoppingCartNoteRequest: UpdateShoppingCartNoteRequest = new UpdateShoppingCartNoteRequest(note);

        return this.httpUtil.putRequest<ShoppingCartResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/shopping-cart/note', updateShoppingCartNoteRequest, null, true).map(
            shoppingCartResponse => {
                let shoppingCartEntity: ShoppingCartEntity = BeanUtils.copyProperties(new ShoppingCartEntity(), shoppingCartResponse);
                this.localStorageService.setItem(shoppingCartEntity);

                let shoppingCartDTO: ShoppingCartDTO = BeanUtils.copyProperties(new ShoppingCartDTO(), shoppingCartResponse);
                this.announceCartUpdate(shoppingCartDTO);
                return shoppingCartDTO;
            });
    }

    updateAppointmentAddress(mapLocationDTO: MapLocationDTO): Observable<ShoppingCartDTO> {
        let updateShoppingCartUpdateAddressRequest: UpdateShoppingCartUpdateAddressRequest = new UpdateShoppingCartUpdateAddressRequest(mapLocationDTO);

        return this.httpUtil.putRequest<ShoppingCartResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/shopping-cart/address', updateShoppingCartUpdateAddressRequest, null, true).map(
            shoppingCartResponse => {
                let shoppingCartEntity: ShoppingCartEntity = BeanUtils.copyProperties(new ShoppingCartEntity(), shoppingCartResponse);
                this.localStorageService.setItem(shoppingCartEntity);

                let shoppingCartDTO: ShoppingCartDTO = BeanUtils.copyProperties(new ShoppingCartDTO(), shoppingCartResponse);
                this.announceCartUpdate(shoppingCartDTO);
                return shoppingCartDTO;
            });
    }

    updatePaymentMethod(guid: string): Observable<ShoppingCartDTO> {
        let updateShoppingCartPaymentMethod: UpdateShoppingCartPaymentMethod = new UpdateShoppingCartPaymentMethod(guid);

        return this.httpUtil.putRequest<ShoppingCartResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/shopping-cart/payment-method', updateShoppingCartPaymentMethod, null, true).map(
            shoppingCartResponse => {
                let shoppingCartEntity: ShoppingCartEntity = BeanUtils.copyProperties(new ShoppingCartEntity(), shoppingCartResponse);
                this.localStorageService.setItem(shoppingCartEntity);

                let shoppingCartDTO: ShoppingCartDTO = BeanUtils.copyProperties(new ShoppingCartDTO(), shoppingCartResponse);
                this.announceCartUpdate(shoppingCartDTO);
                return shoppingCartDTO;
            });
    }

    /**
     * If the order has already been started send the request to update the service provider
     * If not, just store the service provider locally until a service is added to the cart 
     * which will start an order
     * 
     * @param serviceProviderId 
     */
    setServiceProvider(serviceProviderId: number): Observable<ShoppingCartDTO> {
        let shoppingCartDTO: ShoppingCartDTO = this.getShoppingCart();
        let updateShoppingCartServiceProviderRequest: UpdateShoppingCartServiceProviderRequest = new UpdateShoppingCartServiceProviderRequest(serviceProviderId);

        if(shoppingCartDTO.orderId) {
            return this.httpUtil.putRequest<ShoppingCartResponse>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/shopping-cart/service-provider', updateShoppingCartServiceProviderRequest, null, true).map(
            shoppingCartResponse => {
                let shoppingCartEntity: ShoppingCartEntity = BeanUtils.copyProperties(new ShoppingCartEntity(), shoppingCartResponse);
                this.localStorageService.setItem(shoppingCartEntity);

                shoppingCartDTO = BeanUtils.copyProperties(new ShoppingCartDTO(), shoppingCartResponse);
                this.announceCartUpdate(shoppingCartDTO);
                return shoppingCartDTO;
            });
        } else {
            //Store the service provider id locally until a service is added
            let shoppingCartEntity: ShoppingCartEntity = this.localStorageService.getItem(ShoppingCartEntity);
            shoppingCartEntity.serviceProviderId = serviceProviderId;
            this.localStorageService.setItem(shoppingCartEntity);
            shoppingCartDTO = BeanUtils.copyProperties(new ShoppingCartDTO(), shoppingCartEntity);

            return Observable.of(shoppingCartDTO)
        }
    }

    completeOrder(): Observable<ShoppingCartCompleteOrderResultDTO> {
        return this.httpUtil.postRequest<ShoppingCartCompleteOrderResultDTO>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/shopping-cart/complete-checkout', null, null, true).map(
            shoppingCartCompleteOrderResponse => {
                // let shoppingCartEntity: ShoppingCartEntity = BeanUtils.copyProperties(new ShoppingCartEntity(), shoppingCartResponse);
                // this.localStorageService.setItem(shoppingCartEntity);

                let shoppingCartCompleteOrderResultDTO: ShoppingCartCompleteOrderResultDTO = 
                    BeanUtils.copyProperties(new ShoppingCartCompleteOrderResultDTO(), shoppingCartCompleteOrderResponse);
                
                let shoppingCartEntity: ShoppingCartEntity = new ShoppingCartEntity();
                this.localStorageService.setItem(shoppingCartEntity);
                let shoppingCartDTO: ShoppingCartDTO = BeanUtils.copyProperties(new ShoppingCartDTO(), shoppingCartEntity);
                
                this.announceCartUpdate(shoppingCartDTO);
                return shoppingCartCompleteOrderResultDTO;
            });
    }

    isCartEmpty(): boolean {
        let cartEmpty = false;

        let shoppingCartEntity: ShoppingCartEntity = this.localStorageService.getItem(ShoppingCartEntity);

        if (!shoppingCartEntity) {
            cartEmpty = true;
        } else {
            if (shoppingCartEntity.services.length === 0) {
                cartEmpty = true;
            }
        }

        return cartEmpty;
    }

    serviceExistsInCart(serviceId: number): boolean {
        let shoppingCartEntity: ShoppingCartEntity = this.localStorageService.getItem(ShoppingCartEntity);
        let serviceAlreadyInCart = false;

        if (!shoppingCartEntity) {
            return false;
        }

        for (let service of shoppingCartEntity.services) {
            if (service.id === serviceId) {
                serviceAlreadyInCart = true;
            }
        }

        return serviceAlreadyInCart;
    }

    getSubtotal() {
        let subtotal: number = 0.00;

        let shoppingCartEntity: ShoppingCartEntity = this.localStorageService.getItem(ShoppingCartEntity);

        for(let service of shoppingCartEntity.services){
            subtotal += +service.price;
        }

        return subtotal;
    }

    getServiceIds() {
        let serviceIds: number[] = [];

        let shoppingCartEntity: ShoppingCartEntity = this.localStorageService.getItem(ShoppingCartEntity);

        for(let service of shoppingCartEntity.services){
            serviceIds.push(service.id);
        }

        return serviceIds;
    }

    setAppointmentDateAndTime(appointmentDateAndTime: string, reoccurringPeriod: string): Observable<ShoppingCartDTO> {

        let updateShoppingCartAppointmentDateTimeRequest: UpdateShoppingCartAppointmentDateTimeRequest = new UpdateShoppingCartAppointmentDateTimeRequest();
        updateShoppingCartAppointmentDateTimeRequest.appointmentDateTime = appointmentDateAndTime;
        updateShoppingCartAppointmentDateTimeRequest.reoccurringPeriod = reoccurringPeriod;

        let credentials: UserCredentialsEntity = this.localStorageService.getItem(UserCredentialsEntity);
        return this.httpUtil.putRequest<ShoppingCartResponse>(UrlConstants.APP_BASE_URL + '/users/' + credentials.uniqueId + '/shopping-cart/date-time', updateShoppingCartAppointmentDateTimeRequest, null, true).map(
            shoppingCartResponse => {
                let shoppingCartEntity: ShoppingCartEntity = BeanUtils.copyProperties(new ShoppingCartEntity(), shoppingCartResponse);
                this.localStorageService.setItem(shoppingCartEntity);

                let shoppingCartDTO: ShoppingCartDTO = BeanUtils.copyProperties(new ShoppingCartDTO(), shoppingCartResponse);
                this.announceCartUpdate(shoppingCartDTO);
                return shoppingCartDTO;
            });
    }

    /**
     * Update shoppoing card with information about the reserved appointment
     * @param reservedAppointmentDTO 
     */
    updateShoppingCardWithReservedAppointment(reservedAppointmentDTO: ReserveAppointmentDTO) {

        let shoppingCartEntity: ShoppingCartEntity = this.localStorageService.getItem(ShoppingCartEntity);

        shoppingCartEntity.orderId = reservedAppointmentDTO.orderId;
        shoppingCartEntity.appointmentId = reservedAppointmentDTO.appointmentId;
        shoppingCartEntity.storefrontDisplayName = reservedAppointmentDTO.storefrontDisplayName;
        shoppingCartEntity.address1 = reservedAppointmentDTO.address1;
        shoppingCartEntity.address2 = reservedAppointmentDTO.address2;
        shoppingCartEntity.city = reservedAppointmentDTO.city;
        shoppingCartEntity.state = reservedAppointmentDTO.state;
        shoppingCartEntity.zip = reservedAppointmentDTO.zip;
        shoppingCartEntity.latitude = reservedAppointmentDTO.latitude;
        shoppingCartEntity.longitude = reservedAppointmentDTO.longitude;

        shoppingCartEntity.paymentMethodGuid = reservedAppointmentDTO.paymentMethodGuid;
        shoppingCartEntity.paymentMethodLast4 = reservedAppointmentDTO.paymentMethodLast4;

        shoppingCartEntity.subtotal = reservedAppointmentDTO.subtotal;
        shoppingCartEntity.bookingFee = reservedAppointmentDTO.bookingFee;
        shoppingCartEntity.tax = reservedAppointmentDTO.tax;
        shoppingCartEntity.total = reservedAppointmentDTO.total;

        this.localStorageService.setItem(shoppingCartEntity);

    }

    getAvailableTimeSlots(serviceProviderId: number, serviceDateStart: Date, serviceDateEnd: Date,
        mobile: boolean, slotsNeeded: number, reservedAppointmentId: number): Observable<StorefrontAvailabilityResultDTO> {

        let params: URLSearchParams = new URLSearchParams();
        params.set('service-provider-id', serviceProviderId + '');
        params.set('start-date', this.getFormattedDate(serviceDateStart));
        params.set('end-date', this.getFormattedDate(serviceDateEnd));

        let credentials: UserCredentialsEntity = this.localStorageService.getItem(UserCredentialsEntity);
        return this.httpUtil.getRequest<StorefrontAvailabilityResultDTO>(UrlConstants.APP_BASE_URL + '/users/' + credentials.uniqueId 
            + '/shopping-cart/availability', params, null, true);
    }

    getFormattedAvailableTimeSlots(offset: number, reoccurringPeriod): Observable<CalendarResultDTO> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('offset', offset + '');
        params.set('reoccurring-period', reoccurringPeriod);

        return this.httpUtil.getRequest<CalendarResultDTO>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/shopping-cart/availability-seach', params, null, true);
    }

    /**
     * Formats date to formate yyyy-MM-dd
     */
    private getFormattedDate(date: Date): string {
        return date.getFullYear() + '-' + this.formateNumberTo2Digit(date.getMonth() + 1)  + '-' + this.formateNumberTo2Digit(date.getDate());
    }

    private formateNumberTo2Digit(num: number): string {
        return ('0' + num).slice(-2);
    }

    getCustomizations(): Observable<UserOrderCustomizationGroupResultDTO> {

        return this.httpUtil.getRequest<UserOrderCustomizationGroupResultDTO>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/shopping-cart/customizations', null, null, true)
    }

    updateCustomizations(customizationItmes: UserOrderCustomizationItemsDTO): Observable<ShoppingCartDTO> {
        return this.httpUtil.postRequest<ShoppingCartDTO>
            (UrlConstants.APP_BASE_URL + '/users/{unique-id}/shopping-cart/customizations', customizationItmes, null, true).map(
            shoppingCartResponse => {
                let shoppingCartEntity: ShoppingCartEntity = BeanUtils.copyProperties(new ShoppingCartEntity(), shoppingCartResponse);
                this.localStorageService.setItem(shoppingCartEntity);

                let shoppingCartDTO: ShoppingCartDTO = BeanUtils.copyProperties(new ShoppingCartDTO(), shoppingCartResponse);
                this.announceCartUpdate(shoppingCartDTO);
                return shoppingCartDTO;
            });
        
    }

    public applyGiftCardToShoppingCart(applyGiftCardDTO: ApplyGiftCardDTO): Observable<ShoppingCartDTO> {
        return this.httpUtil
            .postRequest<ShoppingCartDTO>(UrlConstants.APP_BASE_URL + '/users/{unique-id}/shopping-cart/apply-gift-card-balance', applyGiftCardDTO, null, true).map(shoppingCartResponse => {
                let shoppingCartEntity: ShoppingCartEntity = BeanUtils.copyProperties(new ShoppingCartEntity(), shoppingCartResponse);
                this.localStorageService.setItem(shoppingCartEntity);

                let shoppingCartDTO: ShoppingCartDTO = BeanUtils.copyProperties(new ShoppingCartDTO(), shoppingCartResponse);
                this.announceCartUpdate(shoppingCartDTO);
                return shoppingCartDTO;
            });
    }

    /**
     * Because the shopping cart is stored locally and the gift card is added to the order through an event on the back end
     * it the gift card needs to be added to the order manually on the front end
     */
    public applyGiftCardToLocalShoppingCart(): void {
        let shoppingCartEntity: ShoppingCartEntity = this.localStorageService.getItem(ShoppingCartEntity);

        if (shoppingCartEntity) {
            shoppingCartEntity.applyGiftCardBalance = true;
            this.localStorageService.setItem(shoppingCartEntity);
            let shoppingCartDTO: ShoppingCartEntity = BeanUtils.copyProperties(new ShoppingCartDTO(), shoppingCartEntity);
            this.announceCartUpdate(shoppingCartDTO);
        }
    }
}
