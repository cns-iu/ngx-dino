import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VegaUtilComponent } from './vega-util.component';

describe('VegaUtilComponent', () => {
  let component: VegaUtilComponent;
  let fixture: ComponentFixture<VegaUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VegaUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VegaUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
