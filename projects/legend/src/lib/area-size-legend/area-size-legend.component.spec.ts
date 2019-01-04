import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaSizeLegendComponent } from './area-size-legend.component';

describe('AreaSizeLegendComponent', () => {
  let component: AreaSizeLegendComponent;
  let fixture: ComponentFixture<AreaSizeLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaSizeLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaSizeLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
