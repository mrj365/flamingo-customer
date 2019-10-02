import { UserSavedSearchAddressResponseDTO } from './user-saved-search-address-response-dto';
export class UserResponse {
    id: number;
    firstName: string;
    lastName: string
    email: string;
    phone: string;
    imgUrl: string;
    savedSearchAddresses: UserSavedSearchAddressResponseDTO[] = [];
}