import { PriceUtil } from './../../_util/price-util';
import { AppointmentDetailsServicesResultDTO } from './../../_models/dto/appointment-details-services-result-dto';
export class AppointmentDetailsServicesViewDTO {
    id: number;
    name: string;
    description: string;
    price: string;
    imgUrl: string;
    quantity: number;
    quantityDescription: string;

    constructor(appointmentDetailsServicesResultDTO: AppointmentDetailsServicesResultDTO){
        this.id = appointmentDetailsServicesResultDTO.id;
        this.name = appointmentDetailsServicesResultDTO.name;
        this.description = appointmentDetailsServicesResultDTO.description;

        if (appointmentDetailsServicesResultDTO.imgUrl) {
            this.imgUrl = appointmentDetailsServicesResultDTO.imgUrl;
        }

        this.price = PriceUtil.getPriceDecimalFormatted(appointmentDetailsServicesResultDTO.price);
        this.quantity = appointmentDetailsServicesResultDTO.quantity;
        this.quantityDescription = appointmentDetailsServicesResultDTO.quantityDescription;
    }
}