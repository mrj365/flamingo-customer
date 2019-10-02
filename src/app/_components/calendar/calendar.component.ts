import { AppointmentResultDTO } from './../../_models/dto/appointment-result-dto';
import { UserAppointmentService } from './../../_services/user-appointment.service.service';
import { Subscription } from 'rxjs/Subscription';
import { StorefrontService } from './../../_services/storefront.service';
import { ShoppingCartService } from './../../_services/shopping-cart.service';
import { ImageService } from './../../_services/image.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ShoppingCartDTO } from './../../_models/dto/shopping-cart-dto';
import { ShoppingCartViewDTO } from './../../_models/view/dto/shopping-cart-view-dto';
import { CalendarViewDTO } from './../appointment-date/calendar-view-dto';
import { TimeSlotViewDTO } from './../appointment-date/time-slot-view-dto';
import { CalendarDate } from './../appointment-date/calendar-date';
import { Component, OnInit } from '@angular/core';
import { UserAppointmentFilterEnum } from '../../_models/_enums/user-appointment-filter-enum.enum';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  public calendarDTO: CalendarViewDTO = new CalendarViewDTO();

  public subscription: Subscription;

  appointments: AppointmentResultDTO[] = [];

  public currentPage = 1;
  public pageCount = 1;



  /**
   * Are there any days available for the selected time range
   */
  public daysAvailableInRange: boolean = true;

  constructor(private storefrontService: StorefrontService,
    private shoppingCartService: ShoppingCartService,
    private imageService: ImageService,
    private router: Router, private userAppointmentService: UserAppointmentService,
                private activatedRoute: ActivatedRoute) {


    this.loadCal(0);
    this.queryAppointments(null);
  }

  ngOnInit() {


  }


  loadCal(offset: number) {
    this.shoppingCartService.getFormattedAvailableTimeSlots(offset, '').subscribe(calendarResultDTO => {
      this.calendarDTO = new CalendarViewDTO(calendarResultDTO);
    });
  }

    queryAppointments(filter: UserAppointmentFilterEnum) {
    // this.appointmentFilterValue = UserAppointmentFilterEnum[filter]
    //                                         .charAt(0).toUpperCase() + UserAppointmentFilterEnum[filter]
    //                                         .slice(1).toLocaleLowerCase();

    // this.setfilter(UserAppointmentFilterEnum[filter]);
    // this.filterEnum = filter;


    this.userAppointmentService.getUserAppointments(UserAppointmentFilterEnum.SCHEDULED, this.currentPage).subscribe(
        appointmentListResultDTO => {
            this.appointments = appointmentListResultDTO.appointments;

            
          this.currentPage = appointmentListResultDTO.currentPage;
          this.pageCount = appointmentListResultDTO.pageCount;
          window.scrollTo(0, 0);
        });
  }

  ngAfterViewInit() {
       window.scrollTo(0, 0);
   }

  /**
   * Increase the date displayed on the calendar by one month
   */
  increaseCalMonth(): void {
    this.calendarDTO.offset++;
    this.loadCal(this.calendarDTO.offset);
  }

  /**
   * Decrease the date displayed on the calendar by on month
   * The calendar month cannot be decreased passed the current month
   */
  decreaseCalMonth(): void { 
    this.calendarDTO.offset--;
    this.loadCal(this.calendarDTO.offset);
  }

  /**
   * When a new date is selected, set the selected timeslot
   * @param calendarDay 
   */
  getAvailableTimeSlots(calendarDay: CalendarDate) {
    if(!calendarDay || !calendarDay.available) {
      return;
    }

    this.calendarDTO.selectedCalendarDate.selected = false;
    this.calendarDTO.selectedCalendarDate.selectedTimeSlot.selected = false;

    calendarDay.selected = true;
    this.calendarDTO.selectedCalendarDate = calendarDay;
    this.calendarDTO.selectedCalendarDate.setFirstTimeSlotSelected();

  }

  selectTime(timeSlotViewDTO: TimeSlotViewDTO) {
    this.calendarDTO.selectedCalendarDate.selectedTimeSlot.selected = false;
    this.calendarDTO.selectedCalendarDate.selectedTimeSlot = timeSlotViewDTO;
    this.calendarDTO.selectedCalendarDate.selectedTimeSlot.selected = true;
  }

	reviewAppointment() {
    let apptDateAndTime = this.calendarDTO.selectedCalendarDate.selectedTimeSlot.checkoutDateTime;
    
    this.shoppingCartService.setAppointmentDateAndTime(apptDateAndTime, '').subscribe(() =>
      {
        let shoppingCartDTO = this.shoppingCartService.getShoppingCart();
        //console.log(shoppingCartDTO)
        this.router.navigateByUrl('checkout');
      });
  }

  getHeightByAppointmentLength(length: number): string {
    let x = length / 15;
    let y = (length - 1) / 15;
    console.log('x ' + x);

    let height = (24 * x);
    console.log('height ' + height);

    let extraHeightForHourlyBorders = Math.floor((y / 4) * 2);
    console.log('extraHeightForHourlyBorders ' + extraHeightForHourlyBorders);

    let totalHeight = height + extraHeightForHourlyBorders;

    console.log('totalHeight ' + totalHeight);
    return totalHeight + 'px';

  }

}

