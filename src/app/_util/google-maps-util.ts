import { GooglePlaceConstants } from './../_models/constants/google-place-constants';
import { MapLocationDTO } from './../_models/dto/map-location-dto';
export class GoogleMapsUtil {

  /**
   * Parse google place into address that can be used
   * @param place Google place
   */
  public static parsePlaceToMapLocation(place: google.maps.places.PlaceResult, mapLocationDTO?: MapLocationDTO): MapLocationDTO {

    let streetNumber = '';
    let rout = '';

    let addressComponents = place.address_components;

    if(!mapLocationDTO) {
      mapLocationDTO = new MapLocationDTO();
    }

    for(let addrescComponent of addressComponents){
      for(let addressComponentType of addrescComponent.types){
        switch(addressComponentType) { 
          case GooglePlaceConstants.STREET_NUMBER: { 
              streetNumber = addrescComponent.long_name;
              break;
          }
          case GooglePlaceConstants.ROUTE: { 
              rout = addrescComponent.long_name;
              break;
          }
          case GooglePlaceConstants.LOCALITY: { 
              mapLocationDTO.city = addrescComponent.long_name;
              break;
          } 
          case GooglePlaceConstants.ADMINISTRATIVE_AREA_LEVEL_1: { 
              mapLocationDTO.state = addrescComponent.long_name;
              break;
          } 
          case GooglePlaceConstants.POSTAL_CODE: { 
              mapLocationDTO.zip = addrescComponent.long_name;
              break;
          }

        }
      }
    }

    mapLocationDTO.address1 = streetNumber + ' ' + rout;
    mapLocationDTO.latitude = place.geometry.location.lat();
    mapLocationDTO.longitude = place.geometry.location.lng();
    mapLocationDTO.formattedAddress = place.formatted_address;

    return mapLocationDTO;
  }

    /**
   * Parse google place into address that can be used
   * @param place Google place
   */
  public static parseGeocoderResultToMapLocation(place: google.maps.GeocoderResult, mapLocationDTO?: MapLocationDTO): MapLocationDTO {

    let streetNumber = '';
    let rout = '';

    let addressComponents = place.address_components;

    if(!mapLocationDTO) {
      mapLocationDTO = new MapLocationDTO();
    }

    for(let addrescComponent of addressComponents){
      for(let addressComponentType of addrescComponent.types){
        switch(addressComponentType) { 
          case GooglePlaceConstants.STREET_NUMBER: { 
              streetNumber = addrescComponent.long_name;
              break;
          }
          case GooglePlaceConstants.ROUTE: { 
              rout = addrescComponent.long_name;
              break;
          }
          case GooglePlaceConstants.LOCALITY: { 
              mapLocationDTO.city = addrescComponent.long_name;
              break;
          } 
          case GooglePlaceConstants.ADMINISTRATIVE_AREA_LEVEL_1: { 
              mapLocationDTO.state = addrescComponent.long_name;
              break;
          } 
          case GooglePlaceConstants.POSTAL_CODE: { 
              mapLocationDTO.zip = addrescComponent.long_name;
              break;
          }

        }
      }
    }

    mapLocationDTO.address1 = streetNumber + ' ' + rout;
    mapLocationDTO.latitude = place.geometry.location.lat();
    mapLocationDTO.longitude = place.geometry.location.lng();
    mapLocationDTO.formattedAddress = place.formatted_address;

    return mapLocationDTO;
  }

}