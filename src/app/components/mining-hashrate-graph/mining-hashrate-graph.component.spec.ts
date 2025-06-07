import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningHashrateGraphComponent } from './mining-hashrate-graph.component';

describe('MiningHashrateGraphComponent', () => {
  let component: MiningHashrateGraphComponent;
  let fixture: ComponentFixture<MiningHashrateGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiningHashrateGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiningHashrateGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
