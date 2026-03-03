import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBookingFilters } from './hotel-booking-filters';

describe('HotelBookingFilters', () => {
  let component: HotelBookingFilters;
  let fixture: ComponentFixture<HotelBookingFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelBookingFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelBookingFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
