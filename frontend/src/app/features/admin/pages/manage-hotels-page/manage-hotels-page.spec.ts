import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHotelsPage } from './manage-hotels-page';

describe('ManageHotelsPage', () => {
  let component: ManageHotelsPage;
  let fixture: ComponentFixture<ManageHotelsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageHotelsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageHotelsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
