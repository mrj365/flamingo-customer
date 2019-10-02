import { TimeSlotResultDTO } from './../timeslot-result-dto';

export class CalendarDateResultDTO {

    date: string;
    selectedMonth: string
    selected: boolean;
    available: boolean;

    morningTimeSlots: TimeSlotResultDTO[] = [];
    afternoonTimeSlots: TimeSlotResultDTO[] = [];
    eveningTimeSlots: TimeSlotResultDTO[] = [];
}