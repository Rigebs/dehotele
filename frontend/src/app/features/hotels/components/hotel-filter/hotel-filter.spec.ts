import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelFilter } from './hotel-filter';

describe('HotelFilter', () => {
  let component: HotelFilter;
  let fixture: ComponentFixture<HotelFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
