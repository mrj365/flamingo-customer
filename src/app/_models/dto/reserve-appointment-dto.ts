import { OrderItemDTO } from './order-item-dto';
export class ReserveAppointmentDTO {

	orderId: number;
	appointmentId: number;
	
	/**
	 * Format E, MMM dd yyyy hh:mm a
	 */
    appointmentStartDateTime: string;
    storefrontDisplayName: string;
	
	address1: string;
	address2: string;
	city: string;
	state: string;
	zip: string;
	latitude: number;
	longitude: number;
	
	services: OrderItemDTO[] = [];
	paymentMethodGuid: string;
	paymentMethodType: string;
	paymentMethodLast4: string;
	subtotal: number;
	bookingFee: number;
	tax: number;
	total: number;
}