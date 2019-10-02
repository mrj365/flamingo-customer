import { MapLocationDTO } from './../dto/map-location-dto';
export class UpdateAppointmentAddressRequest {
	

	address1: string;
	
    /**
     * Suit or apt no
     */
	address2: string;
	city: string;
	state: string;
	zip: string;
	

	latitude: number;
	

    longitude: number;
    
    updateType: string;

    constructor(mapLocationDTO: MapLocationDTO, updateType: string) {
        this.address1 = mapLocationDTO.address1;
        this.address2 = mapLocationDTO.address2;
        this.city = mapLocationDTO.city;
        this.state = mapLocationDTO.state;
        this.zip = mapLocationDTO.zip;
        this.latitude = mapLocationDTO.latitude;
        this.longitude = mapLocationDTO.longitude;
        this.updateType = updateType;
    }

}
