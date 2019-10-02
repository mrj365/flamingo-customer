import { environment } from 'environments/environment';
import { OrderCustomizationComponentComponent } from './../order-customization-component/order-customization-component.component';
import { OrderCustomizationsComponent } from './../order-customizations/order-customizations.component';
import { UserOrderCustomizationDTO } from './../../_models/dto/user-order-customization-dto';
import { UserOrderCustomizationItemsDTO } from './../../_models/dto/user-order-customization-items-dto';
import { UserOrderCustomizationGroupResultViewDTO } from './../../_models/view/user-order-customization-group-result-view-dto';
import { BeanUtils } from './../../_util/BeanUtils';
import { UserOrderCustomizationGroupListResultViewDTO } from './../../_models/view/user-order-customization-group-list-result-view-dto';
import { AddPaymentMethodForm } from './../add-card/add-payment-method-form';
import { CheckoutViewDTO } from './checkout-view-dto';
import { UserPaymentMethodListResultDTO } from './../../_models/dto/user-payment-method-list-result-dto';
import { LocalStorageConstants } from './../../_models/constants/local-storage-constants';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { PopoverContent } from 'ngx-popover';
import { Popover } from 'ngx-popover';
import { UserPaymentMethodService } from './../../_services/user-payent-method.service';
import { UserService } from './../../_services/user.service';
import { GoogleMapsUtil } from './../../_util/google-maps-util';
import { MapLocationDTO } from './../../_models/dto/map-location-dto';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { MapsAPILoader } from 'angular2-google-maps/core';
import {
  AgmCoreModule
} from 'angular2-google-maps/core';
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ShoppingCartService } from '../../_services/shopping-cart.service';
import { ImageService } from '../../_services/image.service';
import { GooglePlaceConstants } from '../../_models/constants/google-place-constants';
import { ShoppingCartCompleteOrderResultDTO } from '../../_models/dto/shopping-cart-complete-order-result-dto';
import { Subscription } from 'rxjs/Subscription';
import { ApplyGiftCardDTO } from '../../_models/dto/apply-gift-card-dto';
import { GiftCardService } from '../../_services/gift-card.service';
import { MyGiftApplyModalComponent } from '../my-gift-apply-modal/my-gift-apply-modal.component';
import * as moment from 'moment';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: [
        './checkout.component.css'
  ]
})
export class CheckoutComponent implements OnInit {

  public lat: number = 25.804071;
  public lng: number = -80.124663;
  public zoom: number = 17;
  public styles: any;
  public orderComplete = false;
  public platformName = environment.platformName;
  public showEstimatedCost = !environment.pickupProfile;
  public pickupProfile = environment.pickupProfile;
  public enableTimeSelection = environment.enableTimeSelection;
  
  /**
   * This will bind to the appointment note text field. 
   * If the user clicks save, the actual appointment note will be set
   */
  public tempAppointmentNote: string = '';
  public appointmentNote: string = '';
  
  @ViewChild('modalAddNote')
  public modalAddNote: ModalComponent;

  //public shoppingCartDTO: ShoppingCartDTO;
  public checkoutViewDTO: CheckoutViewDTO = new CheckoutViewDTO();


  public currentAddress: string = '';

  @ViewChild('searchSavedAddress')
  public searchElementRef: ElementRef;

  @ViewChild('modalEditLocation')
  public locationModalComponent: ModalComponent;

  /**
   * List of users payment methods
   */
  userPaymentMethodListResultDTO: UserPaymentMethodListResultDTO = new UserPaymentMethodListResultDTO();

  /**
   * The list of available payment options is hidden unless
   * The user tries to edit it. This controls when the
   * last of payment options is displayed
   */
  showCardSelectList: boolean = false;

  /**
   * The selected card should only display when not
   * editing the payment method
   */
  editingPaymentMethod: boolean = false;

  /**
   * The guid of the card selected for update
   */
  cardGuidSelectedForUpdate: string;

  /**
   * Processing add card
   */
  processingAddCard: boolean = false;

  /**
   * 
   */
  model: AddPaymentMethodForm;
  addPaymentMethodForm: NgForm;
  @ViewChild('addPaymentMethodForm') currentForm: NgForm;
  months: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years: string[] = [];
  currentYear = new Date().getFullYear();

  @ViewChild('addPaymentMethod')
  public addPaymentMethod: ModalComponent;

  subscription: Subscription;

  orderSubmitted: boolean = false;

    @ViewChild('orderCustomizationComponent') 
    public orderCustomizationsModal: OrderCustomizationComponentComponent;

    gcBalance: string = '0.00';

    @ViewChild('giftCardModal')
    giftCardModal: MyGiftApplyModalComponent;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private elementRef: ElementRef,
    private shoppingCartService: ShoppingCartService,
    private imageService: ImageService,
    private userService: UserService,
    private userPaymentMethodService: UserPaymentMethodService,
    private giftCardService: GiftCardService,
    private ngZone: NgZone,
    private router: Router) {
        let shoppingCartDTO = this.shoppingCartService.getShoppingCart();
        this.checkoutViewDTO = new CheckoutViewDTO(shoppingCartDTO);
        this.appointmentNote = shoppingCartDTO.note;
        this.lat = this.checkoutViewDTO.latitude;
        this.lng = this.checkoutViewDTO.longitude;

        this.model = new AddPaymentMethodForm();

        // Populate years
        let todaysDate = new Date();
        let thisYear = todaysDate.getFullYear();

        for(let i = 0; i <= 20; i++) {
            let numberYear = thisYear + i;
            this.years.push(numberYear + '');
        }

        this.model.month = this.months[0];
        this.model.year = this.years[0];

        this.styles = GooglePlaceConstants.GOOGLE_MAP_STYLE;

        // Set the users current location so it can be edited
        let mapLocationStr = this.currentAddress = localStorage.getItem(LocalStorageConstants.USER_ADDRESS);
        let mapLocationDTO: MapLocationDTO = JSON.parse(mapLocationStr);
        this.currentAddress = mapLocationDTO.formattedAddress;

        this.subscription = shoppingCartService.shippingCartUpdateResult$.subscribe(
        shoppingCart => {
           this.checkoutViewDTO = new CheckoutViewDTO(shoppingCart);
        });

        this.giftCardService.giftCardUpdateResult$.subscribe(() => {
          this.getbalance();
        });

        this.getbalance();
    }

  ngOnInit() {

  }

  getbalance() {
    this.giftCardService.getGiftCardsBalance().subscribe(balanceResult => {
      this.gcBalance = balanceResult.balance;
    });
  }

  ngAfterViewInit() {
      // Need to manually scroll to top of screen since
      // navigation is done through a sibling component
       window.scrollTo(0, 0);
       this.loadGooglePlaces();
   }

  openAddNoteModal() {
      this.tempAppointmentNote = this.appointmentNote;
      this.modalAddNote.open();
  }

  openGiftCardModal() {
    this.giftCardModal.open();
  }

  addAppointmentNote() {
      this.shoppingCartService.updateAppointmentNote(this.tempAppointmentNote).subscribe(
          () => {
            this.appointmentNote = this.tempAppointmentNote;
            this.modalAddNote.close();
          });
  }

      private loadGooglePlaces() {

        // load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
            if(this.searchElementRef){ //Don't add auto complete when auto complete is not shown

                let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                    types: ["address"]
                });

                autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {

                // get the place result
                let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                // verify result
                if (place.geometry === undefined || place.geometry === null) {
                    return;
                }

                let mapLocationDTO: MapLocationDTO = GoogleMapsUtil.parsePlaceToMapLocation(place);
                this.shoppingCartService.updateAppointmentAddress(mapLocationDTO).subscribe(() =>
                    {
                        this.lat = mapLocationDTO.latitude;
                        this.lng = mapLocationDTO.longitude;

                        this.checkoutViewDTO.address1 = mapLocationDTO.address1;
                        this.checkoutViewDTO.address2 = mapLocationDTO.address2;
                        this.checkoutViewDTO.city = mapLocationDTO.city;
                        this.checkoutViewDTO.state = mapLocationDTO.state;
                        this.checkoutViewDTO.zip = mapLocationDTO.zip;
                        this.checkoutViewDTO.latitude = mapLocationDTO.latitude;
                        this.checkoutViewDTO.longitude = mapLocationDTO.longitude;

                        this.locationModalComponent.close();
                    });
            });
          });
        } else {
          
        }
    });
  }

    openCreateSavedSearchAddressModal(name: string) {

        this.locationModalComponent.open();
    }

    resetSavedSearchAddresses() {
        this.removeSavedSearchAddresses();
        this.addHomeLocation();
        this.addWorkLocation();

        let elements = document.getElementsByClassName('pac-container');

        // if(elements && elements[0]) {
        //     (elements[0] as HTMLElement).style.display = 'block';
        //     (elements[0] as HTMLElement).style.width = '566px';
        //     (elements[0] as HTMLElement).style.position = 'absolute';
        //     (elements[0] as HTMLElement).style.left = '668px';
        //     (elements[0] as HTMLElement).style.top = '125px';
        // }
    }

    removeSavedSearchAddresses(){
        let elements = document.getElementsByClassName('pac-test');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    addHomeLocation(): string {
      let localUser = this.userService.getLocalUser();
      let htmlStr: string;

      if(localUser && localUser.savedSearchAddresses.length > 0) {
        for(let savedSearchAddress of localUser.savedSearchAddresses) {
          if (savedSearchAddress.name === 'Home') {
            setTimeout(() => {

            htmlStr = '<div id="are" class="pac-item pac-test" onmousedown="document.getElementById(\'homeClickCheckout\').click();"><span class="pac-icon-saved-search icon-airport"><i class="fa fa-lg fa-home" aria-hidden="true"></i></span><span class="pac-item-query"><span class="pac-matched"></span>' + 'Home' + '</span> <span>' + savedSearchAddress.address1 + '</span></div>';

              //let pacContainer = document.querySelector('.pac-container');
              let pacContainers = document.getElementsByClassName('pac-container');

              if (pacContainers) {
                pacContainers[0].insertAdjacentHTML('afterbegin', htmlStr);
              }
            }, 1);
          }
        }
      }
      
      return htmlStr;
    }

  addWorkLocation(): string {
    let localUser = this.userService.getLocalUser();
    let htmlStr: string;

    if(localUser && localUser.savedSearchAddresses.length > 0) {
      for(let savedSearchAddress of localUser.savedSearchAddresses) {
        if (savedSearchAddress.name === 'Work') {
          setTimeout(() => {

          htmlStr = '<div id="are" class="pac-item pac-test" onmousedown="document.getElementById(\'workClickCheckout\').click();"><span class="pac-icon-saved-search icon-airport"><i class="fa fa-lg fa-suitcase" aria-hidden="true"></i></span><span class="pac-item-query"><span class="pac-matched"></span>' + 'Work' + '</span> <span>' + savedSearchAddress.address1 + '</span></div>';

            //let pacContainer = document.querySelector('.pac-container');
            let pacContainers = document.getElementsByClassName('pac-container');

            if (pacContainers) {
                pacContainers[0].insertAdjacentHTML('afterbegin', htmlStr);
              }
          }, 1);
        }
      }
    }
    
    return htmlStr;
  }

    searchHomeSavedAddress() {
        let localUser = this.userService.getLocalUser();

        if(localUser && localUser.savedSearchAddresses.length > 0) {
        for(let savedSearchAddress of localUser.savedSearchAddresses) {
            if (savedSearchAddress.name === 'Home') {
                

            let mapLocationDTO: MapLocationDTO = new MapLocationDTO();
            mapLocationDTO.address1 = savedSearchAddress.address1;
            mapLocationDTO.address2 = savedSearchAddress.address2;
            mapLocationDTO.city = savedSearchAddress.city;
            mapLocationDTO.state = savedSearchAddress.state;
            mapLocationDTO.zip = savedSearchAddress.zip;
            mapLocationDTO.latitude = savedSearchAddress.latitude;
            mapLocationDTO.longitude = savedSearchAddress.longitude;
            
            this.shoppingCartService.updateAppointmentAddress(mapLocationDTO).subscribe(() =>
                    {
                        this.lat = mapLocationDTO.latitude;
                        this.lng = mapLocationDTO.longitude;

                        this.checkoutViewDTO.address1 = mapLocationDTO.address1;
                        this.checkoutViewDTO.address2 = mapLocationDTO.address2;
                        this.checkoutViewDTO.city = mapLocationDTO.city;
                        this.checkoutViewDTO.state = mapLocationDTO.state;
                        this.checkoutViewDTO.zip = mapLocationDTO.zip;
                        this.checkoutViewDTO.latitude = mapLocationDTO.latitude;
                        this.checkoutViewDTO.longitude = mapLocationDTO.longitude;

                        this.currentAddress = this.checkoutViewDTO.getFormattedAddress();

                        this.locationModalComponent.close();
                    });
                }
            }
        }
    }

  searchWorkSavedAddress() {
    let localUser = this.userService.getLocalUser();

    if(localUser && localUser.savedSearchAddresses.length > 0) {
      for(let savdSearchAddress of localUser.savedSearchAddresses) {
        if (savdSearchAddress.name === 'Work') {
         let mapLocationDTO: MapLocationDTO = new MapLocationDTO();
            mapLocationDTO.address1 = savdSearchAddress.address1;
            mapLocationDTO.address2 = savdSearchAddress.address2;
            mapLocationDTO.city = savdSearchAddress.city;
            mapLocationDTO.state = savdSearchAddress.state;
            mapLocationDTO.zip = savdSearchAddress.zip;
            mapLocationDTO.latitude = savdSearchAddress.latitude;
            mapLocationDTO.longitude = savdSearchAddress.longitude;
            
            this.shoppingCartService.updateAppointmentAddress(mapLocationDTO).subscribe(() =>
                    {
                        this.lat = mapLocationDTO.latitude;
                        this.lng = mapLocationDTO.longitude;

                        this.checkoutViewDTO.address1 = mapLocationDTO.address1;
                        this.checkoutViewDTO.address2 = mapLocationDTO.address2;
                        this.checkoutViewDTO.city = mapLocationDTO.city;
                        this.checkoutViewDTO.state = mapLocationDTO.state;
                        this.checkoutViewDTO.zip = mapLocationDTO.zip;
                        this.checkoutViewDTO.latitude = mapLocationDTO.latitude;
                        this.checkoutViewDTO.longitude = mapLocationDTO.longitude;

                        this.currentAddress = this.checkoutViewDTO.getFormattedAddress();

                        this.locationModalComponent.close();
                    });
                }
            }
        }

    }

    editPaymentMethod() {

        this.userPaymentMethodService.getUserCards()
        .subscribe(userPaymentMethodListResultDTO => {
          this.userPaymentMethodListResultDTO = userPaymentMethodListResultDTO;

          if(userPaymentMethodListResultDTO.paymentMethods.length != 0) {
            this.showCardSelectList = true;
            this.editingPaymentMethod = true;
          }
          
          for(let paymentMethod of userPaymentMethodListResultDTO.paymentMethods){
            if (this.shoppingCartService.getShoppingCart().paymentMethodGuid) {
                this.cardGuidSelectedForUpdate = this.shoppingCartService.getShoppingCart().paymentMethodGuid;
            }
            if (!this.shoppingCartService.getShoppingCart().paymentMethodGuid && paymentMethod.preferred) {
                this.cardGuidSelectedForUpdate = paymentMethod.guid;
            }
          }

          if(userPaymentMethodListResultDTO.paymentMethods.length == 0) {
                this.showCardSelectList = true;
                this.editingPaymentMethod = false;
                this.openAddPaymentMethod();
          }
        });
        
    }

    formatPaymentMethodTypeStr(paymentMethodType: string): string {
        if (paymentMethodType) {
            paymentMethodType = paymentMethodType.toLowerCase();
            paymentMethodType = paymentMethodType.charAt(0).toUpperCase() + paymentMethodType.slice(1);
        }
      return paymentMethodType;
    }

    /**
     * formats
     * @param expirationDate 
     */
    formatExpirationDate(expirationDate: string): string {
        expirationDate = expirationDate.substr(4, 6) + '/' + expirationDate.substr(0, 4);
        return expirationDate;
    }

    cancelEditPaymentMethd() {
        this.editingPaymentMethod = false;
    }

    continueUpdatePaymentMethod() {
        // alert(this.cardGuidSelectedForUpdate);
        this.shoppingCartService.updatePaymentMethod(this.cardGuidSelectedForUpdate).subscribe(() =>
            {
                this.editingPaymentMethod = false;
            });
    }

    setCardGuidForUpdate(guid: string) {
        this.cardGuidSelectedForUpdate = guid;
    }

    setCardGuidForUpdateMobile(guid: string) {
        this.cardGuidSelectedForUpdate = guid;
        this.continueUpdatePaymentMethod();
    }


    // https://forums.meteor.com/t/solution-for-ui-not-update-have-to-click-somewhere-router-not-work/25781
  getCardData(valid) {
    if (valid) {
        this.processingAddCard = true;
      this.userPaymentMethodService.createPaymentMethod(this.model.number, this.model.month, this.model.year, this.model.cvv)
      .subscribe( guid => {
          this.ngZone.run(() => {
          this.processingAddCard = false;
          this.addPaymentMethod.close();
          this.editingPaymentMethod = false;
          this.updateNewPaymentMethod(guid);
        });
      }, error => {
        this.processingAddCard = false;
      });
    } else {
      this.validateForm();
    }
  }

  updateNewPaymentMethod(guid: string) {
      this.cardGuidSelectedForUpdate = guid;
      this.shoppingCartService.updatePaymentMethod(this.cardGuidSelectedForUpdate).subscribe(() =>
            {
                this.editingPaymentMethod = false;
                this.addPaymentMethod.close();
                this.editingPaymentMethod = false;
            });
  }

  validateForm() {
      this.addPaymentMethodForm = this.currentForm;

      const form = this.addPaymentMethodForm.form;

      for (const field in this.formErrors) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && !control.valid) {
          const messages = this.validationMessages[field];

          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }

    formErrors = {
        'number': '',
        'cvv': ''
    };

    validationMessages = {
        'number': {
            'required': 'Card number is required.'
        },
        'cvv': {
            'required': 'CVV is required.',
            'maxlength': 'The maximum length of the CVV is 4 digits.'
        }
    };

    openAddPaymentMethod() {
        this.addPaymentMethod.open();
    }

    completeOrder() {
        this.orderSubmitted = true;
        this.shoppingCartService.completeOrder().subscribe(shoppingCartCompleteOrderResultDTO =>
        {
            this.orderComplete = true;
            bootbox.alert('Your order has been placed! Your card on file will NOT be charged until your order is laundered, weighed, prepared for return and the proper total is determined upon completion! Thank you for choosing ' + this.platformName + '!',
                () => {
                    this.router.navigateByUrl('/');
                });
        });
    }

    openCustomizations() {
        this.orderCustomizationsModal.openCustomizations();
    }

    getCheckoutDateFormatted(): string {
      // https://www.npmjs.com/package/dateformat
      let dateFormat = require('dateformat');
  
      if(this.checkoutViewDTO.appointmentDateAndTime){
        if(this.enableTimeSelection) {
          return this.checkoutViewDTO.appointmentDateAndTime;
        } else {
          return this.checkoutViewDTO.appointmentDate;
        }
      } else {
          return '';
      }
    }
}
