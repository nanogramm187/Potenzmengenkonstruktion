import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcaseviewComponent } from './testcaseview.component';

describe('TestcaseviewComponent', () => {
  let component: TestcaseviewComponent;
  let fixture: ComponentFixture<TestcaseviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestcaseviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestcaseviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
