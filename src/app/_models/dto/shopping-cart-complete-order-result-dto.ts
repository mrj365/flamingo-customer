export class ShoppingCartCompleteOrderResultDTO {
    confirmed: boolean;
    /**
     * Format E, MMM dd yyyy hh:mm a
     * Example: "Thurs, Febuary 1 2018 10:00 AM
     */
	appointmentDate: string;
	message: string;
	
    /**
     * allowableValues: CONFIRMED, DECLINED, TIME_OUT
     */
    confirmationStatus: string;
}