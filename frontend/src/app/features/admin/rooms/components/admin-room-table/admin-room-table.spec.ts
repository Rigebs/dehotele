import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoomTable } from './admin-room-table';

describe('AdminRoomTable', () => {
  let component: AdminRoomTable;
  let fixture: ComponentFixture<AdminRoomTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRoomTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRoomTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
