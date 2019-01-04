import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorHueLegendComponent } from './color-hue-legend.component';

describe('ColorHueLegendComponent', () => {
  let component: ColorHueLegendComponent;
  let fixture: ComponentFixture<ColorHueLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorHueLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorHueLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
