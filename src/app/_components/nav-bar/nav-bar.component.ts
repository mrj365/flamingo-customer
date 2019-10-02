import { LocalStorageConstants } from './../../_models/constants/local-storage-constants';
import { environment } from './../../../environments/environment';
import { UserAddressEntity } from './../../_models/entity/user-address-entity';
import { Subscription } from 'rxjs/Subscription';
import { UserResultDTO } from './../../_models/dto/user-result-dto';
import { LocationSearchDTO } from './../../_models/dto/location-search-dto';
import { UserService } from './../../_services/user.service';
import { ElementRef, NgZone, OnInit, ViewChild, Component, ChangeDetectorRef, Renderer, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { LocationService } from '../../_services/location.service';
import {Router} from '@angular/router';
import { MapLocationDTO } from '../../_models/dto/map-location-dto';
import { AuthenticationService } from '../../_services/authentication.service';
import { PopoverContent, Popover } from "ngx-popover";
import { UserEntity } from '../../_models/entity/user-entity';
import { ShoppingCartService } from '../../_services/shopping-cart.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: [
    './nav-bar.component.scss'
    ],
  providers: [Title]
})
export class NavBarComponent implements OnInit {

  public platformName = environment.platformName;
  public platformNameShort = environment.platformNameShort;

  public latitude: number;
  public longitude: number;
  
  public zoom: number;
  public locationSearchDTO: LocationSearchDTO;
  public currentLocation: string = '';
  public showSearch: boolean = false;
  public showCart = !environment.pickupProfile;
  public showSpSearch = !environment.pickupProfile;

  /**
   * First line of address(address1) - This is used
   * to populated small address div
   */
  public currentLocationStreetAddress: string = '';

  public locations: Location[];

  public searchControl: FormControl;
  @ViewChild('search')
  public searchElementRef: ElementRef;

  public searchControlSm: FormControl;
  @ViewChild('searchSm')
  public searchElementRefSm: ElementRef;

  public showSmallAddressSearch: boolean = false;

  private googlePlacesAutoComplete: any;
  public googlePlacesAutoCompleteListener: any;
  private googlePlacesAutoCompleteSm: any;
  public googlePlacesAutoCompleteListenerSm: any;

  @ViewChild('bookingFeePopover')
  public bookingFeePopover: PopoverContent;

  queryString: string = '';

  hasPopoverBeenDisplayed = false;

  shoppingCartItemCount = 0;

  subscription: Subscription;

  firstSearchSubscription: Subscription; 


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private locationService: LocationService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private shoppingCartService: ShoppingCartService,
    private title: Title
  ) {

    // Check for change in admin session Id. If it has changed, the administrator
    // has logged in on behalf of another user and this session should be 
    // closed to prevent any confusion when performing actions on other users
    window.addEventListener('storage', (event) => {
      
      if (event.storageArea == localStorage) {
        let adminSessId = localStorage.getItem('admin-sess-id');

        if(adminSessId != undefined && adminSessId !== this.authenticationService.session) {

            this.currentLocation = '';
            this.searchElementRef.nativeElement.value = '';
            this.searchElementRefSm.nativeElement.value = '';
            this.shoppingCartItemCount = 0;
            window.open('','_self').close();

        }
      }
    }, false);

    title.setTitle(this.platformName);

    router.events.subscribe((url: any) => {
        if (router.url === '/locations' || router.url === '/pickup') {
          let userAddressEntity: UserAddressEntity = locationService.getUserAddress();

          if (userAddressEntity) {
            this.showSearch = true;
            this.currentLocationStreetAddress = userAddressEntity.address1;
            this.currentLocation = userAddressEntity.formattedAddress;

             this.disconnectGooglePlaces();
            this.loadGooglePlaces();
          } else {
            // If the userAddress isn't populated the first search dialogue will display
            // so the location search in the navbar should not be displayed
            this.showSearch = false;
            this.disconnectGooglePlaces();
          }
        } else {
          this.showSearch = false;
          this.disconnectGooglePlaces();
        }
      });

      let userAddressEntity: UserAddressEntity = this.locationService.getUserAddress();

      if (userAddressEntity) {
        this.currentLocationStreetAddress = userAddressEntity.address1;
        this.currentLocation = userAddressEntity.formattedAddress;
      } else {
        //Show location search input box for small devices
        this.showSmallAddressSearch = true;
      }

      // Subscribe to the shopping cart update event to update the badge with the number
      // of items in the shopping cart
      this.shoppingCartItemCount = this.shoppingCartService.getShoppingCart().services.length;

      this.subscription = shoppingCartService.shippingCartUpdateResult$.subscribe(
        shoppingCart => {
           this.shoppingCartItemCount = shoppingCart.services.length;
        });

      // Subscribe to the first location search event. When a user searches in the first search input
      // This even will receive the searched location so the address can be populated in the navbar 
      // location search box.
      this.firstSearchSubscription = locationService.firstLocationSearchUpdateResult$.subscribe(
        firstSearchMapLocationDTO => {
          this.currentLocation = firstSearchMapLocationDTO.formattedAddress;
          this.currentLocationStreetAddress = firstSearchMapLocationDTO.formattedAddress;

          this.showSearch = true;

          this.disconnectGooglePlaces();
          this.loadGooglePlaces();
        });

      // let userLocation = this.locationService.getUserAddress();
      // if(userLocation) {
      //   this.loadGooglePlaces();
      // }
  }

  ngOnInit() {

    // set google maps defaults
    this.latitude = 25.7617;
    this.longitude = -80.1918;
    this.zoom = 12;

    // create search FormControl
    this.searchControl = new FormControl();
    this.searchControlSm = new FormControl();
    this.locationSearchDTO = new LocationSearchDTO();
  }

    ngAfterViewInit() {

    // Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'.
    // The error is complaining about our NgIf expressions -- 
    // the first time it runs, showSearch false, then ngAfterViewInit() runs and changes the value to something 
    // other than false, then the 2nd round of change detection runs (in dev mode). Thankfully, 
    // there is an easy/known solution, and this is a one-time only issue, not a continuing issue like in the OP:

    // Note that this technique, of waiting one tick is documented here: 
    // https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#parent-to-view-child

    setTimeout(_ => 
      { 
        if (this.router.url === '/locations' || this.router.url === '/pickup') {
          let userAddressEntity: UserAddressEntity = this.locationService.getUserAddress();

          if(userAddressEntity) {
            this.showSearch = true;
          } else {
            this.showSearch = false;
          }
          
        } else {
          this.showSearch = false;
          this.disconnectGooglePlaces();

          
        }
      });
  }

  disconnectGooglePlaces() {
    // Remove listeners on auto complete
    // https://stackoverflow.com/questions/33049322/no-way-to-remove-google-places-autocomplete

    if (this.googlePlacesAutoCompleteListener && this.googlePlacesAutoComplete) {
      try {
        google.maps.event.removeListener(this.googlePlacesAutoCompleteListener);
        google.maps.event.clearInstanceListeners(this.googlePlacesAutoComplete);
      } catch (e) {
        // TODO FIGURE OUT HOW TO SEE IF LISTENER IS ACTUALLY ATTACHED
       
      }
    }

    if (this.googlePlacesAutoCompleteSm && this.googlePlacesAutoCompleteListenerSm) {
      try {
        // TODO FIGURE OUT HOW TO SEE IF LISTENER IS ACTUALLY ATTACHED
        google.maps.event.removeListener(this.googlePlacesAutoCompleteListenerSm);
        google.maps.event.clearInstanceListeners(this.googlePlacesAutoCompleteSm);
      } catch (e) {

      }
    }

    //Remove pac container after first search to avoid issues caused by multiple pac containers
    let elementList = document.getElementsByClassName('pac-container');

    for(let i = 0; i < elementList.length; i++)
    {
      //elementList[i].remove(); //Fix for IE
      (<HTMLElement>elementList[i]).outerHTML = '';
    }
  }

  private loadGooglePlaces() {
    this.disconnectGooglePlaces();

    // set current position
    this.setCurrentPosition();

        // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      if(this.searchElementRef){ //Don't add auto complete when auto complete is not shown

        this.googlePlacesAutoComplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ["address"]
        });

        this.googlePlacesAutoCompleteListener = this.googlePlacesAutoComplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            // get the place result
            let place: google.maps.places.PlaceResult = this.googlePlacesAutoComplete.getPlace();

            // verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            // set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.zoom = 12;

            this.locationSearchDTO.latitude = this.latitude;
            this.locationSearchDTO.longitude = this.longitude;
            this.locationSearchDTO.query = '';
            this.locationSearchDTO.radius = 99;
            this.locationSearchDTO.size = 10;
            this.locationSearchDTO.startIndex = 0;
            this.locationSearchDTO.query = this.queryString;

            let mapLocationDTO = this.locationService.storeUserAddress(place);

            this.currentLocationStreetAddress = mapLocationDTO.address1;

            this.currentLocation = place.formatted_address;

            this.locationService.getLocations(this.locationSearchDTO)
              .subscribe(locationListResult => {
                  this.locationService.announceLocationsFromChild(locationListResult);
                  this.userService.updateLastSearchedAddres();
                  }
                );

          });
        });
      } else {
        bootbox.alert('There was a problem loading maps.');
      }

      if (this.searchElementRefSm) { //Don't add auto complete when auto complete is not shown

        this.googlePlacesAutoCompleteListenerSm = new google.maps.places.Autocomplete(this.searchElementRefSm.nativeElement, {
          types: ["address"]
        });

        this.googlePlacesAutoCompleteSm = this.googlePlacesAutoCompleteListenerSm.addListener("place_changed", () => {
          this.ngZone.run(() => {
            // get the place result
            let place: google.maps.places.PlaceResult = this.googlePlacesAutoCompleteListenerSm.getPlace();

            // verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            // set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.zoom = 12;

            this.locationSearchDTO.latitude = this.latitude;
            this.locationSearchDTO.longitude = this.longitude;
            this.locationSearchDTO.query = '';
            this.locationSearchDTO.radius = 99;
            this.locationSearchDTO.size = 10;
            this.locationSearchDTO.startIndex = 0;
            this.locationSearchDTO.query = this.queryString;

            let mapLocationDTO = this.locationService.storeUserAddress(place);

            this.currentLocation = place.formatted_address;

            this.currentLocationStreetAddress = mapLocationDTO.address1;

            this.locationService.getLocations(this.locationSearchDTO)
              .subscribe(locationListResult => {
                this.locationService.announceLocationsFromChild(locationListResult);
                this.toggleShowSmallSearch();
                this.userService.updateLastSearchedAddres();
                  }
                );

          });
        });
      } else {
        bootbox.alert('There was a problem loading maps.');
      }


    });
  }

  

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

    addHomeLocation(): string {
      let localUser = this.userService.getLocalUser();
      let htmlStr: string;

      if(localUser && localUser.savedSearchAddresses.length > 0) { 
        for(let savedSearchAddress of localUser.savedSearchAddresses) { 
          if (savedSearchAddress.name === 'Home') {
            setTimeout(() => {

            htmlStr = '<div id="are" class="pac-item pac-test" onmousedown="document.getElementById(\'homeClick\').click();"><span class="pac-icon-saved-search icon-airport"><i class="fa fa-lg fa-home" aria-hidden="true"></i></span><span class="pac-item-query"><span class="pac-matched"></span>' + 'Home' + '</span> <span>' + savedSearchAddress.address1 + '</span></div>';

              //let pacContainer = document.querySelector('.pac-container');
              let pacContainers = document.getElementsByClassName('pac-container');

              if (pacContainers[0]) {
                pacContainers[0].insertAdjacentHTML('afterbegin', htmlStr);
                (<HTMLElement>pacContainers[0]).style.display = 'block';
              }

              if (pacContainers[1]) {
                  pacContainers[1].insertAdjacentHTML('afterbegin', htmlStr);
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

          htmlStr = '<div id="are" class="pac-item pac-test" onmousedown="document.getElementById(\'workClick\').click();"><span class="pac-icon-saved-search icon-airport"><i class="fa fa-lg fa-suitcase" aria-hidden="true"></i></span><span class="pac-item-query"><span class="pac-matched"></span>' + 'Work' + '</span> <span>' + savedSearchAddress.address1 + '</span></div>';

            //let pacContainer = document.querySelector('.pac-container');
            let pacContainers = document.getElementsByClassName('pac-container');

            if (pacContainers[0]) {
                pacContainers[0].insertAdjacentHTML('afterbegin', htmlStr);
            }

            if (pacContainers[1]) {
                pacContainers[1].insertAdjacentHTML('afterbegin', htmlStr);
              }
          }, 1);
        }
      }
    }
    
    return htmlStr;
  }

  resetSavedSearchAddresses() {
    this.removeElementsSavedSearchAddresses();
    this.addWorkLocation();
    this.addHomeLocation();

    let pacContainers = document.getElementsByClassName('pac-container');
    
    if (!this.currentLocation || !this.currentLocation.trim()) {
      let localUser = this.userService.getLocalUser();
      
      if(localUser.savedSearchAddresses.length > 0) {
        this.currentLocation  = localUser.savedSearchAddresses[0].getMapLocationDTO().formattedAddress;
        (<HTMLElement>pacContainers[0]).style.display = 'block';
        (<HTMLElement>pacContainers[1]).style.display = 'block';
      }
      
    }
  }

  removeElementsSavedSearchAddresses(){
    let elements = document.getElementsByClassName('pac-test');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

  toggleShowSmallSearch() {
    this.showSmallAddressSearch = !this.showSmallAddressSearch;
  }

  logout(): void {
    this.currentLocation = '';
    this.searchElementRef.nativeElement.value = '';
    this.searchElementRefSm.nativeElement.value = '';
    this.shoppingCartItemCount = 0;
    this.authenticationService.logout();
    // this.currentLocation = '';
    this.router.navigateByUrl('login');
  }

  searchHomeSavedSearchAddress() {
    let userResultDTO: UserResultDTO = this.userService.getLocalUser();

    if(userResultDTO && userResultDTO.savedSearchAddresses.length > 0) {
      for(let savedSearchAddress of userResultDTO.savedSearchAddresses) {
        if (savedSearchAddress.name === 'Home') {
          let mapLocationDTO = this.locationService.storeUserAddressFromSavedAddress(savedSearchAddress.getMapLocationDTO());
          
          this.locationSearchDTO.latitude = mapLocationDTO.latitude;
          this.locationSearchDTO.longitude = mapLocationDTO.longitude;
          this.locationSearchDTO.query = '';
          this.locationSearchDTO.radius = 99;
          this.locationSearchDTO.size = 10;
          this.locationSearchDTO.startIndex = 0;
          this.locationSearchDTO.query = this.queryString;


            this.currentLocationStreetAddress = mapLocationDTO.address1;

            this.currentLocation = mapLocationDTO.formattedAddress;
            this.locationService.getLocations(this.locationSearchDTO)
              .subscribe(locationListResult => {
                this.locationService.announceLocationsFromChild(locationListResult);
                this.userService.updateLastSearchedAddres();

                  }
                );
        }
      }
    }
  }

  searchWorkSavedSearchAddress() {
    let userResultDTO: UserResultDTO = this.userService.getLocalUser();

    if(userResultDTO && userResultDTO.savedSearchAddresses.length > 0) {
      for(let savedSearchAddress of userResultDTO.savedSearchAddresses) {
        if (savedSearchAddress.name === 'Work') {
          let mapLocationDTO = this.locationService.storeUserAddressFromSavedAddress(savedSearchAddress.getMapLocationDTO());
          this.locationSearchDTO.latitude = mapLocationDTO.latitude;
          this.locationSearchDTO.longitude = mapLocationDTO.longitude;
          this.locationSearchDTO.query = '';
          this.locationSearchDTO.radius = 99;
          this.locationSearchDTO.size = 10;
          this.locationSearchDTO.startIndex = 0;
          this.locationSearchDTO.query = this.queryString;


            this.currentLocationStreetAddress = mapLocationDTO.address1;

            this.currentLocation = mapLocationDTO.formattedAddress;

            this.locationService.getLocations(this.locationSearchDTO)
              .subscribe(locationListResult => {
                this.locationService.announceLocationsFromChild(locationListResult);
                this.userService.updateLastSearchedAddres();

                  }
                );
        }
      }
    }

  }

  searchWithQueryString() {
          let userAddressEntity = this.locationService.getUserAddress();
          this.locationSearchDTO.latitude = userAddressEntity.latitude;
          this.locationSearchDTO.longitude = userAddressEntity.longitude;
          this.locationSearchDTO.query = '';
          this.locationSearchDTO.radius = 99;
          this.locationSearchDTO.size = 10;
          this.locationSearchDTO.startIndex = 0;
    this.locationSearchDTO.query = this.queryString;

    this.locationService.getLocations(this.locationSearchDTO)
      .subscribe(locationListResult => {
        this.locationService.announceLocationsFromChild(locationListResult);

          }
        );
  }

  isAdminLoggedIn(): boolean {
    return this.authenticationService.isAdminUserLoggedIn();
  }

  getUsersName(): string {
    return this.userService.getLocalUser().firstName;
  }

}
