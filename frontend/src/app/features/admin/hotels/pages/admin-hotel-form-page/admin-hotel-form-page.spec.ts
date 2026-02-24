import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHotelFormPage } from './admin-hotel-form-page';

describe('AdminHotelFormPage', () => {
  let component: AdminHotelFormPage;
  let fixture: ComponentFixture<AdminHotelFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHotelFormPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHotelFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
