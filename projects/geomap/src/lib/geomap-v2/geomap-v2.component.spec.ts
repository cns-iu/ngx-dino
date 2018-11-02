import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeomapV2Component } from './geomap-v2.component';

describe('GeomapV2Component', () => {
  let component: GeomapV2Component;
  let fixture: ComponentFixture<GeomapV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeomapV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeomapV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
