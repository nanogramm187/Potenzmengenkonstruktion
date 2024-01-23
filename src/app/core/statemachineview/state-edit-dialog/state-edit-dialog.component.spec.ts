import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateEditDialogComponent } from './state-edit-dialog.component';

describe('StateEditDialogComponent', () => {
  let component: StateEditDialogComponent;
  let fixture: ComponentFixture<StateEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StateEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
