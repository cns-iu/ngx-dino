import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoundLegendComponent } from './bound-legend.component';

describe('BoundLegendComponent', () => {
  let component: BoundLegendComponent;
  let fixture: ComponentFixture<BoundLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoundLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoundLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
