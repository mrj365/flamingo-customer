import { ShoppingCartCustomizationGroupResultDTO } from './../dto/shopping-cart-customization-group-result-dto';
import { ShoppingCartServicesEntity } from './shopping-cart-services-entity';
import { LocalStorageConstants } from './../constants/local-storage-constants';
import { ShoppingCartCustomizationGroupItemResultDTO } from '../dto/shopping-cart-customization-group-item-result-dto';
export class ShoppingCartEntity {
    private readonly key = LocalStorageConstants.SHOPPING_CART_KEY;

    status: string;
    storefrontId: number;

    /**
     * Format: yyyy-MM-dd'T'HH:mm
     */
    appointmentStartDateTime: string;
    services: ShoppingCartServicesEntity[] = [];
    serviceProviderId: number = 0;
	serviceProviderDisplayName: string;
	serviceProviderImgUrl: string;
	staffSelected: boolean;

    
    
    /////////////////////// items from response ////////////////////// 

	orderId: number;
	appointmentId: number;
    storefrontDisplayName: string;
	address1: string;
	address2: string;
	city: string;
	state: string;
	zip: string;
	latitude: number;
	longitude: number;
	customerImg: string;
	customerName: string;
	note: string;

	paymentMethodGuid: string;
	paymentMethodLast4: string;
	paymentMethodType: string;


	subtotal: number;
	bookingFee: number;
	tax: number;
	total: number;

	orderCustomizationGroups: ShoppingCartCustomizationGroupResultDTO[] = [];

	periodType: string;

	/**
	 * Has the users gift card balance been applied to the order
	 */
	applyGiftCardBalance: boolean;
	totalPreGiftCard: string;
	giftCardAmountApplied: string;

    getKey(): string {
        return this.key;
    }
}