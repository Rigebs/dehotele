import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReservationDetail } from './admin-reservation-detail';

describe('AdminReservationDetail', () => {
  let component: AdminReservationDetail;
  let fixture: ComponentFixture<AdminReservationDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReservationDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReservationDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
