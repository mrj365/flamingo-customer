import { LocalStorageConstants } from './../constants/local-storage-constants';
import { UserSavedSearchLocationDTO } from './../dto/user-saved-search-location-dto';

/**
 * Users saved search addresses. 
 */
export class UserSavedSearchAddressEntity {
    private key = LocalStorageConstants.USER_ADDRESS;

    id: number;
    name: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;

    constructor(userSavedSearchLocationDTO?: UserSavedSearchLocationDTO) {
        if (userSavedSearchLocationDTO) {
            this.id = userSavedSearchLocationDTO.id;
            this.address1 = userSavedSearchLocationDTO.address1;
            this.address2 = userSavedSearchLocationDTO.address2;
            this.city = userSavedSearchLocationDTO.city;
            this.state = userSavedSearchLocationDTO.state;
            this.zip = userSavedSearchLocationDTO.zip;
            this.latitude = userSavedSearchLocationDTO.latitude;
            this.longitude = userSavedSearchLocationDTO.longitude;
        }
    }

    getKey(): string {
        return this.key;
    }
}