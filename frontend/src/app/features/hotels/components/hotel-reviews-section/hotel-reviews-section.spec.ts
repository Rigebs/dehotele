import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelReviewsSection } from './hotel-reviews-section';

describe('HotelReviewsSection', () => {
  let component: HotelReviewsSection;
  let fixture: ComponentFixture<HotelReviewsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelReviewsSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelReviewsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
