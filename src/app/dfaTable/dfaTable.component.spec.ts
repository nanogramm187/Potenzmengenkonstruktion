import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DfaTableComponent } from './dfaTable.component';

describe('DfaTableComponent', () => {
  let component: DfaTableComponent;
  let fixture: ComponentFixture<DfaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DfaTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DfaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
