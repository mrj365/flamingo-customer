import { TimeSlotResultDTO } from './timeslot-result-dto';


export class DateTimeSlotResultDTO {
    /**
     * yyyy-MM-dd
     */
    date: string;
    timeSlots: TimeSlotResultDTO[];
}