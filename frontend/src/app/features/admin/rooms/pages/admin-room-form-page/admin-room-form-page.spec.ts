import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoomFormPage } from './admin-room-form-page';

describe('AdminRoomFormPage', () => {
  let component: AdminRoomFormPage;
  let fixture: ComponentFixture<AdminRoomFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRoomFormPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRoomFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
