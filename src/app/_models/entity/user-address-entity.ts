import { LocalStorageConstants } from './../constants/local-storage-constants';
import { MapLocationDTO } from './../dto/map-location-dto';
export class UserAddressEntity {
    private key = LocalStorageConstants.USER_ADDRESS;

    formattedAddress: string;

    address1: string;

	address2: string;

	city: string;
	
	state: string;

	zip: string;

	latitude: number;

	longitude: number;

    constructor(mapLocationDTO?: MapLocationDTO) {
        if (mapLocationDTO) {
            this.address1 = mapLocationDTO.address1;
            this.address2 = mapLocationDTO.address2;
            this.city = mapLocationDTO.city;
            this.state = mapLocationDTO.state;
            this.zip = mapLocationDTO.zip;
            this.latitude = mapLocationDTO.latitude;
            this.longitude = mapLocationDTO.longitude;
            this.formattedAddress = mapLocationDTO.formattedAddress;
        }
    }

    getKey(): string {
        return this.key;
    }
}