import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStaffEditComponent } from './admin-staff-edit.component';

describe('AdminStaffEditComponent', () => {
  let component: AdminStaffEditComponent;
  let fixture: ComponentFixture<AdminStaffEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStaffEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStaffEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
