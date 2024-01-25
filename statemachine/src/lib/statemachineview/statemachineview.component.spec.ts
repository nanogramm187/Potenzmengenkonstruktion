import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatemachineviewComponent } from './statemachineview.component';

describe('StatemachineviewComponent', () => {
  let component: StatemachineviewComponent;
  let fixture: ComponentFixture<StatemachineviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatemachineviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatemachineviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
