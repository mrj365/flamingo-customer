/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpUtilService } from './http-util.service';

describe('Service: HttpUtil', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpUtilService]
    });
  });

  it('should ...', inject([HttpUtilService], (service: HttpUtilService) => {
    expect(service).toBeTruthy();
  }));
});