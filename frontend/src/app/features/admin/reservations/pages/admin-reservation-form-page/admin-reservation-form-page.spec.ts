import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReservationFormPage } from './admin-reservation-form-page';

describe('AdminReservationFormPage', () => {
  let component: AdminReservationFormPage;
  let fixture: ComponentFixture<AdminReservationFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReservationFormPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReservationFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
