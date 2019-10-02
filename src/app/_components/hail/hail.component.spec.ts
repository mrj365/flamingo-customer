/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HailComponent } from './hail.component';

describe('HailComponent', () => {
  let component: HailComponent;
  let fixture: ComponentFixture<HailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});