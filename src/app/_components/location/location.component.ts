import { environment } from './../../../environments/environment';
import { LocationListResultDTO } from './../../_models/dto/location-list-result-dto';
import { UserService } from './../../_services/user.service';
import { UserAddressEntity } from './../../_models/entity/user-address-entity';
import { LocationSearchDTO } from './../../_models/dto/location-search-dto';
import { LocationResultDTO } from './../../_models/dto/location-result-dto';
import { LocalStorageConstants } from './../../_models/constants/local-storage-constants';
import { ImageService } from './../../_services/image.service';
import { ElementRef, NgZone, OnInit, ViewChild, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { LocationService } from '../../_services/location.service';
import { Subscription } from 'rxjs/Subscription';
import { RatingModule } from 'ngx-rating';
import { MapLocationDTO } from '../../_models/dto/map-location-dto';

@Component({
  selector: 'app-locations',
  templateUrl: 'location.component.html',
  styleUrls: ['location.component.css'],
})

export class LocationComponent implements OnInit {
  subscription: Subscription;

  location2dArr: LocationResultDTO[][] = [];
  locations: LocationResultDTO[] = [];

  //Image and text arrays for carousel
  public hideFirstSearch: boolean = false;
  public howToImgs: string[] = ['images/laundry-pile.jpg', 'images/laundry-folded.jpg', 'images/washer.jpg'];
  public howToTexts: string[] = ['Turn this...', 'Into this!', 'In 48 hrs.'];
  public howToDescs: string[] = ['Contact us and we schedule a pick up ​of your dirty laundry.'
    , 'After laundering we drop it off clean and folded! ', 'Say hello to more free time and clean folded laundry every week!'];
  public howToImg = this.howToImgs[0];
  public howToText = this.howToTexts[0];
  public howToDesc = this.howToDescs[0];
  private currentSlideIndex = 0;
  private firstSearchAutoComplete: any;
  private firstSearchAutoCompleteListener: any;

  private serviceAreas2dArr: string[][] = [];
  private serviceAreas: string[] = [];

  @ViewChild("firstSearchInput")
  public firstSearchElementRef: ElementRef;

  public platformName = environment.platformName;

  constructor(
    private locationService: LocationService,
    private userService: UserService,
    private imageService: ImageService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
      // Get location resuls from app component. This happens after user searches in nav bar
      this.subscription = locationService.locationListResultParentS$.subscribe(
      locationListResult => {
        this.updateLocations(locationListResult.locationList);
    });


    window.onresize = (e) =>
    {
        //ngZone.run will help to run change detection
        this.ngZone.run(() => {
           this.updateLocations(this.locations);
           this.updateServiceAreas();

        });
    };

    this.updateServiceAreas();
  }

  updateLocations(locationResultDTO: LocationResultDTO[]) {
    this.locations = locationResultDTO;

    let columns = 3;

    if(window.innerWidth < 768){
      columns = 1;
    } else if(window.innerWidth >= 768 && window.innerWidth < 993){
      columns = 2;
    } else {
      columns = 3;
    }

    this.location2dArr = [];

    let locationArr = [];
        let lastPushed = false;
        for(let x = 0; x < locationResultDTO.length; x++) {
          lastPushed = false;
          locationArr.push(locationResultDTO[x]);

          if(locationArr.length == columns) {
            this.location2dArr.push(locationArr);
            locationArr = [];
            lastPushed = true;
          }
        }

        if(!lastPushed) {
          this.location2dArr.push(locationArr);
        }
  }

  updateServiceAreas() {
    let serviceAreas: string[] = environment.serviceAreas;
    let columns = 4;

    if(window.innerWidth < 768){
      columns = 2;
    } else {
      columns = 6;
    }

    this.serviceAreas2dArr = [];

    let serviceAreaArr = [];
        let lastPushed = false;
        for(let x = 0; x < serviceAreas.length; x++) {
          lastPushed = false;
          serviceAreaArr.push(serviceAreas[x]);

          if(serviceAreaArr.length == columns) {
            this.serviceAreas2dArr.push(serviceAreaArr);
            serviceAreaArr = [];
            lastPushed = true;
          }
        }

        if(!lastPushed) {
          this.serviceAreas2dArr.push(serviceAreaArr);
        }
  }

  ngOnInit() {

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

    //Start interval to iterate through carousel
    var thiObj = this;
    setInterval(function() {
      // thiObj.howToText = thiObj.howToTexts[thiObj.currentSlideIndex % 3];
      // thiObj.howToDesc = thiObj.howToDescs[thiObj.currentSlideIndex % 3];
      // thiObj.howToImg = thiObj.howToImgs[thiObj.currentSlideIndex % 3];
      thiObj.currentSlideIndex++;
      }, 5000);
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
        this.updateLocations(locationListResult.locationList)
      });
  }

  loadFirstSerch() {
            // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      if(this.firstSearchElementRef){ //Don't add auto complete when auto complete is not shown

        this.firstSearchAutoComplete = new google.maps.places.Autocomplete(this.firstSearchElementRef.nativeElement, {
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

            this.locationService.getLocations(locationSearchDTO)
              .subscribe(locationListResult => {
                //Set locations
                this.updateLocations(locationListResult.locationList);

                //Hide first location search
                this.hideFirstSearch = true;

                // Announce searched location so it can be populated in navbar
                this.locationService.announceFirstLocationSearch(mapLocationDTO);

                // Remove listeners on auto complete
                // https://stackoverflow.com/questions/33049322/no-way-to-remove-google-places-autocomplete
                google.maps.event.removeListener(this.firstSearchAutoCompleteListener);
                google.maps.event.clearInstanceListeners(this.firstSearchAutoComplete);

                //Remove pac container after first search to avoid issues caused by multiple pac containers
                let elementList = document.getElementsByClassName('pac-container');

                for(let i = 0; i < elementList.length; i++)
                {
                  //elementList[i].remove(); //Fix for IE
                  (<HTMLElement>elementList[i]).outerHTML = '';
                }

                this.userService.updateLastSearchedAddres();

              });

          });
        });
      } else {
        bootbox.alert('There was a problem loading maps.');
      }
    });
  }

  formatDistance(unformattedDistance: number): string {
    return  parseFloat(Math.round(unformattedDistance * 100) / 100 + '').toFixed(1);
  }

}
