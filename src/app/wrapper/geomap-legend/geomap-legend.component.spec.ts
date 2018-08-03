import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeomapLegendComponent } from './geomap-legend.component';

describe('GeomapLegendComponent', () => {
  let component: GeomapLegendComponent;
  let fixture: ComponentFixture<GeomapLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeomapLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeomapLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
