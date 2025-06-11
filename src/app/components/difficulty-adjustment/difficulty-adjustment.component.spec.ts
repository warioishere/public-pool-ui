import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifficultyAdjustmentComponent } from './difficulty-adjustment.component';

describe('DifficultyAdjustmentComponent', () => {
  let component: DifficultyAdjustmentComponent;
  let fixture: ComponentFixture<DifficultyAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DifficultyAdjustmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DifficultyAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
