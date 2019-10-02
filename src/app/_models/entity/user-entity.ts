import { UserSavedSearchAddressEntity } from './user-saved-search-address-entity';
import { UserResultDTO } from './../dto/user-result-dto';
import { LocalStorageConstants } from '../constants/local-storage-constants';
import { Entity } from "app/_models/entity/entity";
import { UserSavedSearchAddressResponseDTO } from '../response/user-saved-search-address-response-dto';
import { UserSavedSearchAddressResultDTO } from '../dto/user-saved-search-address-result-dto';

export class UserEntity implements Entity {
    private key = LocalStorageConstants.LOCAL_USER_INFO_KEY;

    firstName: string;
    lastName: string
    email: string;
    phone: string;
    imgUrl: string;
    savedSearchAddresses: UserSavedSearchAddressEntity[] = [];

    constructor(userResult?: UserResultDTO) {
        if (userResult) {
        
            this.firstName = userResult.firstName;
            this.lastName = userResult.lastName;
            this.email = userResult.email;
            this.phone = userResult.phone;
            this.imgUrl = userResult.imgUrl;
            
            for(let savedSearchAddress of userResult.savedSearchAddresses) {
                let newUserSavedSearchAddress: UserSavedSearchAddressEntity = new UserSavedSearchAddressEntity();
                
                newUserSavedSearchAddress.id = savedSearchAddress.id;
                newUserSavedSearchAddress.address1 = savedSearchAddress.address1;
                newUserSavedSearchAddress.address2 = savedSearchAddress.address2;
                newUserSavedSearchAddress.city = savedSearchAddress.city;
                newUserSavedSearchAddress.state = savedSearchAddress.state;
                newUserSavedSearchAddress.zip = savedSearchAddress.zip;
                newUserSavedSearchAddress.latitude = savedSearchAddress.latitude;
                newUserSavedSearchAddress.longitude = savedSearchAddress.longitude;
                newUserSavedSearchAddress.name = savedSearchAddress.name;

                this.savedSearchAddresses.push(newUserSavedSearchAddress);
            }
        }
        
    }

    getUserResultDTO(): UserResultDTO {
        let userResultDTO: UserResultDTO = new UserResultDTO();
        // userResultDTO.id = this.id;
        userResultDTO.firstName = this.firstName;
        userResultDTO.lastName = this.lastName;
        userResultDTO.email = this.email;
        userResultDTO.phone = this.phone;
        userResultDTO.imgUrl = this.email;

        for (let savedSearchLocation of this.savedSearchAddresses) {
            let userSavedSearchAddressResultDTO: UserSavedSearchAddressResultDTO = new UserSavedSearchAddressResultDTO();
            userSavedSearchAddressResultDTO.address1 = savedSearchLocation.address1;
            userSavedSearchAddressResultDTO.address2 = savedSearchLocation.address2;
            userSavedSearchAddressResultDTO.city = savedSearchLocation.city;
            userSavedSearchAddressResultDTO.state = savedSearchLocation.state;
            userSavedSearchAddressResultDTO.zip = savedSearchLocation.zip;
            userSavedSearchAddressResultDTO.latitude = savedSearchLocation.latitude;
            userSavedSearchAddressResultDTO.longitude = savedSearchLocation.longitude;
            userSavedSearchAddressResultDTO.name = savedSearchLocation.name;

            userResultDTO.savedSearchAddresses.push(userSavedSearchAddressResultDTO);
        }

        return userResultDTO;
    }

    getKey(): string {
        return this.key;
    }

}

