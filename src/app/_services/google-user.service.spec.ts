/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GoogleUserService } from './google-user.service';

describe('Service: GoogleUser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleUserService]
    });
  });

  it('should ...', inject([GoogleUserService], (service: GoogleUserService) => {
    expect(service).toBeTruthy();
  }));
});