import { UserLastSearchedLocationResponseDTO } from './user-last-searched-location-response-dto';
import { UserSavedSearchAddressResponseDTO } from './user-saved-search-address-response-dto';
export class UserLoginResponse {
    success: boolean;
    uniqueId: string;
    secret: string;

    firstName: string;
    lastName: string
    email: string;
    phone: string;
    imgUrl: string;
    savedSearchAddresses: UserSavedSearchAddressResponseDTO[] = [];
    lastSearchedAddress: UserLastSearchedLocationResponseDTO;
    deviceUniqueId: string;
    behalfOfUser: boolean;
    adminSessId: string;
}