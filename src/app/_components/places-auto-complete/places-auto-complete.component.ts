import { BeanUtils } from './../../_util/BeanUtils';
import { MapLocationDTO } from './../../_models/dto/map-location-dto';
import { GoogleMapsUtil } from './../../_util/google-maps-util';
import { UserResultDTO } from './../../_models/dto/user-result-dto';
import { UserAddressEntity } from './../../_models/entity/user-address-entity';
import { ShoppingCartService } from './../../_services/shopping-cart.service';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { UserService } from './../../_services/user.service';
import { LocationService } from './../../_services/location.service';
import { LocationSearchDTO } from './../../_models/dto/location-search-dto';
import { FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { UUIDUtil } from '../../_util/uuid-util';

@Component({
  selector: 'app-places-auto-complete',
  templateUrl: './places-auto-complete.component.html',
  styleUrls: ['./places-auto-complete.component.css']
})
export class PlacesAutoCompleteComponent implements OnInit {

  @ViewChild('search')
  public searchElementRef: ElementRef;

  private googlePlacesAutoComplete: any;
  public googlePlacesAutoCompleteListener: any;
  private googlePlacesAutoCompleteSm: any;
  public googlePlacesAutoCompleteListenerSm: any;

  @Input('mapLocationDTO')
  public mapLocationDTO: MapLocationDTO;

  autoCompleteId: string;

  constructor(private locationService: LocationService,
    private userService: UserService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private shoppingCartService: ShoppingCartService) {

      this.autoCompleteId = UUIDUtil.generateUUID();

     }

  ngOnInit() {

    if(!this.mapLocationDTO) {
      alert("mapLocationDTO attribute is required");
    }
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

  removeElementsSavedSearchAddresses(){
      let elements = document.getElementsByClassName('pac-test');
      while(elements.length > 0){
          elements[0].parentNode.removeChild(elements[0]);
      }
  }

  public loadGooglePlaces() {
    //this.disconnectGooglePlaces();

    this.removeElementsSavedSearchAddresses();

    this.addWorkLocation();
    this.addHomeLocation();

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

            GoogleMapsUtil.parsePlaceToMapLocation(place, this.mapLocationDTO);
            this.mapLocationDTO.announceMapLocationUpdate(this.mapLocationDTO);
          });
        });

        this.searchElementRef.nativeElement.value = this.mapLocationDTO.formattedAddress;

        setTimeout(() => {
          // this.testElementRef.nativeElement.focus();
          // this.searchElementRef.nativeElement.click();
        }, 300);

      } else {
        bootbox.alert('There was a problem loading maps.');
      }
    });
  }

  showPlaces() {
    let elementList = document.getElementsByClassName('pac-container');

    for(let i = 0; i < elementList.length; i++)
    {
      //elementList[i].remove(); //Fix for IE
      (<HTMLElement>elementList[i]).style.display = 'block';
    }
  }

  addHomeLocation(): string {
      let localUser = this.userService.getLocalUser();
      let htmlStr: string;

      if(localUser && localUser.savedSearchAddresses.length > 0) { 
        for(let savedSearchAddress of localUser.savedSearchAddresses) { 
          if (savedSearchAddress.name === 'Home') {
            setTimeout(() => {

            htmlStr = '<div id="are" class="pac-item pac-test" onmousedown="document.getElementById(\'homeClickAuto' + this.autoCompleteId + '\').click();"><span class="pac-icon-saved-search icon-airport"><i class="fa fa-lg fa-home" aria-hidden="true"></i></span><span class="pac-item-query"><span class="pac-matched"></span>' + 'Home' + '</span> <span>' + savedSearchAddress.address1 + '</span></div>';

              //let pacContainer = document.querySelector('.pac-container');
              let pacContainers = document.getElementsByClassName('pac-container');

              if (pacContainers[0]) {
                pacContainers[0].insertAdjacentHTML('afterbegin', htmlStr);
                (<HTMLElement>pacContainers[0]).style.display = 'block';
              }

              if (pacContainers[1]) {
                  pacContainers[1].insertAdjacentHTML('afterbegin', htmlStr);
                }
            }, 200);
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

          htmlStr = '<div id="are" class="pac-item pac-test" onmousedown="document.getElementById(\'workClickAuto' + this.autoCompleteId + '\').click();"><span class="pac-icon-saved-search icon-airport"><i class="fa fa-lg fa-suitcase" aria-hidden="true"></i></span><span class="pac-item-query"><span class="pac-matched"></span>' + 'Work' + '</span> <span>' + savedSearchAddress.address1 + '</span></div>';

            //let pacContainer = document.querySelector('.pac-container');
            let pacContainers = document.getElementsByClassName('pac-container');

            if (pacContainers[0]) {
                pacContainers[0].insertAdjacentHTML('afterbegin', htmlStr);
            }

            if (pacContainers[1]) {
                pacContainers[1].insertAdjacentHTML('afterbegin', htmlStr);
              }
          }, 200);
        }
      }
    }
    
    return htmlStr;
  }

  searchHomeSavedSearchAddress() {
      
    let userResultDTO: UserResultDTO = this.userService.getLocalUser();

    if(userResultDTO && userResultDTO.savedSearchAddresses.length > 0) {
      for(let savedSearchAddress of userResultDTO.savedSearchAddresses) {
        if (savedSearchAddress.name === 'Home') {
          let savedMapLocationDTO = savedSearchAddress.getMapLocationDTO();
          
          this.mapLocationDTO.formattedAddress = savedMapLocationDTO.formattedAddress;
          this.mapLocationDTO.address1 = savedMapLocationDTO.address1;
          this.mapLocationDTO.address2 = savedMapLocationDTO.address2;
          this.mapLocationDTO.city = savedMapLocationDTO.city;
          this.mapLocationDTO.state =  savedMapLocationDTO.state;
          this.mapLocationDTO.latitude = savedMapLocationDTO.latitude;
          this.mapLocationDTO.longitude = savedMapLocationDTO.longitude;

          this.mapLocationDTO.announceMapLocationUpdate(this.mapLocationDTO);     
          
        }
      }
    }
  }

  searchWorkSavedSearchAddress() {
    let userResultDTO: UserResultDTO = this.userService.getLocalUser();
    

    if(userResultDTO && userResultDTO.savedSearchAddresses.length > 0) {
      for(let savedSearchAddress of userResultDTO.savedSearchAddresses) { 
        if (savedSearchAddress.name === 'Work') {
          let savedMapLocationDTO = savedSearchAddress.getMapLocationDTO();
          this.mapLocationDTO.formattedAddress = savedMapLocationDTO.formattedAddress;
          this.mapLocationDTO.address1 = savedMapLocationDTO.address1;
          this.mapLocationDTO.address2 = savedMapLocationDTO.address2;
          this.mapLocationDTO.city = savedMapLocationDTO.city;
          this.mapLocationDTO.state =  savedMapLocationDTO.state;
          this.mapLocationDTO.latitude = savedMapLocationDTO.latitude;
          this.mapLocationDTO.longitude = savedMapLocationDTO.longitude;

          this.mapLocationDTO.announceMapLocationUpdate(this.mapLocationDTO);
          
        }
      }
    }

  }

}