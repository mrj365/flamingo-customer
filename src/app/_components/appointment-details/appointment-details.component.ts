import { BeanUtils } from './../../_util/BeanUtils';
import { environment } from 'environments/environment';
import { UUIDUtil } from './../../_util/uuid-util';
import { UserAppointmentService } from './../../_services/user-appointment.service.service';
import { AddPaymentMethodForm } from './../add-card/add-payment-method-form';
import { AppointmentDetailsViewDTO } from './appointment-details-view-dto';
import { UserPaymentMethodListResultDTO } from './../../_models/dto/user-payment-method-list-result-dto';
import { LocalStorageConstants } from './../../_models/constants/local-storage-constants';
import { Router, ActivatedRoute } from '@angular/router';
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
import { AppointmentUpdateConstants } from 'app/_models/constants/appointment-update-constants';
import { MyGiftApplyModalComponent } from '../my-gift-apply-modal/my-gift-apply-modal.component';
import { GiftCardService } from '../../_services/gift-card.service';
import * as moment from 'moment';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.css']
})
export class AppointmentDetailsComponent implements OnInit {

  public lat: number = 25.804071;
  public lng: number = -80.124663;
  public zoom: number = 17;
  public styles: any;

  public appointmentId = 0;
  public checkoutViewDTO = new AppointmentDetailsViewDTO();

  /**
   * This will bind to the appointment note text field. 
   * If the user clicks save, the actual appointment note will be set
   */
  public tempAppointmentNote: string = '';
  public appointmentNote: string = '';
  
  @ViewChild('modalAddNote')
  public modalAddNote: ModalComponent;

  // public currentAddress: string = '';
  // public currentAddressTemp: string = '';
  public toMapLocationDTO: MapLocationDTO = new MapLocationDTO();
  public toMapLocationDTOTemp: MapLocationDTO = new MapLocationDTO();

  @ViewChild('searchSavedAddress')
  public searchElementRef: ElementRef;

  @ViewChild('modalEditLocation')
  public locationModalComponent: ModalComponent;

  public paymentMethodUpdateSubmitted: boolean = false;

  @ViewChild('modalEditCustomizations')
  public customizationsModalComponent: ModalComponent;

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

  showCancelButton = true;

  cancelOrderSubmitted: boolean = false;

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

  destSubscription: Subscription;

  @ViewChild('giftCardModal')
  giftCardModal: MyGiftApplyModalComponent;

  gcBalance: string = '0.00';

  estimatedTotal: boolean = false;
  showEditGiftCardSection: boolean = false;

  enableTimeSelection = environment.enableTimeSelection;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private elementRef: ElementRef,
    private imageService: ImageService,
    private userAppointmentService: UserAppointmentService,
    private userService: UserService,
    private userPaymentMethodService: UserPaymentMethodService,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private giftCardService: GiftCardService) {

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

         this.destSubscription = this.toMapLocationDTO.locationEvent$.subscribe(
            destMapLocation => {
              this.confirmUpdateAddress(this.toMapLocationDTO);
          });

        // Refresh the appointment when there is a change to a gift card
        this.userAppointmentService.giftCardUpdateResult$.subscribe(() => {
          this.loadApt();
          this.getbalance();
        });


        this.loadApt();

        this.getbalance();

    }

    getbalance() {
      this.giftCardService.getGiftCardsBalance().subscribe(balanceResult => {
        this.gcBalance = balanceResult.balance;
      });
    }

    loadApt() {
       // Get the baseId from the url
        this.route.params.subscribe(params => {
          this.appointmentId = +params['id']; // (+) converts string 'id' to a number

          this.userAppointmentService.getUserAppointment(this.appointmentId).subscribe(appointmentDetailsResultDTO => {
            this.checkoutViewDTO = new AppointmentDetailsViewDTO(appointmentDetailsResultDTO);
            this.appointmentNote = this.checkoutViewDTO.note;

            this.toMapLocationDTO.address1 = this.checkoutViewDTO.address1;
            this.toMapLocationDTO.address2 = this.checkoutViewDTO.address2;
            this.toMapLocationDTO.city = this.checkoutViewDTO.city;
            this.toMapLocationDTO.state = this.checkoutViewDTO.state;
            this.toMapLocationDTO.zip = this.checkoutViewDTO.zip;
            this.toMapLocationDTO.latitude = this.checkoutViewDTO.latitude;
            this.toMapLocationDTO.longitude = this.checkoutViewDTO.longitude;
            this.toMapLocationDTO.formattedAddress = this.checkoutViewDTO.getFormattedAddress();

            // Backup the map location
            MapLocationDTO.copyMapToMap(this.toMapLocationDTO, this.toMapLocationDTOTemp);

            // Set position for map
            this.lat = this.checkoutViewDTO.latitude;
            this.lng = this.checkoutViewDTO.longitude;

            // this.currentAddress = this.checkoutViewDTO.getFormattedAddress();
            // this.currentAddressTemp = this.checkoutViewDTO.getFormattedAddress();
            this.determineShowCancelBtn();
            this.checkEstimatedTotal();
            this.determineShowGiftCardSection();
          })
        });
    }

  ngOnInit() {

  }

  determineShowCancelBtn() {
    if(this.checkoutViewDTO.status === 'CANCELLED_BY_USER') {
      this.showCancelButton = false;
    } else if (this.checkoutViewDTO.status === 'CANCELLED_BY_SERVICE_PROVIDER_SP_UNAVAILABLE') {
      this.showCancelButton = false;
    } else if (this.checkoutViewDTO.status === 'CANCELLED_BY_SERVICE_PROVIDER_CUSTOMER_NO_SHOW') {
      this.showCancelButton = false;
    } else if (this.checkoutViewDTO.status === 'PAYMENT_ERROR') {
      this.showCancelButton = false;
    } else if (this.checkoutViewDTO.status === 'IN_PROGRESS') {
      this.showCancelButton = false;
    } else if (this.checkoutViewDTO.status === 'COMPLETE') {
      this.showCancelButton = false;
    }
  }

  checkEstimatedTotal() {
    if(this.checkoutViewDTO.status === 'CANCELLED_BY_USER') {
      this.estimatedTotal = false;
    } else if (this.checkoutViewDTO.status === 'CANCELLED_BY_SERVICE_PROVIDER_SP_UNAVAILABLE') {
      this.estimatedTotal = false;
    } else if (this.checkoutViewDTO.status === 'CANCELLED_BY_SERVICE_PROVIDER_CUSTOMER_NO_SHOW') {
      this.estimatedTotal = false;
    } else if (this.checkoutViewDTO.status === 'PAYMENT_ERROR') {
      this.estimatedTotal = false;
    } else if (this.checkoutViewDTO.status === 'SCHEDULED') {
      this.estimatedTotal = true;
    } else if (this.checkoutViewDTO.status === 'IN_PROGRESS') {
      this.estimatedTotal = true;
    } else if (this.checkoutViewDTO.status === 'COMPLETE') {
      this.estimatedTotal = false;
    }
  }

  determineShowGiftCardSection() {
    if(this.checkoutViewDTO.status === 'SCHEDULED') {
      this.showEditGiftCardSection = true;
    } else if (this.checkoutViewDTO.status === 'PAYMENT_ERROR') {
      this.showEditGiftCardSection = true;
    }
  }

  ngAfterViewInit() {
      // Need to manually scroll to top of screen since
      // navigation is done through a sibling component
       window.scrollTo(0, 0);
       //this.loadGooglePlaces();
   }

  openAddNoteModal() {
      this.tempAppointmentNote = this.appointmentNote;
      this.modalAddNote.open();
  }

  addAppointmentNote() {
    if(this.checkoutViewDTO.reoccurring) {
      this.modalAddNote.close();

      let options: BootboxPromptOptions = {
        title: 'Update recurring appointment',
        value : AppointmentUpdateConstants.ONLY_THIS,
        inputType: 'select',
        callback: (result) => this.continueUpdateAppointmentNote(result),
        inputOptions: [
            {text: 'Update only this appointment', value: AppointmentUpdateConstants.ONLY_THIS},
            {text: 'Update this and following appointments', value: AppointmentUpdateConstants.THIS_AND_FUTURE},
            {text: 'Update all appointments in series', value: AppointmentUpdateConstants.ALL_IN_SERIES}
          ]
      };

      bootbox.prompt(options);
    } else {
      this.continueUpdateAppointmentNote(AppointmentUpdateConstants.ONLY_THIS);
    }
  }

  continueUpdateAppointmentNote(updateType: string) {

    if(!updateType) {
      return;
    }

    let idempotentUUID: string = UUIDUtil.generateUUID();

    this.userAppointmentService.updateAppointmentNote(this.appointmentId, this.tempAppointmentNote, updateType, idempotentUUID).subscribe(
          () => {
            this.appointmentNote = this.tempAppointmentNote;
            this.modalAddNote.close();
          });
    }

    openCreateSavedSearchAddressModal(name: string) {
      // Reset map
      MapLocationDTO.copyMapToMap(this.toMapLocationDTOTemp, this.toMapLocationDTO);
      this.locationModalComponent.open();
    }

    confirmUpdateAddress(mapLocationDTO: MapLocationDTO) {
      if(this.checkoutViewDTO.reoccurring) {
          this.locationModalComponent.close();

          let options: BootboxPromptOptions = {
            title: 'Update recurring appointment',
            value : AppointmentUpdateConstants.ONLY_THIS,
            inputType: 'select',
            callback: (result) => this.continueUpdateAddress(mapLocationDTO, result),
            inputOptions: [
              {text: 'Update only this appointment', value: AppointmentUpdateConstants.ONLY_THIS},
              {text: 'Update this and following appointments', value: AppointmentUpdateConstants.THIS_AND_FUTURE},
              {text: 'Update all appointments in series', value: AppointmentUpdateConstants.ALL_IN_SERIES}
              ]
          };

          bootbox.prompt(options);
        } else {
          this.continueUpdateAddress(mapLocationDTO, AppointmentUpdateConstants.ONLY_THIS);
        }
    }

    continueUpdateAddress(mapLocationDTO: MapLocationDTO, updateType: string) {

      let updateReoccurringSeries = false;

      if(!updateType) {
        MapLocationDTO.copyMapToMap(this.toMapLocationDTOTemp, this.toMapLocationDTO);
        return;
      }

      let idempotentUUID: string = UUIDUtil.generateUUID();

      this.userAppointmentService.updateAppointmentAddress(this.appointmentId, mapLocationDTO, updateType, idempotentUUID).subscribe(() =>
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

                        MapLocationDTO.copyMapToMap(mapLocationDTO, this.toMapLocationDTO);
                        MapLocationDTO.copyMapToMap(this.toMapLocationDTO, this.toMapLocationDTOTemp);

                        this.locationModalComponent.close();
                    });
    }
    

    editPaymentMethod() {
        this.showCardSelectList = true;
        this.editingPaymentMethod = true;

        this.userPaymentMethodService.getUserCards()
        .subscribe(userPaymentMethodListResultDTO => {
          this.userPaymentMethodListResultDTO = userPaymentMethodListResultDTO;
          this.cardGuidSelectedForUpdate = this.checkoutViewDTO.paymentMethodGuid;
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

    confirmUpdatePaymentMethod() {
      if(this.checkoutViewDTO.reoccurring) {

          let options: BootboxPromptOptions = {
            title: 'Update payment details for re-occurring appointment',
            value : AppointmentUpdateConstants.ONLY_THIS,
            inputType: 'select',
            callback: (result) => this.continueUpdatePaymentMethod(result),
            inputOptions: [
              {text: 'Update only this appointment', value: AppointmentUpdateConstants.ONLY_THIS},
              {text: 'Update this and following appointments', value: AppointmentUpdateConstants.THIS_AND_FUTURE},
              {text: 'Update all appointments in series', value: AppointmentUpdateConstants.ALL_IN_SERIES}
              ]
          };

          bootbox.prompt(options);
        } else {
          this.continueUpdatePaymentMethod(AppointmentUpdateConstants.ONLY_THIS);
        }
    }

    continueUpdatePaymentMethod(updateType: string) {

        if(!updateType) {
          this.cancelEditPaymentMethd();
          return;
        }

        this.paymentMethodUpdateSubmitted = true;
        let uuid: string = UUIDUtil.generateUUID();

        this.userAppointmentService.updateAppointmentPaymentMethod(this.appointmentId, this.cardGuidSelectedForUpdate, uuid, updateType).subscribe(() =>
            {
                this.editingPaymentMethod = false;
                this.paymentMethodUpdateSubmitted = false;

                 for(let userPaymentMethodResultDTO of this.userPaymentMethodListResultDTO.paymentMethods) {
                  if(this.cardGuidSelectedForUpdate === userPaymentMethodResultDTO.guid) {
                    this.checkoutViewDTO.paymentMethodGuid = userPaymentMethodResultDTO.guid;
                    this.checkoutViewDTO.paymentMethodLast4 = userPaymentMethodResultDTO.lastFour;
                    this.checkoutViewDTO.paymentMethodType = userPaymentMethodResultDTO.paymentMethodType;
                  }
                }

                //Re-load appointment to see if payment was processeds
              if(this.checkoutViewDTO.status === 'PAYMENT_ERROR') {
                this.loadApt();
              }
            }, error => {
              this.paymentMethodUpdateSubmitted = false;
            });
    }

    setCardGuidForUpdate(guid: string) {
        this.cardGuidSelectedForUpdate = guid;
    }

    setCardGuidForUpdateMobile(guid: string, event) {
        event.preventDefault(); // This is needed to prevent the click event from firing twice on a label: https://stackoverflow.com/questions/40868900/angular-2-click-fired-multiple-times-inside-ngfor
        this.cardGuidSelectedForUpdate = guid;
        this.confirmUpdatePaymentMethod();
        
    }

    confirmGetCardData(valid) {
      if(!valid) {
        this.validateForm();
        return;
      }

      if(this.checkoutViewDTO.reoccurring) {
          this.locationModalComponent.close();

          let options: BootboxPromptOptions = {
            title: 'Update recurring appointment',
            value : AppointmentUpdateConstants.ONLY_THIS,
            inputType: 'select',
            callback: (result) => this.getCardData(valid, result),
            inputOptions: [
              {text: 'Update only this appointment', value: AppointmentUpdateConstants.ONLY_THIS},
              {text: 'Update this and following appointments', value: AppointmentUpdateConstants.THIS_AND_FUTURE},
              {text: 'Update all appointments in series', value: AppointmentUpdateConstants.ALL_IN_SERIES}
              ]
          };

          bootbox.prompt(options);
        } else {
          this.getCardData(valid, AppointmentUpdateConstants.ONLY_THIS);
        }
    }

    // https://forums.meteor.com/t/solution-for-ui-not-update-have-to-click-somewhere-router-not-work/25781
  getCardData(valid, updateType: string) {
        let updateReoccurringSeries = false;

      if(!updateType) {
        this.addPaymentMethod.close();
        return;
      }

      this.paymentMethodUpdateSubmitted = true;
      this.userPaymentMethodService.createPaymentMethod(this.model.number, this.model.month, this.model.year, this.model.cvv)
      .subscribe( guid => {
          this.ngZone.run(() => {
          this.addPaymentMethod.close();
          this.editingPaymentMethod = false;
          this.updateNewPaymentMethod(guid, updateType);
        });
      }, error => this.paymentMethodUpdateSubmitted = false);
  }

  updateNewPaymentMethod(guid: string, updateType: string) {

    this.paymentMethodUpdateSubmitted = true;
      this.cardGuidSelectedForUpdate = guid;
      let idempotentUUID: string = UUIDUtil.generateUUID();

      this.userAppointmentService.updateAppointmentPaymentMethod(this.appointmentId, this.cardGuidSelectedForUpdate, idempotentUUID, updateType).subscribe(() =>
            {
              this.paymentMethodUpdateSubmitted = false;
              this.checkoutViewDTO.paymentMethodGuid = guid;
              this.checkoutViewDTO.paymentMethodLast4 = this.model.number.substr(this.model.number.length - 4, this.model.number.length);
              this.checkoutViewDTO.paymentMethodType = this.userPaymentMethodService.getCardType(this.model.number);
              
              this.editingPaymentMethod = false;
              this.addPaymentMethod.close();
              this.editingPaymentMethod = false;

              //Re-load appointment to see if payment was processed
              if(this.checkoutViewDTO.status === 'PAYMENT_ERROR') {
                this.loadApt();
              }
            }, error => this.paymentMethodUpdateSubmitted = false);
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

    showPaymentErrorAlert(): boolean {
      let showPaymentErrorAlert: boolean = false;

      if(this.checkoutViewDTO.status === 'PAYMENT_ERROR') {
        showPaymentErrorAlert = true;
      }

      return showPaymentErrorAlert;
    }

    confirmCancelOrder() {
      bootbox.confirm('Are you sure you want to cancel this appointment?', result => 
        {
          if (result) {
            this.continueCancellingAppointment();
          }
      });

        
    }

    continueCancellingAppointment() {
      if(this.checkoutViewDTO.reoccurring) {

        let options: BootboxPromptOptions = {
          title: 'Cancel re-occurring appointment',
          value : AppointmentUpdateConstants.ONLY_THIS,
          inputType: 'select',
          callback: (result) => this.cancelOrder(result),
          inputOptions: [
              {text: 'Cancel only this appointment', value: AppointmentUpdateConstants.ONLY_THIS},
              {text: 'Cancel this and following appointments', value: AppointmentUpdateConstants.THIS_AND_FUTURE},
              {text: 'Cancel all appointments in series', value: AppointmentUpdateConstants.ALL_IN_SERIES}
            ]
        };

        bootbox.prompt(options);
      } else {
        this.cancelOrder(AppointmentUpdateConstants.ONLY_THIS);
      }
    }

    cancelOrder(updateType: string) {
      let updateReoccurringSeries = false;

      if(!updateType) {
        MapLocationDTO.copyMapToMap(this.toMapLocationDTOTemp, this.toMapLocationDTO);
        return;
      }

      let idempotentUUID: string = UUIDUtil.generateUUID();

      this.cancelOrderSubmitted = true;
            this.userAppointmentService.cancelAppointment(this.appointmentId, updateType, idempotentUUID).subscribe(() =>
            {
                this.showCancelButton = false;
                this.cancelOrderSubmitted = false;
                this.loadApt();
            }, error => this.cancelOrderSubmitted = false);
    }

    canEditNote(): boolean {
      if(this.checkoutViewDTO.status === 'SCHEDULED') {
        return true;
      } else if (this.checkoutViewDTO.status === 'IN_PROGRESS') {
        return false;
      } else if(this.checkoutViewDTO.status === 'CANCELLED_BY_USER') {
        return false;
      } else if (this.checkoutViewDTO.status === 'CANCELLED_BY_SERVICE_PROVIDER_SP_UNAVAILABLE') {
        return false;
      } else if (this.checkoutViewDTO.status === 'CANCELLED_BY_SERVICE_PROVIDER_CUSTOMER_NO_SHOW') {
        return false;
      } else if (this.checkoutViewDTO.status === 'PAYMENT_ERROR') {
        return false;
      } else if (this.checkoutViewDTO.status === 'COMPLETE') {
        return false;
      }
    }

    canEditPaymentDetails(): boolean {
      if(this.checkoutViewDTO.status === 'SCHEDULED') {
        return true;
      } else if (this.checkoutViewDTO.status === 'IN_PROGRESS') {
        return true;
      } else if(this.checkoutViewDTO.status === 'CANCELLED_BY_USER') {
        return false;
      } else if (this.checkoutViewDTO.status === 'CANCELLED_BY_SERVICE_PROVIDER_SP_UNAVAILABLE') {
        return false;
      } else if (this.checkoutViewDTO.status === 'CANCELLED_BY_SERVICE_PROVIDER_CUSTOMER_NO_SHOW') {
        return false;
      } else if (this.checkoutViewDTO.status === 'PAYMENT_ERROR') {
        return true;
      } else if (this.checkoutViewDTO.status === 'COMPLETE') {
        return false;
      }
    }

    canEditLocation(): boolean {
      if(this.checkoutViewDTO.status === 'SCHEDULED') {
        return true;
      } else if (this.checkoutViewDTO.status === 'IN_PROGRESS') {
        return false;
      } else if(this.checkoutViewDTO.status === 'CANCELLED_BY_USER') {
        return false;
      } else if (this.checkoutViewDTO.status === 'CANCELLED_BY_SERVICE_PROVIDER_SP_UNAVAILABLE') {
        return false;
      } else if (this.checkoutViewDTO.status === 'CANCELLED_BY_SERVICE_PROVIDER_CUSTOMER_NO_SHOW') {
        return false;
      } else if (this.checkoutViewDTO.status === 'PAYMENT_ERROR') {
        return false;
      } else if (this.checkoutViewDTO.status === 'COMPLETE') {
        return false;
      }
    }


    openCustomizations() {
      this.customizationsModalComponent.open();
    }

    openGiftCardModal() {
      this.giftCardModal.open();
    }

    getCheckoutDateFormatted(): string {

      if(this.checkoutViewDTO.appointmentDateAndTime){
        return moment(this.checkoutViewDTO.appointmentDateAndTime).format('dddd, MMMM Do YYYY hh:mma');
      } else {
          return '';
      }
    }
}
