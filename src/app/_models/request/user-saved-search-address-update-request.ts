export class UserSavedSearchAddressUpdateRequest {
    /**
     * saved address name
     */
	name: string;
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
}