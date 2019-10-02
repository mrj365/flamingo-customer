import { MapLocationDTO } from './map-location-dto';
export class UserSavedSearchLocationDTO {
    id: number;
    name: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;

    getMapLocationDTO(): MapLocationDTO {
        let mapLocationDTO: MapLocationDTO = new MapLocationDTO();
        mapLocationDTO.address1 = this.address1;
        mapLocationDTO.address2 = this.address2;
        mapLocationDTO.city = this.city;
        mapLocationDTO.state = this.state;
        mapLocationDTO.zip = this.zip;
        mapLocationDTO.latitude = this.latitude;
        mapLocationDTO.longitude = this.longitude;
        mapLocationDTO.formattedAddress = this.address1 + ' ' +  this.city + ' ' + this.state + ' ' + this.zip;

        return mapLocationDTO;
    }
}