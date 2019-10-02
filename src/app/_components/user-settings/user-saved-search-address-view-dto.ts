import { UserSavedSearchAddressResultDTO } from './../../_models/dto/user-saved-search-address-result-dto';
export class UserSavedSearchAddressViewDTO {


    id: number;
	name: string;
	address1: string;
	address2: string;
	city: string;
	state: string;
	zip: string;
	latitude: number;
	longitude: number;

    constructor(savedSearchAddressDTO?: UserSavedSearchAddressResultDTO) {
        if (savedSearchAddressDTO) {
            this.id = savedSearchAddressDTO.id;
            this.address1 = savedSearchAddressDTO.address1;
            this.address2 = savedSearchAddressDTO.address2;
            this.city = savedSearchAddressDTO.city;
            this.state = savedSearchAddressDTO.state;
            this.zip = savedSearchAddressDTO.zip;
            this.latitude = savedSearchAddressDTO.latitude;
            this.longitude = savedSearchAddressDTO.longitude;

            this.name = savedSearchAddressDTO.name;
        }
    }

}
