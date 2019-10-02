/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserAppointment.serviceService } from './user-appointment.service.service';

describe('Service: UserAppointment.service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAppointment.serviceService]
    });
  });

  it('should ...', inject([UserAppointment.serviceService], (service: UserAppointment.serviceService) => {
    expect(service).toBeTruthy();
  }));
});