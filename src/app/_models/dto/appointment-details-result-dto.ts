import { ShoppingCartCustomizationGroupResultDTO } from './shopping-cart-customization-group-result-dto';
import { AppointmentDetailsServicesResultDTO } from './appointment-details-services-result-dto';
import { NumberWrapper } from '@angular/core/src/facade/lang';

export class AppointmentDetailsResultDTO {

    appointmentId: number;
	guid: string;

    status: string;

    services: AppointmentDetailsServicesResultDTO[] = [];
    
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

	orderCustomizationGroups: ShoppingCartCustomizationGroupResultDTO[] = [];

	reoccurring: boolean;
	periodType: string;

	applyGiftCardBalance: boolean;
	giftCardAmountApplied: string;
}