import { CalendarDateResultDTO } from './calendar-date-result-dto';
export class CalendarResultDTO {

    slotsAvailable: boolean;

    appointmentDate: string;

    dateTimeSlots: CalendarDateResultDTO[][] = new CalendarDateResultDTO[0];

    searchStartDate: string;

    offset: number;

    periodType: string;
}