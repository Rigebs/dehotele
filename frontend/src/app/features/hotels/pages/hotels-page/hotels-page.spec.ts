import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsPage } from './hotels-page';

describe('HotelsPage', () => {
  let component: HotelsPage;
  let fixture: ComponentFixture<HotelsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
