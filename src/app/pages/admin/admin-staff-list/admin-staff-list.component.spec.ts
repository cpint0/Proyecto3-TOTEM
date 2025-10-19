import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStaffListComponent } from './admin-staff-list.component';

describe('AdminStaffListComponent', () => {
  let component: AdminStaffListComponent;
  let fixture: ComponentFixture<AdminStaffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStaffListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStaffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
