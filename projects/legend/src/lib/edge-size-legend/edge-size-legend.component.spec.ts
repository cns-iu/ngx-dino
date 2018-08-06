import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgeSizeLegendComponent } from './edge-size-legend.component';

describe('EdgeSizeLegendComponent', () => {
  let component: EdgeSizeLegendComponent;
  let fixture: ComponentFixture<EdgeSizeLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdgeSizeLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdgeSizeLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
