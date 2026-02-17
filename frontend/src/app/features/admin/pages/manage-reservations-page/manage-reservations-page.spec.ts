import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReservationsPage } from './manage-reservations-page';

describe('ManageReservationsPage', () => {
  let component: ManageReservationsPage;
  let fixture: ComponentFixture<ManageReservationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageReservationsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageReservationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
