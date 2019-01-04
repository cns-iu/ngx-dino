import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrokeWidthLegendComponent } from './stroke-width-legend.component';

describe('StrokeWidthLegendComponent', () => {
  let component: StrokeWidthLegendComponent;
  let fixture: ComponentFixture<StrokeWidthLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrokeWidthLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrokeWidthLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
