import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartLegendComponent } from './start-legend.component';

describe('StartLegendComponent', () => {
  let component: StartLegendComponent;
  let fixture: ComponentFixture<StartLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
