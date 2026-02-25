import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRomsPage } from './admin-roms-page';

describe('AdminRomsPage', () => {
  let component: AdminRomsPage;
  let fixture: ComponentFixture<AdminRomsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRomsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRomsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
