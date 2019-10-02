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

@Component({
  selector: 'app-date-selection',
  templateUrl: './date-selection.component.html',
  styleUrls: [
    './date-selection.component.css'
    ]
})
export class DateSelectionComponent implements OnInit {

  public showFullCal: boolean = true;
  public intArray: number[] = [1,2,3,4,5,6,7];

  public monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  /**
   * This is used to hold the current month displayed on the calendar (in Date format)
   */
  public currentDate: Date;

  public selectedMonth: string = this.monthNames[new Date().getMonth()];

  public calendarArray: Date[][];

  public calendarDateArray: CalendarDate[][];

  public shoppingCart: ShoppingCartViewDTO = new ShoppingCartViewDTO();

  selectedDateTimeSlotsMorning: TimeSlotResultDTO[] = [];
  selectedDateTimeSlotsAfternoon: TimeSlotResultDTO[] = [];
  selectedDateTimeSlotsEvening: TimeSlotResultDTO[] = [];

  selectedCalendarDate: CalendarDate;
  selectedTimeSlot: TimeSlotResultDTO;

  public subscription: Subscription;

  /**
   * Are there any days available for the selected time range
   */
  public daysAvailableInRange: boolean = true;

  constructor(private storefrontService: StorefrontService,
    private shoppingCartService: ShoppingCartService,
    private imageService: ImageService,
    private router: Router) {
    this.currentDate = new Date();
    let shoppingCarDTO: ShoppingCartDTO = this.shoppingCartService.getShoppingCart();
    this.shoppingCart = new ShoppingCartViewDTO(shoppingCarDTO);

    // Subscribe to shopping cart updates
    this.subscription = shoppingCartService.shippingCartUpdateResult$.subscribe(
    shoppingCart => {
        this.shoppingCart = new ShoppingCartViewDTO(shoppingCart);
    });
  }

  ngOnInit() {
    //Un comment this to test with specific dates
    //let curentDate = new Date();
    //let curentDate = new Date(2017, 11, 1);
    
    let calendarStartDate = new Date(this.currentDate);
    let serviceStartDate = new Date();
    let serviceEndDate = this.getLastDayOfMonth(serviceStartDate);

    let shoppingCartDTO: ShoppingCartDTO = this.shoppingCartService.getShoppingCart();
    let appointmentStartDateTime = shoppingCartDTO.appointmentStartDateTime

    if(appointmentStartDateTime) {
      let parsedAppointmentStartDateTime = moment(appointmentStartDateTime, "YYYY-MM-DD'T'HH:mm").toDate();

      if(moment(new Date()).isAfter(parsedAppointmentStartDateTime)) {
        shoppingCartDTO.appointmentStartDateTime = null;
        appointmentStartDateTime = null;
      }

    }

    // If a an appointment start time has already been selected for the appointment in saved to the shopping card,
    // get the calendar array from the appointment date and set the servicesStartDate and endDate to that date
    if(appointmentStartDateTime) {
      let parsedAppointmentStartDateTime = moment(appointmentStartDateTime, "YYYY-MM-DD'T'HH:mm").toDate();
      calendarStartDate = parsedAppointmentStartDateTime;
      this.selectedMonth = this.monthNames[parsedAppointmentStartDateTime.getMonth()];

      // If the selected appointment month is after this month, set the start date
      // for the search to the first day of that month
      if(this.compareDateMonths(parsedAppointmentStartDateTime, new Date()) > 0) {
        serviceStartDate = this.getFirstDayOfMonth(parsedAppointmentStartDateTime);
        this.currentDate = new Date(serviceStartDate);
      }

      serviceEndDate = this.getLastDayOfMonth(parsedAppointmentStartDateTime);
    }

    this.calendarArray = this.getCalendarArray(calendarStartDate);
    
    let storefrontAvailabilityResultDTO: StorefrontAvailabilityResultDTO;
    let storefrontId = this.shoppingCart.storefrontId;
    let selectedServcieProviderId = 0;

    if(shoppingCartDTO.staffSelected) {
      selectedServcieProviderId = this.shoppingCart.serviceProviderId;
    }

    this.shoppingCartService.getAvailableTimeSlots(selectedServcieProviderId, serviceStartDate, serviceEndDate, true, 1, 0 )
      .subscribe(result => {
          storefrontAvailabilityResultDTO = result;
          this.calendarDateArray = this.getCalendarDateAvailability(this.calendarArray, storefrontAvailabilityResultDTO);
        });
  }

  /**
   * Compare if the month of dateOne is before, equal to or after the month of dateTwo
   * @param dateOne 
   * @param dateTwo 
   */
  compareDateMonths(dateOne: Date, dateTwo: Date) {

    if (dateOne.getMonth() === dateTwo.getMonth()) {
      if (dateOne.getFullYear < dateTwo.getFullYear) {
          return -1;
      } else if (dateOne.getFullYear === dateTwo.getFullYear) {
        return 0;
      } else {
        return 1;
      }
    } else {
      if (dateOne < dateTwo) {
        return -1;
      } else {
        return 1;
      }
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
    this.daysAvailableInRange = true;

    this.selectedCalendarDate = null;
    this.selectedDateTimeSlotsMorning = [];
    this.selectedDateTimeSlotsAfternoon = [];
    this.selectedDateTimeSlotsEvening = [];

    if (this.currentDate.getMonth() == 11) {
        this.currentDate = new Date(this.currentDate.getFullYear() + 1, 0, 1);
    } else {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    }

    this. calendarArray = this.getCalendarArray(this.currentDate);
    this.selectedMonth = this.monthNames[this.currentDate.getMonth()];
    let storefrontId = this.shoppingCart.storefrontId;
    let selectedServcieProviderId = this.shoppingCart.serviceProviderId;
    
    

    this.shoppingCartService.getAvailableTimeSlots(selectedServcieProviderId, this.getFirstDayOfMonth(this.currentDate), this.getLastDayOfMonth(this.currentDate), true, 1, 0 )
      .subscribe(result => {
          
          this.calendarDateArray = this.getCalendarDateAvailability(this.calendarArray, result);
          
        });
  }

  /**
   * Decrease the date displayed on the calendar by on month
   * The calendar month cannot be decreased passed the current month
   */
  decreaseCalMonth(): void { 
    this.daysAvailableInRange = true;

    this.selectedCalendarDate = null;
    this.selectedDateTimeSlotsMorning = [];
    this.selectedDateTimeSlotsAfternoon = [];
    this.selectedDateTimeSlotsEvening = [];

    if (this.currentDate.getMonth() == 0) {
        this.currentDate = new Date(this.currentDate.getFullYear() - 1, 11, 1);
    } else {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    }

    if(moment().isAfter(this.currentDate, 'day')) {
      this.currentDate = new Date();
    }

    this.calendarArray = this.getCalendarArray(this.currentDate);
    this.selectedMonth = this.monthNames[this.currentDate.getMonth()];
    let storefrontId = this.shoppingCart.storefrontId;
    let selectedServcieProviderId = this.shoppingCart.serviceProviderId;

    

    this.shoppingCartService.getAvailableTimeSlots(selectedServcieProviderId, this.currentDate, this.getLastDayOfMonth(this.currentDate), true, 1, 0 )
      .subscribe(result => {
          
          this.calendarDateArray = this.getCalendarDateAvailability(this.calendarArray, result);
        });
  }

  getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  daysInThisMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  /**
   * @param {int} The month number, 0 storefrontd
   * @param {int} The year, not zero storefrontd, required to account for leap years
   * @return {Date[]} List with date objects for each day of the month
   */
  getArrayOfDaysInMonth(currentDate: Date): Date[] {
      let date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      let days = [];
      while (date.getMonth() === currentDate.getMonth()) {
          days.push(new Date(date));
          date.setDate(date.getDate() + 1);
      }
      return days;
  }


  /**
   * Create a 2 dimentional array containing the the calendar dates
   * The calendar will be 7 x numOfWeeks. The calendar array will only 
   * contain values for dates in the month. Ex
   * 
   * July/2017
   * 
   * -- -- -- -- -- -- 01
   * 02 03 04 05 06 07 08
   * 09 10 11 12 13 14 15
   * 16 17 18 19 20 21 22
   * 23 24 25 26 27 28 29
   * 30 31 -- -- -- -- --
   * 
   * 
   * 
   * @param date 
   */
  getCalendarArray(date: Date): Date[][] {

    // Create an array containing all of the days of the month
    let arrayOfDaysInMonth = this.getArrayOfDaysInMonth(date);

    //alert('number of days in this month: ' + arrayOfDaysInMonth.length);

    // To create even partitions the array months not starting on sundays will 
    // will need to prepended with an array equal to the size of the number of 
    // days between the first of the month and the preceeding sunday.
    //
    // Months not ending on sundays will need to have an additional array concatinated
    // to the end. This array will be the number of days between the last day of the month
    // and the following sunday
    let numberOfDaysToAddToBeginning = arrayOfDaysInMonth[0].getDay();
    let numberOfDaysToAddToEnd = 6 - arrayOfDaysInMonth[arrayOfDaysInMonth.length - 1].getDay();

    //alert('numberOfDaysToAddToBeginning: ' + numberOfDaysToAddToBeginning );
    //alert('numberOfDaysToAddToEnd: ' + numberOfDaysToAddToEnd );

    let calPrefixArray = Array.apply(null, Array(numberOfDaysToAddToBeginning)).map(function () {});
    let calSuffixArray = Array.apply(null, Array(numberOfDaysToAddToEnd)).map(function () {});

    let fullCalArray = calPrefixArray.concat(arrayOfDaysInMonth, calSuffixArray);

    //alert('size of full cal array: ' + fullCalArray);

    //Partition the full array into a 2 dimensional array for easy parsing
    let partitionedArray = this.partition(fullCalArray, 7);

    return partitionedArray;

  }

  partition(items, size): any[] {
      let p = [];
      for (let i = Math.floor(items.length / size); i --> 0; ) {
          p[i] = items.slice(i * size, (i + 1) * size);
      }
      return p;
  }

  getCalendarDateAvailability(date: Date[][], storefrontAvailabilityResultDTO: StorefrontAvailabilityResultDTO): CalendarDate[][] {
    let calendarDateArr: CalendarDate[] = [];
    let calendarDateInex = 0;
    let storefrontAvailabilityResultIndex = 0;

    // Set date selected to today by default
    let dateSelected = new Date();
    let appointmentHasDate = false;
    let shoppingCartDTO = this.shoppingCartService.getShoppingCart();
    let appointmentStartDateTime = shoppingCartDTO.appointmentStartDateTime

    // If an order has been started, set dateSelected to the appointmentStartDate
    if(appointmentStartDateTime) {
      dateSelected = moment(appointmentStartDateTime, "YYYY-MM-DD'T'HH:mm").toDate();
      appointmentHasDate = true;
    } 
    
    // USING THE DATE THE USER SELECTED AFTER NAVIGATING IS CONFUSING
    // USE THE FISRST DATE OF THE CURRENT MONTH AFTER NAVIGATION
    // else if (this.selectedCalendarDate && this.selectedTimeSlot) {
    //   //If the user has selected a date, use that date
    //   let dateStr = moment(this.selectedCalendarDate.date).format('YYYY-MM-DD');
    //   let timeStr = moment(this.selectedTimeSlot.startTime, 'hh:mma').format('hh:mma');
    //   dateSelected = moment(dateStr + ' ' + timeStr, 'YYYY-MM-DD hh:mma').toDate();
    //   appointmentHasDate = true;
    //   alert(dateSelected);
    // }

    let oneDimDateArr: Date[] = [];

    for(let i = 0; i < date.length; i++){
      for(let j = 0; j < date[i].length; j++) {
        oneDimDateArr.push(date[i][j]);
        calendarDateArr.push(null);
      }
    }

    //console.log(oneDimDateArr);

    let firstTimeSlotSelected = false;
    let firstDateSelected = false;

    let noDaysAvailable = true;

    for(let i = 0; i < oneDimDateArr.length; i++){


      //console.log(oneDimDateArr[i]);

      let calendarDate: CalendarDate = new CalendarDate;

      //If the date is populated and the last availability date for the month hasn't been reached
      if(oneDimDateArr[i] && storefrontAvailabilityResultDTO.dateTimeSlots[storefrontAvailabilityResultIndex] && this.parseAndCompareDates(oneDimDateArr[i], storefrontAvailabilityResultDTO.dateTimeSlots[storefrontAvailabilityResultIndex].date)) {
        //There is availability on this day, so create availability
        calendarDate.date = oneDimDateArr[i];
        if(storefrontAvailabilityResultDTO.dateTimeSlots[storefrontAvailabilityResultIndex].timeSlots.length !== 0){
          calendarDate.available = true;
          
          noDaysAvailable = false;
        }
        
        // Populate timeslots and set selected
        for(let timeSlot of storefrontAvailabilityResultDTO.dateTimeSlots[storefrontAvailabilityResultIndex].timeSlots){
          let calendarDayTimeSlot: TimeSlotResultDTO = new TimeSlotResultDTO();
          calendarDayTimeSlot.serviceProviderId = timeSlot.serviceProviderId;
          calendarDayTimeSlot.startTime = this.convertTimeFrom24hTo12h(timeSlot.startTime);

          calendarDayTimeSlot.selected = false;
          
          // If a date has been selected, check to see if the current time slot is the time selected
          // if so select it
          if(this.compareDateMonths(calendarDate.date, dateSelected) === 0 && appointmentHasDate && moment(calendarDate.date).isSame(dateSelected, 'day') && this.compareTimeStringToDateTime(calendarDayTimeSlot.startTime, dateSelected) === 0) {
            calendarDayTimeSlot.selected = true;

            //Set the previously selected timeslot to !selected
            if (this.selectedTimeSlot) {
              this.selectedTimeSlot.selected = false;
            }

            this.selectedTimeSlot = calendarDayTimeSlot;
            
          } else if (((this.compareDateMonths(calendarDate.date, dateSelected) !== 0 && appointmentHasDate)
          || !appointmentHasDate || moment(new Date()).isAfter(dateSelected)) && !firstTimeSlotSelected) { // Set first timeslot as selected
            //Set the previously selected timeslot to !selected
            if (this.selectedTimeSlot) {
              this.selectedTimeSlot.selected = false;
            }

            this.selectedTimeSlot = calendarDayTimeSlot;
            this.selectedTimeSlot.selected = true;
            firstTimeSlotSelected = true;
          }

          // Add the timeslots to the correct array for morning afternoon and evening
          calendarDate.timeSlots.push(calendarDayTimeSlot);

          let hour = +timeSlot.startTime.substring(0, 2);
          
          if (hour < 12) {
            calendarDate.timeSlotsMorning.push(calendarDayTimeSlot);
          } else if (hour > 11 && hour < 18){
            calendarDate.timeSlotsAfternoon.push(calendarDayTimeSlot);
          } else {
            calendarDate.timeSlotsEvening.push(calendarDayTimeSlot)
          }
        }

        // If the appointment has a date and the date selected is the same day as today, populate set this date 
        // as selected and populate the timeslots
        if (this.compareDateMonths(calendarDate.date, dateSelected) === 0 && appointmentHasDate && moment(calendarDate.date).isSame(dateSelected, 'day')) {
          calendarDate.selected = true;
          this.selectedCalendarDate = calendarDate;

          if(storefrontAvailabilityResultDTO.dateTimeSlots[storefrontAvailabilityResultIndex].timeSlots.length !== 0){
            this.selectedDateTimeSlotsMorning = calendarDate.timeSlotsMorning;
            this.selectedDateTimeSlotsAfternoon = calendarDate.timeSlotsAfternoon;
            this.selectedDateTimeSlotsEvening = calendarDate.timeSlotsEvening;
          } else {
            this.selectedDateTimeSlotsMorning = [];
            this.selectedDateTimeSlotsAfternoon = [];
            this.selectedDateTimeSlotsEvening = [];
          }
        } else if( //If there is no date selected (or the date has been selected and the calendar month has changed), select the first date available
          ((this.compareDateMonths(calendarDate.date, dateSelected) !== 0 && appointmentHasDate)
          || !appointmentHasDate || moment(new Date()).isAfter(dateSelected)) && !firstDateSelected && calendarDate.available) { 
          calendarDate.selected = true;
          this.selectedCalendarDate = calendarDate;

          if(storefrontAvailabilityResultDTO.dateTimeSlots[storefrontAvailabilityResultIndex].timeSlots.length !== 0){
            this.selectedDateTimeSlotsMorning = calendarDate.timeSlotsMorning;
            this.selectedDateTimeSlotsAfternoon = calendarDate.timeSlotsAfternoon;
            this.selectedDateTimeSlotsEvening = calendarDate.timeSlotsEvening;
          } else {
            this.selectedDateTimeSlotsMorning = [];
            this.selectedDateTimeSlotsAfternoon = [];
            this.selectedDateTimeSlotsEvening = [];
          }

          firstDateSelected = true;
        }

        calendarDateArr[i] = calendarDate;

        //console.log(calendarDateArr[i].date);
        storefrontAvailabilityResultIndex = storefrontAvailabilityResultIndex + 1;
        //console.log('storefrontAvailabilityIndex: ' + storefrontAvailabilityResultIndex);
      } else {
        //There is no avaiability on this day
        calendarDate.available = false;
        calendarDate.date = oneDimDateArr[i];
        calendarDateArr[i] = calendarDate;

      }
    }

    if(noDaysAvailable) {
      this.daysAvailableInRange = false;
    }

    //console.log(calendarDateArr);

    let partitionedArray = this.partition(calendarDateArr, 7);
    return partitionedArray;

  }

  compareTimeStringToDateTime(timeOne: string, date: Date) {
    //alert(date + ' ' + timeOne);
    let timeOneMoment = moment(timeOne, 'HH:mm a');
    let dateTimeString = moment(date).format('HH:mm a');
    let timeTwoMoment = moment(dateTimeString, 'HH:mm a');

    if (timeOneMoment.isBefore(timeTwoMoment)){
      return -1;
    } else if(timeOneMoment.isSame(timeTwoMoment, 'minute')) {
      //alert(timeOneMoment.toISOString() + ' ' + timeTwoMoment.toISOString());
      return 0;
    } else {
      return 1;
    }
  }

  // First parse the passed date string into a date then compare the dates
  // To see if they fall on the same day. 
  // The format for date2 is 'yyyy-MM-dd'
  parseAndCompareDates(date1: Date, date2: string){
    let parts = date2.split('-');
    //please put attention to the month (parts[0]), Javascript counts months from 0:
    // January - 0, February - 1, etc
    let parsedDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])); 
    //console.log('comparing: ' + date1.getDate() + ' to ' + parsedDate.getDate());
    return date1.getDate() === parsedDate.getDate();

  }

  getDateClass(calendarDay: CalendarDate): string {
    // alert(JSON.stringify(calendarDay));

    let dateCSSClass = '';
    if (this.isDateToday(calendarDay.date)){
      // dateCSSClass = 'date-div-selected';
      dateCSSClass = 'selected';
    } else if (calendarDay.available){
      dateCSSClass = 'date-div-available';
    } else {
      dateCSSClass = '';
    }

    return dateCSSClass;
  }

  private isDateToday(inputDate: Date): boolean {
    //console.log('input: ' + inputDate + ' today ' + new Date());
    if (!inputDate) { // inputDate can be undefined for days outside of the currently displayed month;
      return false;
    }

    let dateIsToday = false;
    
    // Get today's date
    var todaysDate = new Date();

    // call setHours to take the time out of the comparison
    if (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
        dateIsToday = true;
    }

    return dateIsToday;
  }

  selectDate(calendarDay: CalendarDate, elementRef: ElementRef) {
    elementRef.nativeElement.style = '';
  }

  /**
   * When a new date is selected, set the selected timeslot
   * @param calendarDay 
   */
  getAvailableTimeSlots(calendarDay: CalendarDate) {

    if (!calendarDay.available) {
      return;
    }

    // Set date selected to today by default
    let dateSelected;
    let shoppingCartDTO = this.shoppingCartService.getShoppingCart();
    let appointmentStartDateTime = shoppingCartDTO.appointmentStartDateTime;

    // If an order has been started, set dateSelected to the appointmentStartDate
    if(appointmentStartDateTime) {
      dateSelected = moment(appointmentStartDateTime, "YYYY-MM-DD'T'HH:mm").toDate();
    }

    for(let i = 0; i < this.calendarDateArray.length; i++){
      for(let j = 0; j <  this.calendarDateArray[i].length; j++){
        
        // Set all dates to un-selected
        if(this.calendarDateArray[i][j]){
          this.calendarDateArray[i][j].selected = false;
        }

        // select the date just clicked
        if(this.calendarDateArray[i][j] && this.calendarDateArray[i][j].date
          && this.calendarDateArray[i][j].date === calendarDay.date) {
          this.calendarDateArray[i][j].selected = true;
          this.selectedCalendarDate = this.calendarDateArray[i][j];

          //this.currentDate = new Date(this.calendarDateArray[i][j].date);
        }

      }
    }

    let firstTimeSlotSelected = false;

    if(calendarDay && calendarDay.timeSlots && calendarDay.timeSlots[0]) {
            

            //Set the previously selected timeslot to !selected
            if (this.selectedTimeSlot) {
              this.selectedTimeSlot.selected = false;
            }

            calendarDay.timeSlots[0].selected = true;
            this.selectedTimeSlot = calendarDay.timeSlots[0];
            this.selectedDateTimeSlotsMorning = calendarDay.timeSlotsMorning;
            this.selectedDateTimeSlotsAfternoon = calendarDay.timeSlotsAfternoon;
            this.selectedDateTimeSlotsEvening = calendarDay.timeSlotsEvening;
    }

    for(let timeSlot of calendarDay.timeSlots){          
          //If a date has been selected check to see if the current time slot is the time selected
          // if so select it
          if(dateSelected && moment(calendarDay.date).isSame(dateSelected, 'day') && this.compareTimeStringToDateTime(timeSlot.startTime, dateSelected) === 0) {
            
            
            //Set the previously selected timeslot to !selected
            if (this.selectedTimeSlot) {
              this.selectedTimeSlot.selected = false;
            }
            
            timeSlot.selected = true;
            this.selectedTimeSlot = timeSlot;
            this.selectedDateTimeSlotsMorning = calendarDay.timeSlotsMorning;
            this.selectedDateTimeSlotsAfternoon = calendarDay.timeSlotsAfternoon;
            this.selectedDateTimeSlotsEvening = calendarDay.timeSlotsEvening;
          }
        }

    // this.selectedDateTimeSlotsMorning = calendarDay.timeSlotsMorning;
    // this.selectedDateTimeSlotsAfternoon = calendarDay.timeSlotsAfternoon;
    // this.selectedDateTimeSlotsEvening = calendarDay.timeSlotsEvening;

    // if (this.selectedDateTimeSlotsMorning.length > 0){
    //   this.selectedTimeSlot.selected = false;
    //   this.selectedDateTimeSlotsMorning[0].selected = true;
    //   this.selectedTimeSlot = this.selectedDateTimeSlotsMorning[0];

    // } else if (this.selectedDateTimeSlotsAfternoon.length > 0) {
    //   this.selectedTimeSlot.selected = false;
    //   this.selectedDateTimeSlotsMorning[0].selected = true;
    //   this.selectedTimeSlot = this.selectedDateTimeSlotsAfternoon[0];

    // } else if (this.selectedDateTimeSlotsEvening.length > 0) {
    //   this.selectedTimeSlot.selected = false;
    //   this.selectedDateTimeSlotsMorning[0].selected = true;
    //   this.selectedTimeSlot = this.selectedDateTimeSlotsEvening[0];

    // }

  }

  private convertTimeFrom24hTo12h(time: string): string {
    let convertedTime: string;

    let hours = time.substr(0, 2);

    let convertedHours = ((+hours + 11) % 12 + 1);

    let suffix = +time.substr(0, 2) < 12 ? 'am' : 'pm';
  
    return convertedHours + '' + time.substring(2, 5) + suffix;

  }

  selectTime(timeSlotResultDTO: TimeSlotResultDTO) {
    if (this.selectedTimeSlot) {
        this.selectedTimeSlot.selected = false;
      }

      timeSlotResultDTO.selected = true;
      this.selectedTimeSlot = timeSlotResultDTO;
  }

	reviewAppointment() {
    let apptDateAndTime =
      this.formatDateAptDate(this.selectedCalendarDate.date) + 'T' + this.format12HTimeTo24HTime(this.selectedTimeSlot.startTime);
    
    this.shoppingCartService.setAppointmentDateAndTime(apptDateAndTime, '').subscribe(() =>
      {
        let shoppingCartDTO = this.shoppingCartService.getShoppingCart();
        //console.log(shoppingCartDTO)
        this.router.navigateByUrl('checkout');
      });
  }

  formatDateAptDate(dateToBeFormatted: Date): string {
    // let dateFormat = dateToBeFormatted.getFullYear + '-' + (+dateToBeFormatted.getMonth 

    let dateFormat = require('dateformat');
    let formattedDate = dateFormat(dateToBeFormatted, 'isoDate');

    return formattedDate;
  }

  format12HTimeTo24HTime(time: string) {
    // alert('Unformatted time: ' + time);
    let timeParts = time.split(':');
    let hours = +timeParts[0];
    let minutes = +timeParts[1].substr(0, 2);
    let AMPM = timeParts[1].substr(2, 4);

    // alert('Hours: ' + hours + ' minutes: ' + minutes + 'ampm: ' + AMPM);

    if(AMPM.toUpperCase() === 'PM' && hours < 12) {
      hours = hours + 12;
    }

    if (AMPM.toUpperCase() === 'AM' && hours === 12) {
      hours = hours - 12;
    }

    let sHours = hours.toString();
    let sMinutes = minutes.toString();

    if (hours < 10) {
      sHours = '0' + sHours;
    }

    if (minutes < 10) {
      sMinutes = '0' + sMinutes;
    }

    let formattedTime = sHours + ':' + sMinutes;
    
    // alert('Formatted Time: ' + formattedTime);
    return formattedTime;
  }

  getCheckoutDateFormatted(): string {
    // https://www.npmjs.com/package/dateformat
    let dateFormat = require('dateformat');

    if(this.selectedCalendarDate){
      return dateFormat(this.selectedCalendarDate.date, "ddd, mmm dS") + ' ' + this.selectedTimeSlot.startTime;
    } else {
        return '';
    }
  }

  getCheckoutDateFormattedSm(): string {
    let dateFormat = require('dateformat');

    if (this.selectedCalendarDate) {
        return dateFormat(this.selectedCalendarDate.date, "dddd, mmmm dS, yyyy") + ' ' + this.selectedTimeSlot.startTime;
    } else {
        return '';
    }
  }

  getImage(imgUrl: string): string {
    return this.imageService.getImgUrl(imgUrl);
  }

  removeService(serviceId: number) {
    this.shoppingCartService.removeService(this.shoppingCart.storefrontId, serviceId).subscribe(() => {
    });
  }

  // Check to see if date selected is current month
  // if so, do not allow back 
  allowBack() {
    let allowBack = false;
    let thisMonth = moment(new Date(), "MM/YYYY")
    let selectedMonth = moment(this.currentDate, "MM/YYYY")
    
    if(selectedMonth.isAfter(thisMonth, 'month')) {
      allowBack = true;
    }
    
    return allowBack;
  }

}

