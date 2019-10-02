export class AppointmentResultDTO {
    id: number;
    serviceProviderDisplayName: string;
    storefrontName: string;
    storefrontImageUrl: string;
    rating: string;
    price: number;
    startDate: string; //Format E, MMM dd yyyy hh:mm a
    status: string; // CONFIRMED, COMPLETE, CANCELED_BY_USER, CANCLED_BY_SERVICE_PROVIDER

    refunded: boolean
	fullyRefunded: boolean;
    reoccurringAppointmentParentId: number;
    
}
