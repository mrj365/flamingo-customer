import { SavedSearchAddressDTO } from './../_models/dto/saved-search-address-dto';
import { LocalStorageService } from './local-storage-service';
import { UserAddressEntity } from './../_models/entity/user-address-entity';
import { LocationSearchDTO } from './../_models/dto/location-search-dto';
import { LocationResultDTO } from './../_models/dto/location-result-dto';
import { LocationListResultDTO } from './../_models/dto/location-list-result-dto';
import { UrlConstants } from './../_models/constants/url-constants';
import { GoogleMapsUtil } from './../_util/google-maps-util';
import { LocalStorageConstants } from './../_models/constants/local-storage-constants';
import { GooglePlaceConstants } from './../_models/constants/google-place-constants';
import { MapLocationDTO } from './../_models/dto/map-location-dto';
import { HttpUtilService } from './http-util.service';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Subject }    from 'rxjs/Subject';
import { LocationSearchResponse } from '../_models/response/location-search-response';
import { BeanUtils } from '../_util/BeanUtils';

@Injectable()
export class LocationService {

    // This list will be used to share the location list between components
    private locationListResultParentSource = new Subject<LocationListResultDTO>();

    // Get the location list from the child
    private locationListResultChildSource = new Subject<LocationListResultDTO>();
    // private locationListResult: LocationListResult = new LocationListResult();

    // Observable string streams
    locationListResultParentS$ = this.locationListResultParentSource.asObservable();
    locationListResultChild$ = this.locationListResultChildSource.asObservable();

    //This will be used to announce when the location has been updated in the first location search 
    // form 
    private firstLocationSearchUpdateResultSource = new Subject<MapLocationDTO>();

    firstLocationSearchUpdateResult$  = this.firstLocationSearchUpdateResultSource.asObservable();

    announceFirstLocationSearch(mapLocationDTO: MapLocationDTO) {

        this.firstLocationSearchUpdateResultSource.next(mapLocationDTO);
    }

  constructor(private httpUtil: HttpUtilService, private localStorageService: LocalStorageService) { }

  getLocations(locationSearchDTO: LocationSearchDTO): Observable<LocationListResultDTO> {

        let params: URLSearchParams = new URLSearchParams();
        params.set('latitude', locationSearchDTO.latitude.toString());
        params.set('longitude', locationSearchDTO.longitude.toString());
        params.set('queryString', locationSearchDTO.query);
        params.set('searchRadius', locationSearchDTO.radius.toString());
        params.set('index', locationSearchDTO.startIndex.toString());
        params.set('size', locationSearchDTO.size.toString());

        let headers = new Headers();

        return this.httpUtil.getRequest<LocationSearchResponse>(UrlConstants.APP_BASE_URL + '/map-locations', params, headers).map(
            locationSearchResponse => 
              {
                let locationListResult: LocationListResultDTO = new LocationListResultDTO();

                for(let locationResponseDTO of locationSearchResponse.mapLocationResponseList) {
                  let locationResultDTO: LocationResultDTO = BeanUtils.copyProperties(new LocationResultDTO(), locationResponseDTO);
                  locationListResult.locationList.push(locationResultDTO);
                }

                return locationListResult;
              });
    }

    // Service message commands
  announceLocationsFromParent(locationListResult: LocationListResultDTO) {
    this.locationListResultParentSource.next(locationListResult);
  }

  announceLocationsFromChild(locationListResult: LocationListResultDTO) {
    this.locationListResultChildSource.next(locationListResult);
  }

  /**
   * Store the users last searched address
   * @param place Google place
   */
  storeUserAddress(place: google.maps.places.PlaceResult): MapLocationDTO {

    let mapLocationDTO: MapLocationDTO = GoogleMapsUtil.parsePlaceToMapLocation(place);
    this.localStorageService.setItem(new UserAddressEntity(mapLocationDTO));

    return mapLocationDTO;
  }

    /**
   * Store the users last searched address
   * @param place Google place
   */
  storeUserAddressFromSavedAddress(mapLocationDTO: MapLocationDTO): MapLocationDTO {

    let userAddressEntity: UserAddressEntity = new UserAddressEntity(mapLocationDTO);
    this.localStorageService.setItem(new UserAddressEntity(mapLocationDTO));

    return mapLocationDTO;
  }

  /**
   * Get users last searched address
   */
  getUserAddress(): UserAddressEntity {
    let userAddressEntity: UserAddressEntity = this.localStorageService.getItem(UserAddressEntity);

    return userAddressEntity;
  }
}
