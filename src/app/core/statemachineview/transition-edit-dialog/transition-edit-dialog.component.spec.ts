import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionEditDialogComponent } from './transition-edit-dialog.component';

describe('TransitionEditDialogComponent', () => {
  let component: TransitionEditDialogComponent;
  let fixture: ComponentFixture<TransitionEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransitionEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransitionEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
