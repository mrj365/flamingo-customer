import { DateUtil } from './../../_util/date-util';
import { environment } from 'environments/environment';
import { UserAppointmentService } from './../../_services/user-appointment.service.service';
import { AppointmentResultDTO } from './../../_models/dto/appointment-result-dto';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserAppointmentFilterEnum } from '../../_models/_enums/user-appointment-filter-enum.enum';

@Component({
  selector: 'app-appointments-w-reoccurring',
  templateUrl: './appointments-w-reoccurring.component.html',
  styleUrls: ['./appointments-w-reoccurring.component.css']
})
export class AppointmentsWReoccurringComponent implements OnInit {

  public currentPage = 1;
  public pageCount = 1;

  public instantiatingAppointment: boolean = false;

  //Capitalize only the first letter of enum value
  public appointmentFilterValue: string = UserAppointmentFilterEnum[UserAppointmentFilterEnum.SCHEDULED]
                                            .charAt(0).toUpperCase() + UserAppointmentFilterEnum[UserAppointmentFilterEnum.SCHEDULED]
                                            .slice(1).toLocaleLowerCase();

  public filterEnum: UserAppointmentFilterEnum = UserAppointmentFilterEnum.SCHEDULED;

  appointments: AppointmentResultDTO[] = [];

  constructor(private router: Router, private userAppointmentService: UserAppointmentService,
                private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.filterEnum = this.getFilter();
    this.currentPage = this.getPage();

    this.setfilter();

    this.queryAppointments();

  }

    getPage(): number {
    let page = this.activatedRoute.snapshot.queryParams['page'];

    if( page ) {
      return page;
    } else {
      return 1;
    }
  }

  getFilter(): UserAppointmentFilterEnum {
    let filter:string = this.activatedRoute.snapshot.queryParams['filter'];

    if(filter) {
      try {
        return UserAppointmentFilterEnum[filter];
      } catch(e) {
        return UserAppointmentFilterEnum.SCHEDULED;
      }
    } else {
      return UserAppointmentFilterEnum.SCHEDULED;
    }
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  filterScheduled() {
    this.resetPage();
    this.filterEnum = UserAppointmentFilterEnum.SCHEDULED;
    this.setfilter();
    this.queryAppointments();
  }

  filterHistory() {
    this.resetPage();
    this.filterEnum = UserAppointmentFilterEnum.HISTORY;
    this.setfilter();
    this.queryAppointments();
  }

  resetPage() {
    this.currentPage = 1;
    this.pageCount = 1;
  }

  queryAppointments() {
    this.appointmentFilterValue = UserAppointmentFilterEnum[this.filterEnum]
                                            .charAt(0).toUpperCase() + UserAppointmentFilterEnum[this.filterEnum]
                                            .slice(1).toLocaleLowerCase();

    this.userAppointmentService.getUserAppointmentsWithReoccurring(UserAppointmentFilterEnum[this.filterEnum], this.currentPage).subscribe(
        appointmentListResultDTO => {
            this.appointments = appointmentListResultDTO.appointments;

          this.currentPage = appointmentListResultDTO.currentPage;
          this.pageCount = appointmentListResultDTO.pageCount;
          window.scrollTo(0, 0);
        });
  }

    setfilter() {
      // this.router.navigate(['appointments'], { 
      //   queryParams: {filter: UserAppointmentFilterEnum[this.filterEnum], page: this.currentPage + ''} });
      this.setfilterReplace(UserAppointmentFilterEnum[this.filterEnum], this.currentPage + '');
  }

  setfilterReplace(filterStr: string, page: string) {
      this.router.navigate([],
      { relativeTo: this.activatedRoute, queryParams: {filter: filterStr, page: page}, replaceUrl: true });
  }

  canNavigateForward() {
    return this.currentPage < this.pageCount;
  }

  canNavigateBackward() {
    return this.currentPage > 1;
  }

  navigateForward() {
    this.currentPage = this.currentPage + 1;
    this.setfilter();
    this.queryAppointments();
  }

  navigateBackward() {
    this.currentPage  = this.currentPage - 1;
    this.setfilter();
    this.queryAppointments();
  }

  goToDetail(appointmentId: number, reoccurringAppointmentParentId: number, startDate: string) {
    // If the call to instantiate an appointment is currently processing do nothing
    if(this.instantiatingAppointment) {
      return;
    }

    // If viewing a generated appointment, instantiate it first
    if(appointmentId == 0) {
      // set the instantiating flat to true so no other appointments can be selected during this time
      this.instantiatingAppointment = true;
      let startDateIsoFormat = DateUtil.formattedDateToIso(startDate, 'dddd, MMMM Do, YYYY hh:mma');
      
      this.userAppointmentService.initializeReoccurringAppointment(reoccurringAppointmentParentId, startDateIsoFormat).subscribe(instantiatedAppointmentId => {
        this.router.navigate(['appointments', instantiatedAppointmentId]);
      }, error => {
          this.instantiatingAppointment = false;
          location.reload();
      });
    } else {
      this.router.navigate(['appointments', appointmentId]);
    }
  }
}