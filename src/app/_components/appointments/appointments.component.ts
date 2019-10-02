import { environment } from 'environments/environment';
import { UserAppointmentService } from './../../_services/user-appointment.service.service';
import { AppointmentResultDTO } from './../../_models/dto/appointment-result-dto';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserAppointmentFilterEnum } from '../../_models/_enums/user-appointment-filter-enum.enum';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  public currentPage = 1;
  public pageCount = 1;

  //Capitalize only the first letter of enum value
  public appointmentFilterValue: string = UserAppointmentFilterEnum[UserAppointmentFilterEnum.SCHEDULED]
                                            .charAt(0).toUpperCase() + UserAppointmentFilterEnum[UserAppointmentFilterEnum.SCHEDULED]
                                            .slice(1).toLocaleLowerCase();

  public filterEnum: UserAppointmentFilterEnum = UserAppointmentFilterEnum.SCHEDULED;

  appointments: AppointmentResultDTO[] = [];
  

  constructor(private router: Router, private userAppointmentService: UserAppointmentService,
                private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    let filter = this.activatedRoute.snapshot.queryParams['filter'];

    if(filter === UserAppointmentFilterEnum[UserAppointmentFilterEnum.HISTORY]) {
      this.filterHistory();
    } else {
      this.filterScheduled();
    }

  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  goToDetail(appointmentId: number) {
    this.router.navigate(['appointments', appointmentId]);
  }

  filterScheduled() {
    this.queryAppointments(UserAppointmentFilterEnum.SCHEDULED);
  }

  filterHistory() {
    this.queryAppointments(UserAppointmentFilterEnum.HISTORY);
  }

  queryAppointments(filter: UserAppointmentFilterEnum) {
    this.appointmentFilterValue = UserAppointmentFilterEnum[filter]
                                            .charAt(0).toUpperCase() + UserAppointmentFilterEnum[filter]
                                            .slice(1).toLocaleLowerCase();

    this.setfilter(UserAppointmentFilterEnum[filter]);
    this.filterEnum = filter;


    this.userAppointmentService.getUserAppointments(filter, this.currentPage).subscribe(
        appointmentListResultDTO => {
            this.appointments = appointmentListResultDTO.appointments;

            
          this.currentPage = appointmentListResultDTO.currentPage;
          this.pageCount = appointmentListResultDTO.pageCount;
          window.scrollTo(0, 0);
        });
  }

  setfilter(filterStr: string) {
      this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: {filter: filterStr} });
  }

  canNavigateForward() {
    return this.currentPage < this.pageCount;
  }

  canNavigateBackward() {
    return this.currentPage > 1;
  }

  navigateForward() {
    this.currentPage = this.currentPage + 1;
    this.queryAppointments(this.filterEnum);
  }

  navigateBackward() {
    this.currentPage  = this.currentPage - 1;
    this.queryAppointments(this.filterEnum);
  }
}