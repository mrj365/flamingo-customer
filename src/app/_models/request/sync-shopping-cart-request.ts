import { ServiceQuantityRequest } from './service-quantity-request';
export class SyncShoppingCartRequest {

	storefrontId: number;
	serviceProviderId: number;
	services: ServiceQuantityRequest[] = [];
	

	address1: string;
	address2: string;
	city: string;
	state: string;
	zip: string;
	latitude: number;
	longitude: number;
}