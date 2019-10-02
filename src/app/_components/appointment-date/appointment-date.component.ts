import { TimeSlotViewDTO } from './time-slot-view-dto';
import { CalendarViewDTO } from './calendar-view-dto';
import { StorefrontAvailabilityResultDTO } from './../../_models/dto/storefront-availability-result-dto';
import { StorefrontService } from './../../_services/storefront.service';
import { TimeSlotResultDTO } from './../../_models/dto/timeslot-result-dto';
import { ShoppingCartViewDTO } from './../../_models/view/dto/shopping-cart-view-dto';
import { Subscription } from 'rxjs/Subscription';
import { ShoppingCartDTO } from './../../_models/dto/shopping-cart-dto';
import { Router } from '@angular/router';
import { ImageService } from './../../_services/image.service';
import { ShoppingCartService } from './../../_services/shopping-cart.service';
import { CalendarDate } from './calendar-date';
import { Component, OnInit, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-appointment-date',
  templateUrl: './appointment-date.component.html',
  styleUrls: ['./appointment-date.component.css']
})
export class AppointmentDateComponent implements OnInit {
  public showFullCal: boolean = true;

  public calendarDTO: CalendarViewDTO = new CalendarViewDTO();

  public shoppingCart: ShoppingCartViewDTO = new ShoppingCartViewDTO();

  // selectedCalendarDate: CalendarDate = new CalendarDate();
  // selectedTimeSlot: TimeSlotResultDTO;

  public subscription: Subscription;

  public reoccurringText: string = '';
  public pickupProfile = environment.pickupProfile;
  public enableTimeSelection = environment.enableTimeSelection;


  /**
   * Are there any days available for the selected time range
   */
  public daysAvailableInRange: boolean = true;

  constructor(private storefrontService: StorefrontService,
    private shoppingCartService: ShoppingCartService,
    private imageService: ImageService,
    private router: Router) {

    let shoppingCarDTO: ShoppingCartDTO = this.shoppingCartService.getShoppingCart();
    this.shoppingCart = new ShoppingCartViewDTO(shoppingCarDTO);

    // Subscribe to shopping cart updates
    this.subscription = shoppingCartService.shippingCartUpdateResult$.subscribe(
    shoppingCart => {
        this.shoppingCart = new ShoppingCartViewDTO(shoppingCart);
    });

    this.loadCal(0);
  }

  ngOnInit() {


  }


  loadCal(offset: number) {
    this.shoppingCartService.getFormattedAvailableTimeSlots(offset, this.calendarDTO.periodType).subscribe(calendarResultDTO => {
      this.calendarDTO = new CalendarViewDTO(calendarResultDTO);
      this.setRocurringText();
    });
  }

  setRocurringText() {
    if(!this.calendarDTO.periodType || this.calendarDTO.periodType === 'NONE') {
      this.reoccurringText = 'Does not repeat';
    } else if(this.calendarDTO.periodType === 'WEEKLY') {
      this.reoccurringText = 'Weekly';
    } else if(this.calendarDTO.periodType === 'BIWEEKLY') {
      this.reoccurringText = 'Bi-Weekly';
    }
  }

  ngAfterViewInit() {
       window.scrollTo(0, 0);
   }

  toggleFullCal(): void {
      this.showFullCal = this.showFullCal === true ? false : true;
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
    
    this.shoppingCartService.setAppointmentDateAndTime(apptDateAndTime, this.calendarDTO.periodType).subscribe(() =>
      {
        let shoppingCartDTO = this.shoppingCartService.getShoppingCart();
        //console.log(shoppingCartDTO)
        this.router.navigateByUrl('checkout');
      });
  }

  removeService(serviceId: number) {
    this.shoppingCartService.removeService(this.shoppingCart.storefrontId, serviceId).subscribe(() => {
    });
  }

  getAppointmentDate() {
    let formattedDate = '';
    if(this.enableTimeSelection && this.calendarDTO && this.calendarDTO.selectedCalendarDate && 
        this.calendarDTO.selectedCalendarDate.selectedTimeSlot) {
          formattedDate = this.calendarDTO.selectedCalendarDate.selectedTimeSlot.formattedCheckoutDateTime;
    } else if(!this.enableTimeSelection && this.calendarDTO && this.calendarDTO.selectedCalendarDate && 
      this.calendarDTO.selectedCalendarDate.selectedTimeSlot) {
        formattedDate =  moment(this.calendarDTO.selectedCalendarDate.date).format('dddd, MMMM Do YYYY');
      }

      return formattedDate;
  }

  formatDateWithoutTime(unformattedDate: string) {
    if(unformattedDate) {
      return moment(unformattedDate).format('dddd, MMMM Do YYYY');
    }
  }

}

