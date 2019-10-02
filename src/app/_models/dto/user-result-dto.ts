import { UserSavedSearchAddressResultDTO } from './user-saved-search-address-result-dto';
export class UserResultDTO {
    id: number;
    firstName: string;
    lastName: string
    email: string;
    phone: string;
    imgUrl: string;
    savedSearchAddresses: UserSavedSearchAddressResultDTO[] = [];
}