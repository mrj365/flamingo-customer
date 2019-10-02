import { DateUtil } from './../../_util/date-util';
import { CalendarResultDTO } from './../../_models/dto/date/calendar-result-dto';
import { CalendarDate } from './calendar-date';


export class CalendarViewDTO {

    offset: number = 0;

    slotsAvailable: boolean;

    /**
     * Date selected for appointment in cart
     */
    appointmentDate: string;

    month: string;

    dateTimeSlots: CalendarDate[][] = [];

    searchStartDate: string;

    selectedCalendarDate: CalendarDate = new CalendarDate();

    periodType: string;

    constructor(calendarResultDTO?: CalendarResultDTO) {

        if(!calendarResultDTO) {
            return;
        }

        this.offset = calendarResultDTO.offset;
        this.slotsAvailable = calendarResultDTO.slotsAvailable;
        this.appointmentDate = calendarResultDTO.appointmentDate;
        this.month = DateUtil.dateMonth(calendarResultDTO.searchStartDate);
        this.periodType = calendarResultDTO.periodType;

        for(let i = 0; i < calendarResultDTO.dateTimeSlots.length; i++) {
            let calendarY: CalendarDate[] = [];
            for(let j = 0; j < calendarResultDTO.dateTimeSlots[i].length; j++) {
                let calendarDate: CalendarDate = new CalendarDate(calendarResultDTO.dateTimeSlots[i][j]);

                if(calendarDate.selected) {
                    this.selectedCalendarDate = calendarDate;
                }

                calendarY.push(calendarDate);
            }

            this.dateTimeSlots.push(calendarY);
        }

        this.searchStartDate = calendarResultDTO.searchStartDate;
    }

}