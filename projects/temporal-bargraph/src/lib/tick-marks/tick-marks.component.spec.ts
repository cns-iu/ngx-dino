import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TickMarksComponent } from './tick-marks.component';

describe('TickMarksComponent', () => {
  let component: TickMarksComponent;
  let fixture: ComponentFixture<TickMarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TickMarksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TickMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
