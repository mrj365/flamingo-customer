/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StorefrontService } from './storefront.service';

describe('Service: Storefront', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorefrontService]
    });
  });

  it('should ...', inject([StorefrontService], (service: StorefrontService) => {
    expect(service).toBeTruthy();
  }));
});