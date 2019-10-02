import { environment } from './../environments/environment';
import { AuthenticationService } from './_services/authentication.service';
import { LocationListResultDTO } from './_models/dto/location-list-result-dto';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from './_services/location.service';
import { Component, Inject } from '@angular/core';
import 'rxjs/Rx';
import { ConfigService } from './_services/config.service';
import { Observable } from "@angular/forms/src/facade/async";
import { ShoppingCartService } from './_services/shopping-cart.service';
import { DOCUMENT } from '@angular/platform-browser';

declare var bootbox:any;

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./app.component.css'],
    templateUrl: './app.component.html',
    providers: [LocationService]

})

export class AppComponent {

  locationListResult: LocationListResultDTO = new LocationListResultDTO();
  public showNav: boolean = true;

  public showFooter: boolean = true;

  public hailProfile: boolean;

  public appProfile: boolean = false;
  

    constructor(
      private locationService: LocationService,
      private router: Router,
      private configService: ConfigService,
      private shoppingCartService: ShoppingCartService,
      private authenticationService: AuthenticationService,
      @Inject(DOCUMENT) private _document: HTMLDocument,
      private activatedRoute: ActivatedRoute) {

        // Set favicon
        let appFavicon = environment.appFavicon;
        this._document.getElementById('appFavicon').setAttribute('href', '/images/favicons/' + appFavicon);

        this.hailProfile = environment.hailProfile;

       if(window.location.hostname.indexOf('laundryapp') >= 0) {
            this.appProfile = true;
        }


  locationService.locationListResultChild$.subscribe(
      locationListResult => {
        this.locationListResult = locationListResult;
        this.announce();
      });

      router.events.subscribe((url: any) => {
        if (router.url.startsWith('/register') || router.url.startsWith('/login')) {
            this.showNav = false;
        } else {
            this.showNav = true;
        }
      });

      // router.events.subscribe((url: any) => {
      //   if(!this.appProfile && window.innerWidth < 768 &&
      //     (router.url.includes('/location-profile') || router.url === '/date-selection' 
      //     || router.url === '/checkout' || router.url === '/shopping-cart' || router.url === '/hail')){
      //       this.showFooter = false;
      //   } else if(this.appProfile) {
      //     this.showFooter = false;
      //   } else {
      //       this.showFooter = true;
      //   }
      // });

      router.events.subscribe((url: any) => {
        if (window.innerWidth < 768){
            this.showFooter = false;
        } else {
            this.showFooter = true;
        }
      });

  }


 announce() {
    let locationListResult = this.locationListResult;
    this.locationService.announceLocationsFromParent(locationListResult);
  }

  ngOnInit() {
    // Config service is no longer used. All settings come from the environment file
    // if (!this.configService.getLocalConfig()) {
    //   //bootbox.alert('An exception occured while processing your request');
    //   this.logDebug('Config not loaded yet');
    // }

    // // Check the config to make sure the it exists. If not, reload it
    // // The config should only be reloaded here if the user clears the
    // // Browsers history while this page is open. 
    // Observable.interval(1000).subscribe(x => {
    //     if (!this.configService.getLocalConfig()) {
    //       this.logDebug('Reloading config');
    //       this.configService.setConfig();
    //     }
    // });


  }

  logDebug(logMessage: string) {
    if(console) {
      console.log(logMessage);
    }
  }

}
