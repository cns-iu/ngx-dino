import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeSizeLegendComponent } from './node-size-legend.component';

describe('EdgeSizeLegendComponent', () => {
  let component: NodeSizeLegendComponent;
  let fixture: ComponentFixture<NodeSizeLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeSizeLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeSizeLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
