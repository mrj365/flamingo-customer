import { ShoppingCartCustomizationGroupResponse } from './../response/shopping-cart-customization-group-response';
import { ShoppingCartCustomizationGroupResultDTO } from './shopping-cart-customization-group-result-dto';
import { ShoppingCartServiceDTO } from './shopping-cart-service-dto';
export class ShoppingCartDTO {

    static readonly DEFAULT_SERVICE_PROVIDER_ID = 0;
    static readonly DEFAULT_SERVICE_PROVIDER_DISPLAY_NAME = 'Any Staff';
    static readonly DEFAULT_SERVICE_PROVIDER_IMG_URL = '';

    status: string;

    storefrontId: number;

    /**
     * Format: yyyy-MM-dd'T'HH:mm
     */
    appointmentStartDateTime: string;
    services: ShoppingCartServiceDTO[] = [];
    serviceProviderId: number = 0;
	serviceProviderDisplayName: string;
	serviceProviderImgUrl: string;
	staffSelected: boolean;


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

	orderCustomizationGroups: ShoppingCartCustomizationGroupResponse[] = [];

	periodType: string;

	applyGiftCardBalance: boolean;
	totalPreGiftCard: string;
	giftCardAmountApplied: string;
}