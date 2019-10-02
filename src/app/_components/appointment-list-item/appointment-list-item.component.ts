import { AppointmentResultDTO } from './../../_models/dto/appointment-result-dto';
import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment.demolaundry';
import * as moment from 'moment';


@Component({
  selector: 'app-appointment-list-item',
  templateUrl: './appointment-list-item.component.html',
  styleUrls: ['./appointment-list-item.component.css']
})
export class AppointmentListItemComponent implements OnInit {

  @Input('appointment')
  public appointment: AppointmentResultDTO;

  enableTimeSelection = environment.enableTimeSelection;

  constructor() { }

  ngOnInit() {
    // this.getFormattedDate();
  }

  getFormattedDate(): string {
    if(!this.enableTimeSelection && this.appointment && this.appointment.startDate) {
      return moment(this.appointment.startDate).format('dddd, MMMM Do YYYY');
    } else {
      return this.appointment.startDate;
    }
  }

}