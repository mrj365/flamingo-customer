import { CustomerMapDTO } from './../../_models/dto/customer-map-dto';
import { AddPaymentMethodForm } from './../add-card/add-payment-method-form';
import { UserPaymentMethodResultDTO } from './../../_models/dto/user-payment-method-result-dto';
import { UserPaymentMethodListResultDTO } from './../../_models/dto/user-payment-method-list-result-dto';
import { UserPaymentMethodService } from './../../_services/user-payent-method.service';
import { GooglePlaceConstants } from './../../_models/constants/google-place-constants';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LatLongResultDTO } from './../../_models/dto/lat-long-result-dto';
import { ShoppingCartService } from './../../_services/shopping-cart.service';
import { environment } from './../../../environments/environment';
import { LocationListResultDTO } from './../../_models/dto/location-list-result-dto';
import { UserService } from './../../_services/user.service';
import { UserAddressEntity } from './../../_models/entity/user-address-entity';
import { LocationSearchDTO } from './../../_models/dto/location-search-dto';
import { LocationResultDTO } from './../../_models/dto/location-result-dto';
import { LocalStorageConstants } from './../../_models/constants/local-storage-constants';
import { ImageService } from './../../_services/image.service';
import { ElementRef, NgZone, OnInit, ViewChild, Component, Input, ViewChildren, QueryList } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MapsAPILoader, SebmGoogleMap, SebmGoogleMapMarker, LatLngBoundsLiteral, LatLngBounds } from 'angular2-google-maps/core';
import { LocationService } from '../../_services/location.service';
import { Subscription } from 'rxjs/Subscription';
import { RatingModule } from 'ngx-rating';
import { MapLocationDTO } from '../../_models/dto/map-location-dto';
import { PubNubAngular } from 'pubnub-angular2';
import { GoogleMapsUtil } from '../../_util/google-maps-util';

@Component({
  selector: 'app-hail',
  templateUrl: './hail.component.html',
  styleUrls: ['./hail.component.css']
})
export class HailComponent implements OnInit {
  destSubscription: Subscription;
  fromSubscription: Subscription;

  location2dArr: LocationResultDTO[][] = [];
  locations: LocationResultDTO[] = [];

  //Image and text arrays for carousel
  public hideFirstSearch: boolean = false;
  
  private firstSearchAutoComplete: any;
  private firstSearchAutoCompleteListener: any;

  private serviceAreas2dArr: string[][] = [];
  private serviceAreas: string[] = [];

  public platformName = environment.platformName;

  public rating: number;


  //Pub nub stuff
  public lat: number = 25.804071;
  public lng: number = -80.124663;
  public destLat: number = 0;
  public destLng: number = 0;
  public zoom: number = 16;
  public styles: any;

  @ViewChild('map')
  map: SebmGoogleMap;

  @ViewChildren('marker') 
  markers: QueryList<SebmGoogleMapMarker>;

  bounds: google.maps.LatLngBounds;

  // There is no limit to the number of channels that your app can use nor is there any additional cost associated to the number of channels that get used by your app. 
  // Channels are transient resources created instantly upon publishing a message to an arbitrary channel name so use them to the extent of your applications requirements demand them.
  pnChannel = 'map-channel';
  acceptChannel = 'accept-channel';
  customerActionChannel = 'customer-action-channel';
  status: string;

  screenHeight: string = '800px';

  destinationNotSelected: boolean;

  public fromMapLocationDTO: MapLocationDTO = new MapLocationDTO();

  public toMapLocationDTO: MapLocationDTO = new MapLocationDTO();

  public lastSearchedAddress: string;

  public lastSearchedAddressMapDTO: MapLocationDTO = new MapLocationDTO();

  public homeAddressMapDTO: MapLocationDTO = new MapLocationDTO();
  public homeAddress: string;

  public tempPickupNote: string;
  public pickupNote: string;

  public tripCount = '2,886';

  @ViewChild('modalAddNote')
  public modalAddNote: ModalComponent;

    /**
   * List of users payment methods
   */
  userPaymentMethodListResultDTO: UserPaymentMethodListResultDTO = new UserPaymentMethodListResultDTO();
  selectedPaymentMethod: UserPaymentMethodResultDTO = new UserPaymentMethodResultDTO();

  @ViewChild('modalEditLocation')
  public modalEditLocation: ModalComponent;

  editingPaymentMethod: boolean;
  cardGuidSelectedForUpdate: string;
  

  //********************************** start card modal */
  processingAddCard: boolean;
  model: AddPaymentMethodForm = new AddPaymentMethodForm();
  addPaymentMethodForm: NgForm;
  @ViewChild('addPaymentMethodForm') currentForm: NgForm;
  months: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years: string[] = [];
  currentYear = new Date().getFullYear();

  @ViewChild('addPaymentMethod')
  public addPaymentMethod: ModalComponent;


  /************************888888****************** 3nd card modal */

  constructor(
    private locationService: LocationService,
    private userService: UserService,
    private imageService: ImageService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private userPaymentMethodService: UserPaymentMethodService,
    private pubnub: PubNubAngular
  ) {
      // Get location resuls from app component. This happens after user searches in nav bar
      this.fromSubscription = this.fromMapLocationDTO.locationEvent$.subscribe(
      mapLocationDTO => {

        this.lat = mapLocationDTO.latitude;
        this.lng = mapLocationDTO.longitude;

        let loc = new google.maps.LatLng(this.lat, this.lng);
        this.bounds.extend(loc);
    });

    this.destSubscription = this.toMapLocationDTO.locationEvent$.subscribe(
      destMapLocation => {
        this.modalEditLocation.close();
        this.destinationNotSelected = true;

        this.destLat = destMapLocation.latitude;
        this.destLng = destMapLocation.longitude;

        let loc = new google.maps.LatLng(this.destLat, this.destLng);
        this.bounds.extend(loc);
    });


    window.onresize = (e) =>
    {
        //ngZone.run will help to run change detection
        this.ngZone.run(() => {
            // do I need to do something?

            this.screenHeight = (window.innerHeight - 50) + 'px';

        });
    };

    pubnub.init({ publishKey: 'pub-c-38a98ae5-3a2b-4d56-bcc2-15c72437f199', subscribeKey: 'sub-c-f60d1d56-ddd9-11e8-bcd7-8679488ffa8f' });

    // pubnub.subscribe({channels: [this.pnChannel]});
    // pubnub.addListener({message:this.redraw});

    pubnub.subscribe({channels: [this.acceptChannel]});
    pubnub.addListener({message: msg => {
          this.rideStatusUpdated(msg);
          }   
    });

    let _thiss = this;
    // setInterval(function() {
      
    //   pubnub.publish({channel:_thiss.pnChannel, message:_thiss.circlePoint(new Date().getTime()/1000)});
    // }, 500);

      // Populate years
      let todaysDate = new Date();
      let thisYear = todaysDate.getFullYear();

      for(let i = 0; i <= 20; i++) {
          let numberYear = thisYear + i;
          this.years.push(numberYear + '');
      }
  }

  redraw = function(payload: any) {
      this.lat = payload.message.lat;
      this.lng = payload.message.lng;
  };

  rideStatusUpdated(payload: any) {
      console.log('status received: ' + payload.message.status);
      

      this.status = payload.message.status;
      console.log(this.status);

      if(!this.status) {
        this.resetTrip();
      }
  };

  circlePoint(time) {
    let radius = 0.01;
    let x = Math.cos(time) * radius;
    let y = Math.sin(time) * radius;
    
    return {lat:this.lat + x, lng:this.lng + y};
  };

  getLocationMessage() {
    let fromCustomerMapDTO: CustomerMapDTO = this.fromMapLocationDTO.getCustomerMapDTO();
    let destustomerMapDTO: CustomerMapDTO = this.toMapLocationDTO.getCustomerMapDTO();
    
    return {from:fromCustomerMapDTO, dest:destustomerMapDTO};
  };
  

  updateLocations(mapLocationDTO: MapLocationDTO) {
    this.lat = mapLocationDTO.latitude;
    this.lng = mapLocationDTO.longitude;
  }

  ngOnInit() {
    this.screenHeight = (window.innerHeight - 50) + 'px';
  }


  ngAfterViewInit() {
    // Windows navigated to by sibling resourse do
    // not automtically scroll to top. Thiw sill scroll to top
      window.scrollTo(0, 0);

    let userAddressEntity = this.locationService.getUserAddress();

    //If user address, do not display first search. Seach locations based on saved address
    if (userAddressEntity) {
      this.hideFirstSearch = true;
      this.searchSavedAddress(userAddressEntity);
    } else { // Else display first search and load google places 
      this.hideFirstSearch = false;
      //this.loadFirstSerch();
    }

    this.setCurrentPosition();
    this.getGeoLocation();
    this.setLastSearchedLocation();

    this.getHomeLocation();

    this.getPaymentMethods();

    // https://snazzymaps.com/style/42/apple-maps-esque
    this.styles = GooglePlaceConstants.GOOGLE_MAP_STYLE;
  }

  private setLastSearchedLocation() {
    let userAddressEntity: UserAddressEntity = this.locationService.getUserAddress();

      if (userAddressEntity) {
        this.lastSearchedAddress = userAddressEntity.address1;
        MapLocationDTO.convertUserAddressEntityToMapLocationDTO(userAddressEntity, this.lastSearchedAddressMapDTO)
      }
  }

  
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }

  /**
   * Searched locations with stored address
   * @param userAddressEntity 
   */
  private searchSavedAddress(userAddressEntity: UserAddressEntity) {
    let locationSearchDTO: LocationSearchDTO =  new LocationSearchDTO();

    locationSearchDTO.latitude = userAddressEntity.latitude;
    locationSearchDTO.longitude = userAddressEntity.longitude;
    locationSearchDTO.query = '';
    locationSearchDTO.radius = 99;
    locationSearchDTO.size = 10;
    locationSearchDTO.startIndex = 0;

    this.locationService.getLocations(locationSearchDTO)
      .subscribe(locationListResult => {

      });
  }

  public getGeoLocation(){
    this.mapsAPILoader.load().then(() => {
        


          if (navigator.geolocation) {
              var options = {
                enableHighAccuracy: true
              };

              navigator.geolocation.getCurrentPosition(position=> {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                let geocoder = new google.maps.Geocoder();
                let latlng = new google.maps.LatLng(this.lat, this.lng);
                let request = {
                  latLng: latlng
                };   

                  geocoder.geocode(request, (results, status) => {
                    if (status == google.maps.GeocoderStatus.OK) {
                      if (results[0] != null) {
                        GoogleMapsUtil.parseGeocoderResultToMapLocation(results[0], this.fromMapLocationDTO);

                        let loc = new google.maps.LatLng(this.fromMapLocationDTO.latitude, this.fromMapLocationDTO.longitude);
                        this.bounds  = new google.maps.LatLngBounds(loc);
                        // this.bounds.extend(loc);
                      } else {
                        alert("No address available");
                      }
                    }
                  });

              }, error => {
                console.log(error);
              }, options);
          }
      });
    }

    updateSearchLastSearchedLocation() {
      MapLocationDTO.copyMapToMap(this.lastSearchedAddressMapDTO, this.toMapLocationDTO);
    }
    
    getHomeLocation() {
      let localUser = this.userService.getLocalUser();

      if(localUser) { 
        for(let savedSearchAddress of localUser.savedSearchAddresses) {
          if (savedSearchAddress.name === 'Home') {
            MapLocationDTO.copyMapToMap(savedSearchAddress.getMapLocationDTO(), this.homeAddressMapDTO);
            this.homeAddress = this.homeAddressMapDTO.address1;
          }
        }
      }
    }

    updateSearchHomeAddress() {
      MapLocationDTO.copyMapToMap(this.homeAddressMapDTO, this.toMapLocationDTO);
    }

    popoverConfirm() {
      this.toMapLocationDTO.announceMapLocationUpdate(this.toMapLocationDTO);
    }

    getPaymentMethods() {

        this.userPaymentMethodService.getUserCards()
        .subscribe(userPaymentMethodListResultDTO => {
          this.userPaymentMethodListResultDTO = userPaymentMethodListResultDTO;
          
          for(let paymentMethod of userPaymentMethodListResultDTO.paymentMethods){
            if(paymentMethod.preferred) {
              this.selectedPaymentMethod = paymentMethod;
              this.cardGuidSelectedForUpdate = this.selectedPaymentMethod.guid;
              console.log(this.selectedPaymentMethod.guid);
            }
          }
        });
        
    }

    public editPaymentMethod() {
      this.userPaymentMethodService.getUserCards()
        .subscribe(userPaymentMethodListResultDTO => {
          this.userPaymentMethodListResultDTO = userPaymentMethodListResultDTO;
          
          for(let paymentMethod of userPaymentMethodListResultDTO.paymentMethods){
            if(paymentMethod.guid === this.selectedPaymentMethod.guid) {

            }
          }

          this.editingPaymentMethod = true;
        });
    }

    setCardGuidForUpdateMobile(guid: string) {
        this.cardGuidSelectedForUpdate = guid;

        for(let paymentMethod of this.userPaymentMethodListResultDTO.paymentMethods) {
          if(guid === paymentMethod.guid) {
            this.selectedPaymentMethod = paymentMethod;
          }
        }

        this.editingPaymentMethod = false;
    }

        /**
     * formats
     * @param expirationDate 
     */
    formatExpirationDate(expirationDate: string): string {
        expirationDate = expirationDate.substr(4, 6) + '/' + expirationDate.substr(0, 4);
        return expirationDate;
    }

    requestPickup() {
      this.status = 'REQUESTED';

      console.log('publishing locations');
      this.pubnub.publish({channel:this.pnChannel, message:this.getLocationMessage()});
    }

    cancelPickupRequest() {
      this.resetTrip();
      this.pubnub.publish({channel:this.customerActionChannel, message:this.getStatus()});
    }

    getStatus() {
      console.log('stat:' + this.status);
      return {status:this.status}
    }

    rateTrip() {
      this.resetTrip();
    }


openAddNoteModal() {
      this.tempPickupNote = this.pickupNote;
      this.modalAddNote.open();
  }

  saveNote() {
    this.pickupNote = this.tempPickupNote;
    this.modalAddNote.close();
  }

  resetTrip() {
    console.log('resetting trip');
    this.destinationNotSelected = false;
    this.getGeoLocation();
    this.toMapLocationDTO.reset();
    this.tempPickupNote = null;
    this.pickupNote = null;
    this.status = '';
    this.destinationNotSelected = false;
    this.rating = 0;

    this.tripCount = this.tripCount.substr(0, 1) + this.tripCount.substr(2, this.tripCount.length);
    console.log(this.tripCount);
    let tripCountNum = +this.tripCount;
    tripCountNum = tripCountNum = tripCountNum + 1;
    this.tripCount = tripCountNum + '';
    this.tripCount = this.tripCount.substr(0, 1) + ',' + this.tripCount.substr(1, this.tripCount.length);
  }


























    openAddPaymentMethod() {
        this.addPaymentMethod.open();
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
          
          this.cardGuidSelectedForUpdate = guid;
          this.getPaymentMethods();
          
          this.addPaymentMethod.close();

        });
      }, error => {
        this.processingAddCard = false;
      });
    } else {
      this.validateForm();
    }
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
}
