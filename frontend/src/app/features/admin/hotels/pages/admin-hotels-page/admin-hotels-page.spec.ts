import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHotelsPage } from './admin-hotels-page';

describe('AdminHotelsPage', () => {
  let component: AdminHotelsPage;
  let fixture: ComponentFixture<AdminHotelsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHotelsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHotelsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
