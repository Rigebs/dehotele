import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelRoomCard } from './hotel-room-card';

describe('HotelRoomCard', () => {
  let component: HotelRoomCard;
  let fixture: ComponentFixture<HotelRoomCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelRoomCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelRoomCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
