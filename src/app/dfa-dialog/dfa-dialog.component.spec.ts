import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DfaDialogComponent } from './dfa-dialog.component';

describe('DfaDialogComponent', () => {
  let component: DfaDialogComponent;
  let fixture: ComponentFixture<DfaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DfaDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DfaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
