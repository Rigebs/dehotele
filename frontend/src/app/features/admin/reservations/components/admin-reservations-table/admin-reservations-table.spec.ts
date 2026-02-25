import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReservationsTable } from './admin-reservations-table';

describe('AdminReservationsTable', () => {
  let component: AdminReservationsTable;
  let fixture: ComponentFixture<AdminReservationsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReservationsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReservationsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
