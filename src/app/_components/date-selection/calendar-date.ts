import { TimeSlotResultDTO } from './../../_models/dto/timeslot-result-dto';

export class CalendarDate {

    date: Date;
    selected: boolean;
    available: boolean;
    timeSlots: TimeSlotResultDTO[] = [];
    timeSlotsMorning: TimeSlotResultDTO[] = [];
    timeSlotsAfternoon: TimeSlotResultDTO[] = [];
    timeSlotsEvening: TimeSlotResultDTO[] = [];

}