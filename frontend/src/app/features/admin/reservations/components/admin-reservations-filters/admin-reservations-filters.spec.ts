import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReservationsFilters } from './admin-reservations-filters';

describe('AdminReservationsFilters', () => {
  let component: AdminReservationsFilters;
  let fixture: ComponentFixture<AdminReservationsFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReservationsFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminReservationsFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
