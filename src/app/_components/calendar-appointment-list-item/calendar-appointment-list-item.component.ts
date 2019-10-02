import { AppointmentResultDTO } from './../../_models/dto/appointment-result-dto';
import { Component, OnInit, Input, ElementRef, ViewChild, NgZone, ChangeDetectorRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-calendar-appointment-list-item',
  templateUrl: './calendar-appointment-list-item.component.html',
  styleUrls: ['./calendar-appointment-list-item.component.css']
})
export class CalendarAppointmentListItemComponent implements OnInit {

  @Input('appointment')
  public appointment: AppointmentResultDTO;

  @ViewChild('appointmentContainer') elementView: ElementRef;
  
  public smallContainer: boolean = false;
  public tinyContainer: boolean = false;
  

  constructor(private ngZone:NgZone, private cdr: ChangeDetectorRef) { 

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);

    setTimeout(() => {
        this.calculateSize();
    }, 1);

       
   }

@HostListener('window:resize', ['$event'])
onResize(event) {
  this.calculateSize();
}

  public calculateSize() {
    let width = this.elementView.nativeElement.offsetWidth;

    if(width < 220) {
      this.smallContainer = true;
    } else {
      this.smallContainer = false;
    }

    if(width < 180) {
      this.tinyContainer = true;
    } else {
      this.tinyContainer = false;
    }

    console.log(this.smallContainer);
  }

}