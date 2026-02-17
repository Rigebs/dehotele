import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReservationPage } from './create-reservation-page';

describe('CreateReservationPage', () => {
  let component: CreateReservationPage;
  let fixture: ComponentFixture<CreateReservationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateReservationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateReservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
