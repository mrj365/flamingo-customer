/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FacebookUserService } from './facebook-user.service';

describe('Service: FacebookUser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacebookUserService]
    });
  });

  it('should ...', inject([FacebookUserService], (service: FacebookUserService) => {
    expect(service).toBeTruthy();
  }));
});