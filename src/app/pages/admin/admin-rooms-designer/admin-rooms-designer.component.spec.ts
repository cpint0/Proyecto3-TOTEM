import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoomsDesignerComponent } from './admin-rooms-designer.component';

describe('AdminRoomsDesignerComponent', () => {
  let component: AdminRoomsDesignerComponent;
  let fixture: ComponentFixture<AdminRoomsDesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRoomsDesignerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRoomsDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
