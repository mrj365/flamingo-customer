import { UserLastSearchedLocationResultDTO } from './user-last-searched-location-result-dto';
import { UserSavedSearchAddressResultDTO } from './user-saved-search-address-result-dto';
export class UserLoginResult {
    success: boolean;
    uniqueId: string;
    secret: string;

    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    imgUrl: string;
    savedSearchAddresses: UserSavedSearchAddressResultDTO[] = [];
    lastSearchedAddress: UserLastSearchedLocationResultDTO;
}