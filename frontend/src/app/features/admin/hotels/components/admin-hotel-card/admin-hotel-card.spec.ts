import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHotelCard } from './admin-hotel-card';

describe('AdminHotelCard', () => {
  let component: AdminHotelCard;
  let fixture: ComponentFixture<AdminHotelCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHotelCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHotelCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
