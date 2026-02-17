import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelDetailsPage } from './hotel-details-page';

describe('HotelDetailsPage', () => {
  let component: HotelDetailsPage;
  let fixture: ComponentFixture<HotelDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
