/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GiftComponent } from './gift.component';

describe('GiftComponent', () => {
  let component: GiftComponent;
  let fixture: ComponentFixture<GiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
