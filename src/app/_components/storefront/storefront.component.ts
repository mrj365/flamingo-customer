import { environment } from 'environments/environment';
import { UserService } from './../../_services/user.service';
import { LocationService } from './../../_services/location.service';
import { LocationSearchDTO } from './../../_models/dto/location-search-dto';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ServiceProviderViewDTO } from './service-provider-view-dto';
import { StorefrontViewDTO } from './storefront-view-dto';
import { ServiceViewDTO } from './service-view-dto';
import { Subscription } from 'rxjs/Subscription';
import { ShoppingCartViewDTO } from './../../_models/view/dto/shopping-cart-view-dto';
import { PriceUtil } from './../../_util/price-util';
import { ShoppingCartDTO } from './../../_models/dto/shopping-cart-dto';
import { GooglePlaceConstants } from './../../_models/constants/google-place-constants';
import { ImageService } from './../../_services/image.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { RatingModule } from 'ngx-rating';
import { MapsAPILoader } from 'angular2-google-maps/core';
import {
  AgmCoreModule
} from 'angular2-google-maps/core';

import { StorefrontService } from '../../_services/storefront.service';
import { ShoppingCartService } from '../../_services/shopping-cart.service';
import { PlatformLocation } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-storefront',
  templateUrl: './storefront.component.html',
  styleUrls: [
    './storefront.component.css'
    ]
})
export class StorefrontComponent implements OnInit {
  public lat: number = 25.804071;
  public lng: number = -80.124663;
  public zoom: number = 17;
  public styles: any;
  public showFullCal: boolean = false;

  public subscription: Subscription;

  public storefront: StorefrontViewDTO = new StorefrontViewDTO();
  public serviceProviderViewDTOs: ServiceProviderViewDTO[] = [];
  public displayCheckoutBtn: boolean;

  public selectedServiceViewDTO: ServiceViewDTO = new ServiceViewDTO();
  public selectedServiceProviderViewDTO: ServiceProviderViewDTO = new ServiceProviderViewDTO();
  public defaultServiceProviderViewDTO: ServiceProviderViewDTO = new ServiceProviderViewDTO();

  shoppingCart: ShoppingCartViewDTO = new ShoppingCartViewDTO();

  public showAddress: boolean = false;

  @ViewChild('servicesHeader')
  public servicesHeader:any;

  @ViewChild('modalService')
  public modalService: ModalComponent;

  @ViewChild('modalEditLocation')
  public locationModalComponent: ModalComponent;

  public showFirstSearch: boolean = false;

  @ViewChild('searchSavedAddress')
  public searchElementRef: ElementRef;

  private firstSearchAutoComplete: any;
  private firstSearchAutoCompleteListener: any;

  public serviceProviderName = environment.serviceProviderName;
  public selectStaffEnabled = environment.selectStaffEnabled;

  constructor(private mapsAPILoader: MapsAPILoader,
            private elementRef: ElementRef,
            private storefrontService: StorefrontService,
            private shoppingCartService: ShoppingCartService,
            private route: ActivatedRoute,
            private imageService: ImageService,
            private location: PlatformLocation,
            private userService: UserService,
            private locationService: LocationService,
            private ngZone: NgZone,
            private router: Router) {
    
        // Set hardcoded default "Any staff" service provider        
        this.defaultServiceProviderViewDTO.id = ShoppingCartDTO.DEFAULT_SERVICE_PROVIDER_ID;
        this.defaultServiceProviderViewDTO.displayName = ShoppingCartDTO.DEFAULT_SERVICE_PROVIDER_DISPLAY_NAME;
        this.defaultServiceProviderViewDTO.imgUrl = ShoppingCartDTO.DEFAULT_SERVICE_PROVIDER_IMG_URL;

        // Initialize service provider to default until the it is populated in 
        // ngOnInit. We have to wait for the this.route.params.subscribe method to return
        // so we can check if the storefront in the shopping cart matches the current storefront 
        this.selectedServiceProviderViewDTO.id = ShoppingCartDTO.DEFAULT_SERVICE_PROVIDER_ID;
        this.selectedServiceProviderViewDTO.displayName = ShoppingCartDTO.DEFAULT_SERVICE_PROVIDER_DISPLAY_NAME;
        this.selectedServiceProviderViewDTO.imgUrl = ShoppingCartDTO.DEFAULT_SERVICE_PROVIDER_IMG_URL;

        // Subscribe to shopping cart updates
        this.subscription = shoppingCartService.shippingCartUpdateResult$.subscribe(
        shoppingCart => {
            this.shoppingCart = new ShoppingCartViewDTO(shoppingCart);
            this.updateDisplayCheckoutBtn();
            this.updateSelectedServiceBadges();
        });
        
  }

  ngOnInit() {
      
    // https://snazzymaps.com/style/42/apple-maps-esque
    this.styles = GooglePlaceConstants.GOOGLE_MAP_STYLE;

    // Get the storefrontId from the url
    this.route.params.subscribe(params => {
       let storefrontId = +params['id']; // (+) converts string 'id' to a number

       this.initializeComponent(storefrontId);
    });

  }

  ngAfterViewInit() {
      // Windows navigated to by sibling resourse do
      // not automtically scroll to top. Thiw sill scroll to top
       window.scrollTo(0, 0);
       this.locationModalComponent.backdrop = 'static';
   }

  private initializeComponent(storefrontId: number){
    this.storefrontService.getStorefront(storefrontId).subscribe(storefront =>
        {
            this.storefront = new StorefrontViewDTO(storefront);
            let shoppingCartDTO: ShoppingCartDTO = this.shoppingCartService.getShoppingCart();
            this.shoppingCart = new ShoppingCartViewDTO(shoppingCartDTO);            

            this.updateDisplayCheckoutBtn();

            // If this storefront is the same storefront that is in the shopping cart, add badges to the selected services
            if (storefrontId && storefrontId === shoppingCartDTO.storefrontId) {
                this.updateSelectedServiceBadges();
            }

            // If this storefront is the same storefront that is in the shopping cart, and a service privider has been
            // selected, set the selected service provider
            if (shoppingCartDTO.staffSelected && storefrontId && storefrontId === shoppingCartDTO.storefrontId && shoppingCartDTO.staffSelected) {
                this.selectedServiceProviderViewDTO.id = shoppingCartDTO.serviceProviderId;
                this.selectedServiceProviderViewDTO.displayName = shoppingCartDTO.serviceProviderDisplayName;
                this.selectedServiceProviderViewDTO.imgUrl = shoppingCartDTO.serviceProviderImgUrl;
            } else { // If there is only one service provider available, select that service provider
                 this.storefrontService.getStorefrontServiceProviders(this.storefront.id).subscribe(serviceProviderListResultDTO =>
                    {
                        //Clear list of service proviers
                        this.serviceProviderViewDTOs = [];

                        if(serviceProviderListResultDTO.serviceProviders.length == 1) {
                            let sp = serviceProviderListResultDTO.serviceProviders[0];
                            
                            this.selectedServiceProviderViewDTO.id = sp.id;
                            this.selectedServiceProviderViewDTO.displayName = sp.displayName;
                            this.selectedServiceProviderViewDTO.imgUrl = sp.imgUrl;
                        }

                    });
            }
        });

        let userAddress = this.locationService.getUserAddress();

        if(!userAddress) {
            this.showFirstSearch = true;
            this.locationModalComponent.backdrop = false;
            this.locationModalComponent.open();
            // this.locationModalComponent.backdrop = 'static';
            
        }
    }

    showServiceDetailsModal(serviceId: number): any {
        this.selectService(serviceId);
    };
    
    /**
     * Not currently used
     */
    toggleFullCal(): void {
        this.showFullCal = this.showFullCal === true ? false : true;
    }

    /**
     * Set the selected service. 
     * @param serviceId 
     */
    selectService(serviceId: number){
        for (let service of this.storefront.services) {
            if (service.id === serviceId) {
                this.selectedServiceViewDTO = new ServiceViewDTO(service);
                this.selectedServiceViewDTO.quantityInCart = service.quantityInCart;

                if(service.quantityInCart != 0) {
                    this.selectedServiceViewDTO.updatedQuantity = service.quantityInCart;
                } else {
                    this.selectedServiceViewDTO.updatedQuantity = 1;
                }
            }
        }
    }

  getStorefrontServiceProviders() {

    this.storefrontService.getStorefrontServiceProviders(this.storefront.id).subscribe(serviceProviderListResultDTO =>
        {
            //Clear list of service proviers
            this.serviceProviderViewDTOs = [];

            for(let serviceProvider of serviceProviderListResultDTO.serviceProviders) {
                let serviceProviderViewDTO: ServiceProviderViewDTO = new ServiceProviderViewDTO(serviceProvider);
                this.serviceProviderViewDTOs.push(serviceProviderViewDTO);
            }
        });
  }

  addOrUpdateServiceToCart() {

      // If the services that are currently in the cart belong to another storefront
      // they must be removed before the new services can be added
      if (this.shoppingCart.storefrontId && ( this.shoppingCart.storefrontId != 0 && this.shoppingCart.storefrontId != this.storefront.id)
            && this.shoppingCart.services && this.shoppingCart.services.length > 0) {
          let clearButton: BootboxButton = {
                label: 'CLEAR CART AND ADD'
                // className?: string;
                // callback?: () => any;
            };

            let cancelButton: BootboxButton = {
                label: 'CANCEL'
                // className?: string;
                // callback?: () => any;
            };

            let bootboxButtonMap: BootboxConfirmPromptButtonMap = {
                confirm: clearButton,
                cancel: cancelButton
            }

        let bootboxConfirmOptions: BootboxConfirmOptions = {
            message: 'You can only order items from one location at a time. Clear your cart if you\'d still like to order this item',
            callback: clearCart =>
          {
            if (clearCart) {
                this.addOrUpdateService();
            }
          },
            buttons: bootboxButtonMap
        }


          bootbox.confirm(bootboxConfirmOptions);
      } else {
          this.addOrUpdateService();
      }


      
  }

  addOrUpdateService() {
    this.shoppingCartService.addOrUpdateService(this.storefront.id, this.selectedServiceViewDTO.id,
     this.selectedServiceViewDTO.updatedQuantity, this.selectedServiceProviderViewDTO.id).subscribe(() => 
        {
            this.updateSelectedServiceBadges();
            this.updateDisplayCheckoutBtn();
            window.scrollTo(0, 0);
        });
  }

  removeServiceFromCart() {
      this.shoppingCartService.removeService(this.storefront.id, this.selectedServiceViewDTO.id).subscribe(() =>
        {
            this.updateSelectedServiceBadges();
            this.updateDisplayCheckoutBtn();
        });
  }

  serviceExistsInCart(): boolean {
      let alreadyInCart = this.shoppingCartService.serviceExistsInCart(this.selectedServiceViewDTO.id);
      return alreadyInCart;
  }

  updateSelectedServiceBadges() {
   
    let shoppingCartDTO: ShoppingCartDTO = this.shoppingCartService.getShoppingCart();

    for(let storefrontService of this.storefront.services) {
        storefrontService.selected = false;
        for (let serviceInCart of shoppingCartDTO.services) {
            if (serviceInCart.id === storefrontService.id){
                storefrontService.selected = true;
                storefrontService.quantityInCart = serviceInCart.quantity;
                storefrontService.updatedQuantity = serviceInCart.quantity;
            }
        }
    }

  }

    updateDisplayCheckoutBtn(): void {
        if (this.shoppingCartService.isCartEmpty() || this.storefront.id !== this.shoppingCart.storefrontId) {
            this.displayCheckoutBtn = false;
        } else {
            this.displayCheckoutBtn = true;
        }
    }

    selectServiceProvider(selectedServiceProviderViewDTO: ServiceProviderViewDTO) {
        if (selectedServiceProviderViewDTO && selectedServiceProviderViewDTO.id !== 0) {
            this.selectedServiceProviderViewDTO = selectedServiceProviderViewDTO;

            this.shoppingCartService.setServiceProvider(selectedServiceProviderViewDTO.id).subscribe();

        } else {
            this.selectedServiceProviderViewDTO.id = ShoppingCartDTO.DEFAULT_SERVICE_PROVIDER_ID;
            this.selectedServiceProviderViewDTO.displayName = ShoppingCartDTO.DEFAULT_SERVICE_PROVIDER_DISPLAY_NAME;
            this.selectedServiceProviderViewDTO.imgUrl = ShoppingCartDTO.DEFAULT_SERVICE_PROVIDER_IMG_URL;

            this.shoppingCartService.setServiceProvider(this.selectedServiceProviderViewDTO.id).subscribe();
        }
    }

    increaseQuantity(serviceViewDTO: ServiceViewDTO) {
        serviceViewDTO.updatedQuantity++;
    }

    decreaseQuantity(serviceViewDTO: ServiceViewDTO) {
        if (serviceViewDTO.updatedQuantity > 1) {
            serviceViewDTO.updatedQuantity--;
        }
    }

    manualQuantity(serviceViewDTO: ServiceViewDTO) {
        serviceViewDTO.updatedQuantity;

        // if(serviceViewDTO.updatedQuantity + '' === '') {
        //     serviceViewDTO.updatedQuantity = 1;
        // }
    }

    parsePrice(unformattedPrice: number): string {
        return (Math.round(unformattedPrice * 100) / 100).toFixed(2);
    }

    scrollToServices() {
        let offset: number = this.getPosition(this.servicesHeader.nativeElement);
        window.scrollTo(0, offset - 10);
   }

   /**
    * https://stackoverflow.com/questions/11805955/how-to-get-the-distance-from-the-top-for-an-element
    * @param element 
    */
   getPosition(element): number {
        let yPosition = 0;

        while(element) {
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }

        return yPosition;
    }


    loadFirstSerch() {
        this.cleanUpLocationSearch();

            // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      if(this.searchElementRef){ //Don't add auto complete when auto complete is not shown

        this.firstSearchAutoComplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ["address"]
        });

        this.firstSearchAutoCompleteListener = this.firstSearchAutoComplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            // get the place result
            let place: google.maps.places.PlaceResult = this.firstSearchAutoComplete.getPlace();

            // verify result
            if (!place || place.geometry === undefined || place.geometry === null) {
              return;
            }

            // set latitude, longitude for location search
            let latitude = place.geometry.location.lat();
            let longitude = place.geometry.location.lng();

            let locationSearchDTO: LocationSearchDTO =  new LocationSearchDTO();
            locationSearchDTO.latitude = latitude;
            locationSearchDTO.longitude = longitude;
            locationSearchDTO.query = '';
            locationSearchDTO.radius = 99;
            locationSearchDTO.size = 10;
            locationSearchDTO.startIndex = 0;

            let mapLocationDTO = this.locationService.storeUserAddress(place);
            this.userService.updateLastSearchedAddres();

            this.cleanUpLocationSearch();

            //Hide first location search
            this.showFirstSearch = false;

            this.locationModalComponent.close();
              

          });
        });
      } else {
        bootbox.alert('There was a problem loading maps.');
      }
    });
  }

    cleanUpLocationSearch() {
        if(this.firstSearchAutoCompleteListener) {
            // Remove listeners on auto complete
            // https://stackoverflow.com/questions/33049322/no-way-to-remove-google-places-autocomplete
            google.maps.event.removeListener(this.firstSearchAutoCompleteListener);
            google.maps.event.clearInstanceListeners(this.firstSearchAutoComplete);
        }

        //Remove pac container after first search to avoid issues caused by multiple pac containers
        let elementList = document.getElementsByClassName('pac-container');

        for(let i = 0; i < elementList.length; i++)
        {
        //elementList[i].remove(); //Fix for IE
        (<HTMLElement>elementList[i]).outerHTML = '';
        }
    }

      selectDate() {
        this.router.navigateByUrl('/date-selection');
      }
}
