import { TimeSlotResultDTO } from './../../_models/dto/timeslot-result-dto';
import { DateUtil } from './../../_util/date-util';


export class TimeSlotViewDTO {

    startTime: string;
    
    serviceProviderId: number;

    selected: boolean = false;

    checkoutDateTime: string;

    formattedCheckoutDateTime: string;

    formattedCheckoutDateTimeSm: string;

    constructor(timeSlotResultDTO?: TimeSlotResultDTO) {
        this.startTime = DateUtil.format24HTimeTo12MeridieumTime(timeSlotResultDTO.startTime);
        this.serviceProviderId = timeSlotResultDTO.serviceProviderId;
        this.selected = timeSlotResultDTO.selected;
        this.checkoutDateTime = timeSlotResultDTO.fullAppointmentDate;
        this.formattedCheckoutDateTime = DateUtil.getCheckoutDateFormatted(timeSlotResultDTO.fullAppointmentDate);
        this.formattedCheckoutDateTimeSm = DateUtil.getCheckoutDateFormattedSm(timeSlotResultDTO.fullAppointmentDate);
    }
}