import { ShoppingCartCustomizationGroupResponse } from './shopping-cart-customization-group-response';
import { AppointmentServiceResponseDTO } from './../dto/appointment-service-response-dto';
export class AppointmentDetailsResponse {
    appointmentId: number;
	guid: string;

    status: string;

    services: AppointmentServiceResponseDTO[] = [];
    
    storefrontId: number;
    storefrontDisplayName: string;

    /**
     * Format: yyyy-MM-dd'T'HH:mm
     */
    appointmentStartDateTime: string;
    
    serviceProviderId: number = 0;
	serviceProviderDisplayName: string;
	serviceProviderImgUrl: string;
	staffSelected: boolean;

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

	miscCostDescription: string;
	miscCost: number;

	cancellationFee: number;

	subtotal: number;
	bookingFee: number;
	tax: number;
	total: number;

	cumulativeTotalRefundAmount: number;
	cumulativeConvenienceFeeRefundAmount: number;
	cumulativeSubtotalotalRefundAmount: number;
	cumulativeGiftCardAmountAppliedRefundAmount: number;
	refunded: boolean;
	fullyRefunded: boolean;

	orderCustomizationGroups: ShoppingCartCustomizationGroupResponse[] = [];

	reoccurring: boolean;
	periodType: string;

	applyGiftCardBalance: boolean;
	giftCardAmountApplied: string;
}