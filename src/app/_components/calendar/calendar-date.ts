import { TimeSlotViewDTO } from './time-slot-view-dto';
import { TimeSlotResultDTO } from './../../_models/dto/timeslot-result-dto';
import { CalendarDateResultDTO } from '../../_models/dto/date/calendar-date-result-dto';
import { DateUtil } from '../../_util/date-util';

export class CalendarDate {
    
    date: string;
    dayNumber: string = null;
    selected: boolean;
    available: boolean;

    morningTimeSlots: TimeSlotViewDTO[] = [];
    afternoonTimeSlots: TimeSlotViewDTO[] = [];
    eveningTimeSlots: TimeSlotViewDTO[] = [];

    selectedTimeSlot: TimeSlotViewDTO;

    constructor(calendarResult?: CalendarDateResultDTO) {

        if(!calendarResult) {
            return;
        }

        this.date = calendarResult.date;
        this.dayNumber = calendarResult.date ? DateUtil.dateToDayOfMonth(calendarResult.date) : null;
        this.selected = calendarResult.selected;
        this.available = calendarResult.available;

        for(let timeSlotResultDTO of calendarResult.morningTimeSlots) {
            let timeSlotViewDTO: TimeSlotViewDTO = new TimeSlotViewDTO(timeSlotResultDTO);

            if(timeSlotViewDTO.selected) {
                this.selectedTimeSlot = timeSlotViewDTO;
            }

            this.morningTimeSlots.push(timeSlotViewDTO);
        }

        for(let timeSlotResultDTO of calendarResult.afternoonTimeSlots) {
            let timeSlotViewDTO: TimeSlotViewDTO = new TimeSlotViewDTO(timeSlotResultDTO);

            if(timeSlotViewDTO.selected) {
                this.selectedTimeSlot = timeSlotViewDTO;
            }

            this.afternoonTimeSlots.push(timeSlotViewDTO);
        }

        for(let timeSlotResultDTO of calendarResult.eveningTimeSlots) {
            let timeSlotViewDTO: TimeSlotViewDTO = new TimeSlotViewDTO(timeSlotResultDTO);

            if(timeSlotViewDTO.selected) {
                this.selectedTimeSlot = timeSlotViewDTO;
            }

            this.eveningTimeSlots.push(timeSlotViewDTO);
        }

    }

    setFirstTimeSlotSelected() {
        let firstTimeSlotSet: boolean = false;
        for(let timeslot of this.morningTimeSlots) {
            if(!firstTimeSlotSet) {
                this.selectedTimeSlot = timeslot;
                this.selectedTimeSlot.selected = true;
                return;
            }
        }

        for(let timeslot of this.afternoonTimeSlots) {
            if(!firstTimeSlotSet) {
                this.selectedTimeSlot = timeslot;
                this.selectedTimeSlot.selected = true;
                return;
            }
        }

        for(let timeslot of this.eveningTimeSlots) {
            if(!firstTimeSlotSet) {
                this.selectedTimeSlot = timeslot;
                this.selectedTimeSlot.selected = true;
                return;
            }
        }


    }

}