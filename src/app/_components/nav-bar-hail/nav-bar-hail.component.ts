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
  selector: 'app-nav-bar-hail',
  templateUrl: './nav-bar-hail.component.html',
  styleUrls: ['./nav-bar-hail.component.css']
})
export class NavBarHailComponent implements OnInit {

  public platformName = environment.platformName;
  public platformNameShort = environment.platformNameShort;

  public latitude: number;
  public longitude: number;
  
  public zoom: number;
  public locationSearchDTO: LocationSearchDTO;

  /**
   * First line of address(address1) - This is used
   * to populated small address div
   */
  public currentLocationStreetAddress: string = '';

  queryString: string = '';

  hasPopoverBeenDisplayed = false;

  shoppingCartItemCount = 0;

  subscription: Subscription;

  headerPadding: boolean; 

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
            this.shoppingCartItemCount = 0;
            window.open('','_self').close();

        }
      }
    }, false);

    title.setTitle(this.platformName);

      let userAddressEntity: UserAddressEntity = this.locationService.getUserAddress();

      // Subscribe to the shopping cart update event to update the badge with the number
      // of items in the shopping cart
      this.shoppingCartItemCount = this.shoppingCartService.getShoppingCart().services.length;

      this.subscription = shoppingCartService.shippingCartUpdateResult$.subscribe(
        shoppingCart => {
           this.shoppingCartItemCount = shoppingCart.services.length;
        });

      router.events.subscribe((url: any) => {
        if (router.url.startsWith('/hail') || router.url.startsWith('/locations')) {
            this.headerPadding = false;
            console.log(false);
        } else {
            this.headerPadding = true;
            console.log(true);
        }
      });
  }

  ngOnInit() {

  }

    ngAfterViewInit() {

    }

  logout(): void {
    this.shoppingCartItemCount = 0;
    this.authenticationService.logout();
    // this.currentLocation = '';
    this.router.navigateByUrl('login');
  }

  isAdminLoggedIn(): boolean {
    return this.authenticationService.isAdminUserLoggedIn();
  }

  getUsersName(): string {
    return this.userService.getLocalUser().firstName;
  }

}