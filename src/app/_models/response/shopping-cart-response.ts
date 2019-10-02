import { ShoppingCartServicesResponseDTO } from './dto/shopping-cart-services-response-dto';
import { ShoppingCartCustomizationGroupResponse } from './shopping-cart-customization-group-response';
export class ShoppingCartResponse {
    status: string;

    storefrontId: number;

    /**
     * Format: yyyy-MM-dd'T'HH:mm
     */
    appointmentStartDateTime: string;
    services: ShoppingCartServicesResponseDTO[] = [];
    serviceProviderId: number = 0;
	serviceProviderDisplayName: string;
	serviceProviderImgUrl: string;
	staffSelected: boolean;
	orderId: number;

    /**
	 * Id of appointment - This is different than the order id
	 */
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

    /*
     * VISA, MASTERCARD, AMERICAN_EXPRESS, DINERS_CLUB, DISCOVER, JCB, ACH, OTHER
     */
	paymentMethodType: string;
	subtotal: number;
	bookingFee: number;
	tax: number;
	total: number;

	orderCustomizationGroups: ShoppingCartCustomizationGroupResponse[] = [];

	periodType: string;

	applyGiftCardBalance: boolean;
	totalPreGiftCard: string;
	giftCardAmountApplied: string;
}